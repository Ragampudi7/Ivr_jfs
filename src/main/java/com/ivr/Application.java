
package com.ivr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableScheduling
public class Application {
    public static void main(String[] args) {
        // Load .env variables into System Properties so Spring Boot placeholder ${} injection works!
        // We use ignoreIfMissing() so that it doesn't crash when running on Render where .env file is omitted.
        Dotenv.configure().ignoreIfMissing().systemProperties().load();
        
        SpringApplication.run(Application.class, args);
    }
}
