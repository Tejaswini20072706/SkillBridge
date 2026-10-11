package com.skillbridge.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentoring_requests")
public class MentoringRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "learner_id", nullable = false)
    @JsonIgnoreProperties({"userSkills", "availabilities", "password"})
    private User learner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mentor_id", nullable = false)
    @JsonIgnoreProperties({"userSkills", "availabilities", "password"})
    private User mentor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false, length = 50)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, CANCELLED, COMPLETED

    @Column(columnDefinition = "TEXT")
    private String message;

    private String preferredDateTime;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public MentoringRequest() {}

    public MentoringRequest(User learner, User mentor, Skill skill, String message, String preferredDateTime) {
        this.learner = learner;
        this.mentor = mentor;
        this.skill = skill;
        this.message = message;
        this.preferredDateTime = preferredDateTime;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public User getLearner() { return learner; }
    public void setLearner(User learner) { this.learner = learner; }

    public User getMentor() { return mentor; }
    public void setMentor(User mentor) { this.mentor = mentor; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPreferredDateTime() { return preferredDateTime; }
    public void setPreferredDateTime(String preferredDateTime) { this.preferredDateTime = preferredDateTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
