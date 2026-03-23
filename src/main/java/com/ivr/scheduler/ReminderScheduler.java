package com.ivr.scheduler;

import com.ivr.model.Reminder;
import com.ivr.service.IVRCallService;
import com.ivr.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class ReminderScheduler {

    @Autowired
    private IVRCallService ivrCallService;

    @Autowired
    private ReminderService reminderService;

    @Scheduled(fixedRate = 60000)
    public void checkReminders() {
        List<Reminder> allReminders = reminderService.getAllReminders();
        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();

        if (allReminders.isEmpty()) {
            System.out.println("Scheduler Running: No scheduled reminders found at this time.");
        }

        for (Reminder r : allReminders) {
            // Check if reminder is due right now (matching hour and minute)
            if (r.getScheduleTime() != null &&
                r.getScheduleTime().getHour() == now.getHour() &&
                r.getScheduleTime().getMinute() == now.getMinute()) {

                // Check if it has already been called today to avoid spamming within the exact minute
                if (r.getLastCalledDate() == null || !r.getLastCalledDate().equals(today)) {
                    System.out.println("Calling user for daily reminder: " + r.getUser().getEmail());
                    
                    ivrCallService.makeCall(r.getUser().getPhone(), r.getReason());
                    reminderService.markCalledToday(r, today);
                }
            }
        }
    }
}
