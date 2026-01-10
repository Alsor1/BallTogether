/** Clasa pentru BookingService
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
package com.balltogether.backend.service;

import com.balltogether.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public void confirmBooking(Long hostId, Long locationId, Long sportId, Long refereeId, 
                               LocalDateTime start, LocalDateTime end, BigDecimal amount) {
        
        bookingRepository.insertEventNative(hostId, locationId, sportId, refereeId, start, end, "PLANNED");
        
        Long newEventId = bookingRepository.getLastInsertedId();
        
        bookingRepository.insertBookingNative(newEventId, hostId, amount, "PENDING", LocalDateTime.now());
    }
}