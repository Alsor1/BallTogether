/** Clasa pentru EventRepository
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
package com.balltogether.backend.repository;

import com.balltogether.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e")
    List<Event> findAllNative();

    @Query("SELECT e FROM Event e WHERE e.host.id = :hostId")
    List<Event> findByHostId(@Param("hostId") Long hostId);

    @Query("SELECT e FROM Event e WHERE e.host.email = :email")
    List<Event> findByHostEmail(@Param("email") String email);
    
    @Query("SELECT e FROM Event e WHERE e.host.email = :email")
    List<Event> findByHostEmailNative(@Param("email") String email);

    @Query("SELECT DISTINCT e FROM Event e " +
           "LEFT JOIN FETCH e.participants p " +
           "LEFT JOIN FETCH e.referee r " +
           "WHERE e.host.id = :userId " +
           "OR :userId IN (SELECT p.id FROM e.participants p) " +
           "OR (e.referee IS NOT NULL AND e.referee.user.id = :userId)")
    List<Event> findAllRelatedToUser(@Param("userId") Long userId);

    @Query("SELECT e FROM Event e WHERE e.referee.user.id = :userId")
    List<Event> findByRefereeUserId(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO events (host_user_id, location_id, sport_id, start_time, end_time, status) " +
                   "VALUES (:hostId, :locationId, :sportId, :startTime, :endTime, :status)", 
           nativeQuery = true)
    void insertEventNative(@Param("hostId") Long hostId,
                           @Param("locationId") Long locationId,
                           @Param("sportId") Long sportId,
                           @Param("startTime") LocalDateTime startTime,
                           @Param("endTime") LocalDateTime endTime,
                           @Param("status") String status);

    @Modifying
    @Transactional
    @Query(value = "UPDATE events SET status = :status WHERE id = :id", nativeQuery = true)
    void updateStatusNative(@Param("id") Long id, @Param("status") String status);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM events WHERE id = :id", nativeQuery = true)
    void deleteNative(@Param("id") Long id);

    @Query("SELECT e FROM Event e WHERE e.location.id = :locationId AND e.endTime > CURRENT_TIMESTAMP")
    List<Event> findFutureEventsByLocation(@Param("locationId") Long locationId);

    @Query("SELECT e FROM Event e WHERE e.location.id = :locationId")
    List<Event> findByLocationId(@Param("locationId") Long locationId);

    @Query("SELECT e FROM Event e WHERE e.location.id = :locationId AND e.endTime > :now")
    List<Event> findFutureEventsByLocation(@Param("locationId") Long locationId, @Param("now") LocalDateTime now);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Event e " +
           "WHERE e.location.id = :locationId " +
           "AND ((:startTime < e.endTime) AND (:endTime > e.startTime))")
    boolean existsOverlappingEvent(@Param("locationId") Long locationId,
                                   @Param("startTime") LocalDateTime startTime,
                                   @Param("endTime") LocalDateTime endTime);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Event e " +
           "WHERE e.referee.id = :refereeId " +
           "AND ((:startTime < e.endTime) AND (:endTime > e.startTime))")
    boolean existsOverlappingEventForReferee(@Param("refereeId") Long refereeId,
                                              @Param("startTime") LocalDateTime startTime,
                                              @Param("endTime") LocalDateTime endTime);

    @Query("SELECT DISTINCT e.referee.id FROM Event e " +
           "WHERE e.referee IS NOT NULL " +
           "AND ((:startTime < e.endTime) AND (:endTime > e.startTime))")
    List<Long> findBusyRefereeIds(@Param("startTime") LocalDateTime startTime,
                                   @Param("endTime") LocalDateTime endTime);
}