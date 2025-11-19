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
        if (userRepository.countEmailUsage(user.getEmail()) > 0) {
            throw new IllegalStateException("Email is already taken");
        }
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        String hashed = passwordEncoder.encode(user.getPassword());
        userRepository.saveUserNative(
            user.getFullName(),
            user.getEmail(),
            hashed,
            user.getRole()
        );
    }

    public Users loginUser(String email, String password) {
        Optional<Users> userOpt = userRepository.findByEmailNative(email);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }
}