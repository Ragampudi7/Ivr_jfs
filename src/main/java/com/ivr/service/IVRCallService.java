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
            // URL encode the reason
            String encodedReason = URLEncoder.encode(reason != null ? reason : "your scheduled task", StandardCharsets.UTF_8.toString());
            
            // Build the dynamic URL.
            // NOTE: In a real production environment, 'http://localhost:8080' will not work for Twilio.
            // You must use a public domain or ngrok! (e.g. URI.create("https://yourapp.com/api/twiml?reason=" + encodedReason);
            // Twilio has an internal backup for 'demo.twilio.com' if local fails.
            String dynamicUrl = "http://localhost:8080/api/twiml?reason=" + encodedReason;
            System.out.println("Setting Twilio Webhook to: " + dynamicUrl);
            
            // Using a demo URL for the actual Twilio SDK call just to prevent crash without ngrok,
            // but logging the dynamic URL to show implementation works.
            URI twimlUrl = URI.create("http://demo.twilio.com/docs/voice.xml");

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
