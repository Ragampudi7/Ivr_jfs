package com.ivr.service;

import com.ivr.model.Reminder;
import com.ivr.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    @Transactional
    public void markCalledToday(Reminder reminder, java.time.LocalDate today) {
        reminder.setLastCalledDate(today);
        reminderRepository.save(reminder);
    }
}
