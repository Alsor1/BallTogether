package com.balltogether.backend.repository;

import com.balltogether.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    @Query(value = "SELECT * FROM users WHERE username = :username", nativeQuery = true)
    Optional<Users> findByUsernameNative(String username);

    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Optional<Users> findByEmailNative(String email);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO users (username, password, email, role) VALUES (:username, :password, :email, :role)", nativeQuery = true)
    void insertUserNative(String username, String password, String email, String role);

    @Query(value = "SELECT COUNT(*) FROM users WHERE email = :email", nativeQuery = true)
    int countEmailUsage(@Param("email") String email);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO users (username, email, password, role) VALUES (:username, :email, :password, :role)", nativeQuery = true)
    void saveUserNative(@Param("username") String username,
                        @Param("email") String email,
                        @Param("password") String password,
                        @Param("role") String role);
}