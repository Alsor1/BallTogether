package com.balltogether.backend.controller;

import com.balltogether.backend.entity.*;
import com.balltogether.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RefereeRepository refereeRepository;

    @Autowired
    private SportRepository sportRepository;

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            // Check if user exists
            Optional<Users> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Check if user is a referee and remove referee entry first
            Optional<Referee> refereeOpt = refereeRepository.findByUserId(id);
            if (refereeOpt.isPresent()) {
                refereeRepository.delete(refereeOpt.get());
            }

            // Remove user from all events as participant
            List<Event> events = eventRepository.findAll();
            for (Event event : events) {
                event.getParticipants().removeIf(u -> u.getId().equals(id));
                eventRepository.save(event);
            }

            // Delete events where user is host
            List<Event> hostedEvents = eventRepository.findByHostId(id);
            eventRepository.deleteAll(hostedEvents);

            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error deleting user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String newRole = payload.get("role");
            if (newRole == null || (!newRole.equals("User") && !newRole.equals("Admin") && !newRole.equals("Referee"))) {
                return ResponseEntity.badRequest().body("Invalid role. Must be 'User', 'Admin', or 'Referee'");
            }

            Optional<Users> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Users user = userOpt.get();
            user.setRole(newRole);
            userRepository.save(user);

            return ResponseEntity.ok("User role updated to " + newRole);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating role: " + e.getMessage());
        }
    }

    // ==================== REFEREE MANAGEMENT ====================

    @GetMapping("/referees")
    public ResponseEntity<List<Referee>> getAllReferees() {
        return ResponseEntity.ok(refereeRepository.findAll());
    }

    @PostMapping("/referees")
    public ResponseEntity<?> makeUserReferee(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String bio = (String) payload.getOrDefault("bio", "");
            Double ratePerHour = Double.valueOf(payload.getOrDefault("ratePerHour", 50.0).toString());
            String imageUrl = (String) payload.getOrDefault("imageUrl", "");

            Optional<Users> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Check if already a referee
            Optional<Referee> existingReferee = refereeRepository.findByUserId(userId);
            if (existingReferee.isPresent()) {
                return ResponseEntity.badRequest().body("User is already a referee");
            }

            Users user = userOpt.get();
            user.setRole("Referee");
            userRepository.save(user);

            Referee referee = new Referee();
            referee.setUser(user);
            referee.setBio(bio);
            referee.setRatePerHour(BigDecimal.valueOf(ratePerHour));
            referee.setImageUrl(imageUrl);

            // Handle sports if provided
            if (payload.containsKey("sportIds")) {
                @SuppressWarnings("unchecked")
                List<Integer> sportIds = (List<Integer>) payload.get("sportIds");
                Set<Sport> sports = new HashSet<>();
                for (Integer sportId : sportIds) {
                    sportRepository.findById(sportId.longValue()).ifPresent(sports::add);
                }
                referee.setSports(sports);
            }

            refereeRepository.save(referee);
            return ResponseEntity.ok("User is now a referee");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating referee: " + e.getMessage());
        }
    }

    @DeleteMapping("/referees/{id}")
    public ResponseEntity<?> revokeReferee(@PathVariable Long id) {
        try {
            Optional<Referee> refereeOpt = refereeRepository.findById(id);
            if (refereeOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Referee not found");
            }

            Referee referee = refereeOpt.get();
            Users user = referee.getUser();
            
            // Remove referee from all events
            List<Event> events = eventRepository.findByRefereeUserId(user.getId());
            for (Event event : events) {
                event.setReferee(null);
                eventRepository.save(event);
            }

            // Update user role back to User
            user.setRole("User");
            userRepository.save(user);

            refereeRepository.delete(referee);
            return ResponseEntity.ok("Referee status revoked");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error revoking referee: " + e.getMessage());
        }
    }

    // ==================== EVENT MANAGEMENT ====================

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            if (!eventRepository.existsById(id)) {
                return ResponseEntity.badRequest().body("Event not found");
            }
            eventRepository.deleteById(id);
            return ResponseEntity.ok("Event deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error deleting event: " + e.getMessage());
        }
    }

    @PostMapping("/events/{eventId}/participants")
    public ResponseEntity<?> addParticipant(@PathVariable Long eventId, @RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Event not found");
            }

            Optional<Users> userOpt = userRepository.findByEmail(email.trim());
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Event event = eventOpt.get();
            Users user = userOpt.get();

            if (event.getParticipants().contains(user)) {
                return ResponseEntity.badRequest().body("User is already a participant");
            }

            event.getParticipants().add(user);
            eventRepository.save(event);

            return ResponseEntity.ok("Participant added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error adding participant: " + e.getMessage());
        }
    }

    @DeleteMapping("/events/{eventId}/participants/{userId}")
    public ResponseEntity<?> removeParticipant(@PathVariable Long eventId, @PathVariable Long userId) {
        try {
            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Event not found");
            }

            Event event = eventOpt.get();
            boolean removed = event.getParticipants().removeIf(u -> u.getId().equals(userId));
            
            if (!removed) {
                return ResponseEntity.badRequest().body("User is not a participant of this event");
            }

            eventRepository.save(event);
            return ResponseEntity.ok("Participant removed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error removing participant: " + e.getMessage());
        }
    }

    @PutMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }

            Optional<Event> eventOpt = eventRepository.findById(id);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Event not found");
            }

            Event event = eventOpt.get();
            event.setStatus(status);
            eventRepository.save(event);

            return ResponseEntity.ok("Event status updated to " + status);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating status: " + e.getMessage());
        }
    }

    // ==================== LOCATION (FIELD) MANAGEMENT ====================

    @GetMapping("/locations")
    public ResponseEntity<List<Location>> getAllLocations() {
        return ResponseEntity.ok(locationRepository.findAllLocationsNative());
    }

    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(@RequestBody Map<String, Object> payload) {
        try {
            Location location = new Location();
            location.setName((String) payload.get("name"));
            location.setAddress((String) payload.get("address"));
            location.setPrice(Double.valueOf(payload.getOrDefault("price", 0).toString()));
            location.setPlayers(Integer.valueOf(payload.getOrDefault("capacity", 10).toString()));
            location.setLatitude(Double.valueOf(payload.getOrDefault("latitude", 0).toString()));
            location.setLongitude(Double.valueOf(payload.getOrDefault("longitude", 0).toString()));
            location.setImageUrl((String) payload.getOrDefault("imageUrl", ""));

            // Handle sports if provided
            if (payload.containsKey("sportIds")) {
                @SuppressWarnings("unchecked")
                List<Integer> sportIds = (List<Integer>) payload.get("sportIds");
                Set<Sport> sports = new HashSet<>();
                for (Integer sportId : sportIds) {
                    sportRepository.findById(sportId.longValue()).ifPresent(sports::add);
                }
                location.setSports(sports);
            }

            locationRepository.save(location);
            return ResponseEntity.ok("Location created successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating location: " + e.getMessage());
        }
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Optional<Location> locationOpt = locationRepository.findById(id);
            if (locationOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Location not found");
            }

            Location location = locationOpt.get();
            
            if (payload.containsKey("name")) location.setName((String) payload.get("name"));
            if (payload.containsKey("address")) location.setAddress((String) payload.get("address"));
            if (payload.containsKey("price")) location.setPrice(Double.valueOf(payload.get("price").toString()));
            if (payload.containsKey("capacity")) location.setPlayers(Integer.valueOf(payload.get("capacity").toString()));
            if (payload.containsKey("latitude")) location.setLatitude(Double.valueOf(payload.get("latitude").toString()));
            if (payload.containsKey("longitude")) location.setLongitude(Double.valueOf(payload.get("longitude").toString()));
            if (payload.containsKey("imageUrl")) location.setImageUrl((String) payload.get("imageUrl"));

            if (payload.containsKey("sportIds")) {
                @SuppressWarnings("unchecked")
                List<Integer> sportIds = (List<Integer>) payload.get("sportIds");
                Set<Sport> sports = new HashSet<>();
                for (Integer sportId : sportIds) {
                    sportRepository.findById(sportId.longValue()).ifPresent(sports::add);
                }
                location.setSports(sports);
            }

            locationRepository.save(location);
            return ResponseEntity.ok("Location updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating location: " + e.getMessage());
        }
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable Long id) {
        try {
            if (!locationRepository.existsById(id)) {
                return ResponseEntity.badRequest().body("Location not found");
            }

            // Check if location is used in any events
            List<Event> eventsAtLocation = eventRepository.findByLocationId(id);
            if (!eventsAtLocation.isEmpty()) {
                return ResponseEntity.badRequest().body("Cannot delete location: it has " + eventsAtLocation.size() + " events scheduled. Delete those events first.");
            }

            locationRepository.deleteById(id);
            return ResponseEntity.ok("Location deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error deleting location: " + e.getMessage());
        }
    }

    // ==================== SPORTS MANAGEMENT ====================

    @GetMapping("/sports")
    public ResponseEntity<List<Sport>> getAllSports() {
        return ResponseEntity.ok(sportRepository.findAll());
    }
}
