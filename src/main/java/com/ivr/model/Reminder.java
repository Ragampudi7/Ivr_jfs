package com.ivr.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reminders")
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalTime scheduleTime;

    private String reason;

    private LocalDate lastCalledDate;

    public Reminder() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalTime getScheduleTime() { return scheduleTime; }
    public void setScheduleTime(LocalTime scheduleTime) { this.scheduleTime = scheduleTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDate getLastCalledDate() { return lastCalledDate; }
    public void setLastCalledDate(LocalDate lastCalledDate) { this.lastCalledDate = lastCalledDate; }
}
