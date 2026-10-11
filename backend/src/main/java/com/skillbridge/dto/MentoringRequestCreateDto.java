package com.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MentoringRequestCreateDto {
    @NotNull(message = "Mentor ID is required")
    private Long mentorId;

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Preferred date and time is required")
    private String preferredDateTime;

    public MentoringRequestCreateDto() {}

    public Long getMentorId() { return mentorId; }
    public void setMentorId(Long mentorId) { this.mentorId = mentorId; }

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPreferredDateTime() { return preferredDateTime; }
    public void setPreferredDateTime(String preferredDateTime) { this.preferredDateTime = preferredDateTime; }
}
