package com.skillbridge.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "availability")
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "availability_id")
    private Long availabilityId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"userSkills", "availabilities", "password"})
    private User user;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek; // MONDAY, TUESDAY, etc.

    @Column(name = "start_time", nullable = false, length = 20)
    private String startTime; // e.g. "14:00"

    @Column(name = "end_time", nullable = false, length = 20)
    private String endTime; // e.g. "16:00"

    public Availability() {}

    public Availability(User user, String dayOfWeek, String startTime, String endTime) {
        this.user = user;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getAvailabilityId() { return availabilityId; }
    public void setAvailabilityId(Long availabilityId) { this.availabilityId = availabilityId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
}
