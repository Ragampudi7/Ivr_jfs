package com.ivr.config;

import com.twilio.Twilio;

public class TwilioConfig {

    public static final String ACCOUNT_SID = "YOUR_ACCOUNT_SID";
    public static final String AUTH_TOKEN = "YOUR_AUTH_TOKEN";
    public static final String FROM_NUMBER = "+15075788150";

    public static void init() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }
}
