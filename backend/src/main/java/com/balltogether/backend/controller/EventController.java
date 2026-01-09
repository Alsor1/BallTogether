/** Clasa Controller pentru operatii CRUD pe colectia de Evenimente
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
package com.balltogether.backend.controller;

import com.balltogether.backend.entity.Event;
import com.balltogether.backend.entity.Users;
import com.balltogether.backend.repository.EventRepository;
import com.balltogether.backend.repository.UserRepository;
import com.balltogether.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obține toate evenimentele relevante pentru utilizator (Gazdă SAU Participant)
    @GetMapping("/user/{identifier}")
    public ResponseEntity<List<Event>> getEventsByUser(@PathVariable String identifier) {
        try {
            List<Event> events;
            if (identifier.matches("\\d+")) {
                Long userId = Long.parseLong(identifier);
                events = eventRepository.findAllRelatedToUser(userId);
            } else {
                events = eventRepository.findByHostEmail(identifier);
            }
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    // --- ENDPOINT NOU: Invită Utilizator ---
    @PostMapping("/{eventId}/invite")
    public ResponseEntity<?> inviteUser(@PathVariable Long eventId, @RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            // Verifică dacă evenimentul există
            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isEmpty()) {
                // Listează evenimentele existente pentru debug
                List<Event> allEvents = eventRepository.findAll();
                String existingIds = allEvents.stream()
                    .map(e -> e.getId().toString())
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("none");
                return ResponseEntity.badRequest()
                    .body("Event with ID " + eventId + " not found. Existing event IDs: " + existingIds);
            }
            
            Event event = eventOpt.get();
            
            // Verifică dacă utilizatorul există
            Optional<Users> userOpt = userRepository.findByEmail(email.trim());
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User with email '" + email + "' does not exist");
            }
            
            Users userToInvite = userOpt.get();

            // Verifică dacă este deja host
            if (event.getHost() != null && event.getHost().getId().equals(userToInvite.getId())) {
                return ResponseEntity.badRequest().body("User is already the host of this event");
            }

            // Verifică dacă este deja participant
            if (event.getParticipants() != null && event.getParticipants().contains(userToInvite)) {
                return ResponseEntity.badRequest().body("User is already participating");
            }

            // Adaugă participantul
            event.getParticipants().add(userToInvite);
            eventRepository.save(event);

            return ResponseEntity.ok("User invited successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<String> createEvent(@RequestBody Event event) {
        try {
            eventService.createEvent(event);
            return ResponseEntity.ok("Event created successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateEventStatus(@PathVariable Long id, @RequestParam String status) {
        eventService.updateEventStatus(id, status);
        return ResponseEntity.ok("Event status updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("Event deleted");
    }
}