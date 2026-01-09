/** Serviciu pentru Logica de Rezervare (Eveniment + Booking)
 * @author [Your Name]
 * @version 10 Decembrie 2025
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
        
        // 1. Creare Eveniment (Status implicit 'PLANNED')
        bookingRepository.insertEventNative(hostId, locationId, sportId, refereeId, start, end, "PLANNED");
        
        // 2. Obținere ID Eveniment generat
        Long newEventId = bookingRepository.getLastInsertedId();
        
        // 3. Creare Rezervare (Status plată 'PENDING')
        bookingRepository.insertBookingNative(newEventId, hostId, amount, "PENDING", LocalDateTime.now());
    }
}