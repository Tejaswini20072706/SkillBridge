package com.skillbridge.dto;

import java.util.List;

public class UserDto {
    private Long userId;
    private String name;
    private String email;
    private String college;
    private String department;
    private String academicYear;
    private String bio;
    private String avatarUrl;
    private Double averageRating;
    private Integer reviewCount;
    private List<UserSkillResponseDto> skills;
    private List<AvailabilityDto> availabilities;

    public UserDto() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public List<UserSkillResponseDto> getSkills() { return skills; }
    public void setSkills(List<UserSkillResponseDto> skills) { this.skills = skills; }

    public List<AvailabilityDto> getAvailabilities() { return availabilities; }
    public void setAvailabilities(List<AvailabilityDto> availabilities) { this.availabilities = availabilities; }
}
