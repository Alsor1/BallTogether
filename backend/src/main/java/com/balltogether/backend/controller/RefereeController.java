/** Clasa pentru RefereeController
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
package com.balltogether.backend.controller;

import com.balltogether.backend.dto.RefereeDTO;
import com.balltogether.backend.entity.Referee;
import com.balltogether.backend.entity.Sport;
import com.balltogether.backend.repository.EventRepository;
import com.balltogether.backend.repository.RefereeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/referees")
@CrossOrigin(origins = "http://localhost:3000")
public class RefereeController {

    @Autowired
    private RefereeRepository refereeRepository;

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public ResponseEntity<List<RefereeDTO>> getAllReferees() {
        List<Referee> referees = refereeRepository.findAll();
        return ResponseEntity.ok(convertToDTO(referees, null));
    }

    // Get available referees for time range
    @GetMapping("/available")
    public ResponseEntity<List<RefereeDTO>> getAvailableReferees(
            @RequestParam String startTime,
            @RequestParam String endTime) {
        
        LocalDateTime start = LocalDateTime.parse(startTime);
        LocalDateTime end = LocalDateTime.parse(endTime);
        
        List<Long> busyRefereeIds = eventRepository.findBusyRefereeIds(start, end);
        
        List<Referee> allReferees = refereeRepository.findAll();
        List<Referee> availableReferees = allReferees.stream()
                .filter(ref -> !busyRefereeIds.contains(ref.getId()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(convertToDTO(availableReferees, busyRefereeIds));
    }

    private List<RefereeDTO> convertToDTO(List<Referee> referees, List<Long> busyIds) {
        return referees.stream().map(referee -> {
            List<String> sportNames = referee.getSports().stream()
                    .map(Sport::getName)
                    .collect(Collectors.toList());

            String fullName = (referee.getUser() != null) ? referee.getUser().getFullName() : "Unknown Referee";

            return new RefereeDTO(
                referee.getId(),
                fullName,
                sportNames,
                referee.getBio(),
                referee.getRatePerHour(),
                referee.getImageUrl()
            );
        }).collect(Collectors.toList());
    }
}