package com.balltogether.backend.controller;

import com.balltogether.backend.dto.BookingRequest;
import com.balltogether.backend.entity.Event;
import com.balltogether.backend.entity.Location;
import com.balltogether.backend.entity.Users;
import com.balltogether.backend.repository.EventRepository;
import com.balltogether.backend.repository.LocationRepository;
import com.balltogether.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/occupied/{locationId}")
    public ResponseEntity<List<Event>> getOccupiedSlots(@PathVariable Long locationId) {
        return ResponseEntity.ok(eventRepository.findFutureEventsByLocation(locationId));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            LocalDateTime start = LocalDateTime.parse(request.getStartTime());
            LocalDateTime end = LocalDateTime.parse(request.getEndTime());

            boolean isOccupied = eventRepository.existsOverlappingEvent(request.getLocationId(), start, end);
            if (isOccupied) {
                return ResponseEntity.badRequest().body("Selected time slot is already booked.");
            }

            // Create event using JPA (not native query)
            Event event = new Event();
            
            Users host = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            event.setHost(host);
            
            Location location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found"));
            event.setLocation(location);
            
            event.setStartTime(start);
            event.setEndTime(end);
            event.setStatus("PLANNED");
            
            // Use JPA save() - this will properly create the event and return the ID
            Event savedEvent = eventRepository.save(event);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking confirmed!");
            response.put("eventId", savedEvent.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Booking failed: " + e.getMessage());
        }
    }
}