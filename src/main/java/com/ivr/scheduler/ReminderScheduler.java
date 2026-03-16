
package com.ivr.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {

    @Scheduled(fixedRate = 60000)
    public void run() {
        System.out.println("Scheduler Running");
    }
}
