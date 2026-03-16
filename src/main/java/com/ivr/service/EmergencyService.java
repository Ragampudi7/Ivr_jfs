package com.ivr.service;

import org.springframework.stereotype.Service;

@Service
public class EmergencyService {
    public void alert(String name) {
        System.out.println("Emergency for " + name);
    }
}
