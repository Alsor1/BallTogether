package com.balltogether.backend.service;

import com.balltogether.backend.entity.Users;
import com.balltogether.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(Users user) {
        int count = userRepository.countEmailUsage(user.getEmail());
        if (count > 0) {
            throw new IllegalStateException("Email is already taken");
        }

        if (user.getRole() == null) {
            user.setRole("USER");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        userRepository.saveUserNative(
            user.getUsername(),
            user.getEmail(),
            hashedPassword,
            user.getRole()
        );
    }

    public Users loginUser(String username, String password) {
        Optional<Users> userOptional = userRepository.findByUsernameNative(username);

        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        
        return null;
    }
}