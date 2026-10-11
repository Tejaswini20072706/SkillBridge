package com.skillbridge.dto;

public class UserSkillResponseDto {
    private Long userSkillId;
    private Long skillId;
    private String skillName;
    private String category;
    private String proficiency;
    private String type;
    private String experienceDetails;

    public UserSkillResponseDto() {}

    public Long getUserSkillId() { return userSkillId; }
    public void setUserSkillId(Long userSkillId) { this.userSkillId = userSkillId; }

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getProficiency() { return proficiency; }
    public void setProficiency(String proficiency) { this.proficiency = proficiency; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getExperienceDetails() { return experienceDetails; }
    public void setExperienceDetails(String experienceDetails) { this.experienceDetails = experienceDetails; }
}
