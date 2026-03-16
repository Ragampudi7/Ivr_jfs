package com.ivr.service;

import org.springframework.stereotype.Service;

@Service
public class IVRService {
    public void call(String phone) {
        System.out.println("Calling " + phone);
    }
}
