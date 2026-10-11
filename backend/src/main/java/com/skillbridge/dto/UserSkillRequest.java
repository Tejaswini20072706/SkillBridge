package com.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserSkillRequest {
    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotBlank(message = "Proficiency is required (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)")
    private String proficiency;

    @NotBlank(message = "Type is required (TEACH, LEARN, BOTH)")
    private String type;

    private String experienceDetails;

    public UserSkillRequest() {}

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public String getProficiency() { return proficiency; }
    public void setProficiency(String proficiency) { this.proficiency = proficiency; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getExperienceDetails() { return experienceDetails; }
    public void setExperienceDetails(String experienceDetails) { this.experienceDetails = experienceDetails; }
}
