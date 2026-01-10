package com.balltogether.backend.repository;

import com.balltogether.backend.entity.Referee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefereeRepository extends JpaRepository<Referee, Long> {
    @Query("SELECT r FROM Referee r WHERE r.user.id = :userId")
    Optional<Referee> findByUserId(@Param("userId") Long userId);
}