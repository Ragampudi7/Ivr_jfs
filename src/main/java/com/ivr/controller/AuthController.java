package com.ivr.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.ivr.model.AuthUser;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthUser user) {

        if (user.getUsername().equals("admin") &&
                user.getPassword().equals("1234")) {

            return ResponseEntity.ok("Login Successful");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid Credentials");
    }
}