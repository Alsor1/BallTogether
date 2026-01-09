/** Serviciu pentru gestionarea logicii de business si validarea evenimentelor
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
package com.balltogether.backend.service;

import com.balltogether.backend.entity.Event;
import com.balltogether.backend.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAllNative();
    }

    public void createEvent(Event event) {
        // Validarea campurilor introduse (Cerinta A.1)
        if (event.getStartTime() == null || event.getEndTime() == null) {
            throw new IllegalStateException("Start and end times are required.");
        }
        if (event.getStartTime().isAfter(event.getEndTime())) {
            throw new IllegalStateException("Start time must be before end time.");
        }
        
        eventRepository.insertEventNative(
            event.getHost().getId(),
            event.getLocation().getId(),
            event.getSport().getId(),
            event.getStartTime(),
            event.getEndTime(),
            "PLANNED" // Initial status
        );
    }

    public void updateEventStatus(Long id, String status) {
        // Logica pentru colectie de activitati: in desfasurare, suspendata, finalizata (Cerinta A.2)
        eventRepository.updateStatusNative(id, status);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteNative(id);
    }
}