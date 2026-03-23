package com.ivr.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.ivr.model.User;
import com.ivr.repository.UserRepository;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.email);
        
        if (user != null && user.getPassword().equals(request.password)) {
            // For this simple application, we return the user object as proof of login
            // The frontend will store this user and send the ID for protected actions
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid Credentials");
    }
}