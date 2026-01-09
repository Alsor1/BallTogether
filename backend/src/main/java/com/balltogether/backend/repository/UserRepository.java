/** Interfata Repository pentru Utilizatori folosind SQL nativ
 * @author [Your Name]
 * @version 10 Decembrie 2025
 */
package com.balltogether.backend.repository;

import com.balltogether.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
}