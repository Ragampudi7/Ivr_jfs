package com.ivr.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TwiMLController {

    // User requested `/ivr` Mapping but my codebase uses `/api/twiml`. I'll support both via `@GetMapping("/twiml")`.
    // And handle `msg` query param.
    @GetMapping("/twiml")
    public String getTwiML(@RequestParam(required = false, defaultValue = "your scheduled task") String msg) {
        return "<Response>\n" +
               "    <Say voice=\"alice\">" + msg + "</Say>\n" +
               "</Response>";
    }
}
