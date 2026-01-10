/** Clasa pentru EventService
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
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
            "PLANNED"
        );
    }

    public void updateEventStatus(Long id, String status) {
        eventRepository.updateStatusNative(id, status);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteNative(id);
    }
}