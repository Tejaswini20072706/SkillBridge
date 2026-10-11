package com.skillbridge.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "user_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "skill_id", "type"})
})
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_skill_id")
    private Long userSkillId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"userSkills", "availabilities", "password"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false, length = 50)
    private String proficiency; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    @Column(nullable = false, length = 50)
    private String type; // TEACH, LEARN, BOTH

    @Column(columnDefinition = "TEXT")
    private String experienceDetails;

    public UserSkill() {}

    public UserSkill(User user, Skill skill, String proficiency, String type, String experienceDetails) {
        this.user = user;
        this.skill = skill;
        this.proficiency = proficiency;
        this.type = type;
        this.experienceDetails = experienceDetails;
    }

    public Long getUserSkillId() { return userSkillId; }
    public void setUserSkillId(Long userSkillId) { this.userSkillId = userSkillId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public String getProficiency() { return proficiency; }
    public void setProficiency(String proficiency) { this.proficiency = proficiency; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getExperienceDetails() { return experienceDetails; }
    public void setExperienceDetails(String experienceDetails) { this.experienceDetails = experienceDetails; }
}
