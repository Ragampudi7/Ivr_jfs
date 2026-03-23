package com.ivr.controller;

import com.ivr.model.Reminder;
import com.ivr.model.User;
import com.ivr.repository.ReminderRepository;
import com.ivr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reminders")
public class ReminderController {

    @Autowired
    private ReminderRepository reminderRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reminder>> getUserReminders(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isPresent()) {
            List<Reminder> userReminders = reminderRepository.findAll().stream()
                    .filter(r -> r.getUser().getId().equals(userId))
                    .toList();
            return ResponseEntity.ok(userReminders);
        }
        return ResponseEntity.notFound().build();
    }

    public static class ReminderRequest {
        public Long userId;
        public String scheduleTime; // HH:mm format
        public String reason;
    }

    @PostMapping
    public ResponseEntity<?> createReminder(@RequestBody ReminderRequest request) {
        Optional<User> userOptional = userRepository.findById(request.userId);
        if(userOptional.isPresent()) {
            Reminder reminder = new Reminder();
            reminder.setUser(userOptional.get());
            reminder.setScheduleTime(LocalTime.parse(request.scheduleTime));
            reminder.setReason(request.reason);
            return ResponseEntity.ok(reminderRepository.save(reminder));
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id) {
        reminderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReminder(@PathVariable Long id, @RequestBody ReminderRequest request) {
        Optional<Reminder> existing = reminderRepository.findById(id);
        if(existing.isPresent()) {
            Reminder reminder = existing.get();
            reminder.setScheduleTime(LocalTime.parse(request.scheduleTime));
            reminder.setReason(request.reason);
            return ResponseEntity.ok(reminderRepository.save(reminder));
        }
        return ResponseEntity.notFound().build();
    }
}
