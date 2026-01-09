/** Repository pentru Gestionarea Rezervărilor și Evenimentelor folosind SQL Nativ
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
package com.balltogether.backend.repository;

import com.balltogether.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO events (host_user_id, location_id, sport_id, referee_id, start_time, end_time, status) " +
                   "VALUES (:hostId, :locationId, :sportId, :refereeId, :startTime, :endTime, :status)", nativeQuery = true)
    void insertEventNative(@Param("hostId") Long hostId,
                           @Param("locationId") Long locationId,
                           @Param("sportId") Long sportId,
                           @Param("refereeId") Long refereeId,
                           @Param("startTime") LocalDateTime startTime,
                           @Param("endTime") LocalDateTime endTime,
                           @Param("status") String status);

    @Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
    Long getLastInsertedId();

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO bookings (event_id, payer_user_id, total_amount, payment_status, created_at) " +
                   "VALUES (:eventId, :payerId, :totalAmount, :paymentStatus, :createdAt)", nativeQuery = true)
    void insertBookingNative(@Param("eventId") Long eventId,
                             @Param("payerId") Long payerId,
                             @Param("totalAmount") BigDecimal totalAmount,
                             @Param("paymentStatus") String paymentStatus,
                             @Param("createdAt") LocalDateTime createdAt);
}