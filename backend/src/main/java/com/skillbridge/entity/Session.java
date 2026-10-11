package com.skillbridge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private MentoringRequest request;

    @Column(name = "scheduled_at", nullable = false)
    private String scheduledAt;

    @Column(nullable = false)
    private Integer duration; // in minutes

    @Column(nullable = false, length = 50)
    private String mode; // ONLINE, OFFLINE

    private String meetingLinkOrLocation;

    @Column(nullable = false, length = 50)
    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, CANCELLED

    private LocalDateTime createdAt = LocalDateTime.now();

    public Session() {}

    public Session(MentoringRequest request, String scheduledAt, Integer duration, String mode, String meetingLinkOrLocation) {
        this.request = request;
        this.scheduledAt = scheduledAt;
        this.duration = duration;
        this.mode = mode;
        this.meetingLinkOrLocation = meetingLinkOrLocation;
        this.status = "SCHEDULED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public MentoringRequest getRequest() { return request; }
    public void setRequest(MentoringRequest request) { this.request = request; }

    public String getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getMeetingLinkOrLocation() { return meetingLinkOrLocation; }
    public void setMeetingLinkOrLocation(String meetingLinkOrLocation) { this.meetingLinkOrLocation = meetingLinkOrLocation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
