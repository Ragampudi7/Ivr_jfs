package com.ivr.controller;

import com.ivr.service.IVRCallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/call")
public class CallController {

    @Autowired
    private IVRCallService ivrCallService;

    @GetMapping("/test")
    public String testCall() {
        // You would typically pass the target number from path or body, but this matches the user request.
        // Needs a verified number for a Twilio trial account!
        ivrCallService.makeCall("+1234567890", "This is a test call from the manual trigger endpoint"); // Placeholder, user will test with their verified number
        return "Call Triggered (Check console for errors if credentials aren't set)";
    }
}
