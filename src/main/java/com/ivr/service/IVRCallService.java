package com.ivr.service;

import com.twilio.rest.api.v2010.account.Call;
import com.twilio.type.PhoneNumber;
import com.ivr.config.TwilioConfig;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class IVRCallService {

    public void makeCall(String toNumber, String reason) {
        TwilioConfig.init();

        try {
            // Smart health assistant prompt
            String message = "Hello, this is your smart health assistant. Please " + (reason != null ? reason : "complete your scheduled task");
            
            // URL encode the reason
            String encodedReason = URLEncoder.encode(message, StandardCharsets.UTF_8.toString());
            
            // Build the dynamic URL using Render env var or fallback
            String baseUrl = System.getenv("RENDER_EXTERNAL_URL");
            if (baseUrl == null || baseUrl.isEmpty()) {
                baseUrl = "http://demo.twilio.com/docs/voice.xml"; // Fallback for local Twilio testing so the call doesn't hard-crash
                System.out.println("No RENDER_EXTERNAL_URL found, falling back for local testing.");
            } else {
                baseUrl = baseUrl + "/api/twiml?msg=" + encodedReason;
                System.out.println("Using dynamic Render URL: " + baseUrl);
            }
            
            URI twimlUrl = URI.create(baseUrl);

            Call call = Call.creator(
                    new PhoneNumber(toNumber),
                    new PhoneNumber(TwilioConfig.FROM_NUMBER),
                    twimlUrl
            ).create();

            System.out.println("Call triggered successfully. SID: " + call.getSid() + " for reason: " + reason);
        } catch (Exception e) {
            System.err.println("Failed to trigger call to " + toNumber + ": " + e.getMessage());
        }
    }
}
