package com.ivr.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TwiMLController {

    // Must be accessible via GET or POST depending on Twilio config, typically POST
    @RequestMapping(value = "/twiml", produces = MediaType.APPLICATION_XML_VALUE)
    public String getTwiML(@RequestParam(required = false, defaultValue = "your scheduled task") String reason) {
        return "<Response>\n" +
               "    <Say voice=\"alice\">\n" +
               "        Hello. This is your reminder for: " + reason + ". Have a great day!\n" +
               "    </Say>\n" +
               "</Response>";
    }
}
