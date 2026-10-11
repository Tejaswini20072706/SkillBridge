package com.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;

public class SkillDto {
    private Long skillId;

    @NotBlank(message = "Skill name is required")
    private String skillName;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;

    public SkillDto() {}

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
