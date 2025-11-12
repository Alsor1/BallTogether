package com.balltogether.backend.service;

import com.balltogether.backend.entity.Users;
import com.balltogether.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Users registerUser(Users users) {
        if (userRepository.existsByEmail(users.getEmail())) {
            throw new IllegalStateException("Email is already taken");
        }

        if(users.getRole() == null || users.getRole().isEmpty()) {
            users.setRole("USER"); // Default role
        }
        return userRepository.save(users);
    }

    // 👇 Add this method for Login logic
    public Users loginUser(String username, String password) {
        // 1. Find users by username
        Optional<Users> userOptional = userRepository.findByUsername(username);

        // 2. Check if users exists AND password matches
        if (userOptional.isPresent()) {
            Users users = userOptional.get();
            if (users.getPassword().equals(password)) {
                return users; // Login success
            }
        }
        
        return null; // Login failed
    }
}