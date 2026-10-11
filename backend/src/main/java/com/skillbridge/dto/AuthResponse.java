package com.skillbridge.dto;

public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String college;
    private String department;
    private String academicYear;
    private String bio;
    private String avatarUrl;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String name, String email, String role, String college, String department, String academicYear, String bio, String avatarUrl) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.college = college;
        this.department = department;
        this.academicYear = academicYear;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

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
}
