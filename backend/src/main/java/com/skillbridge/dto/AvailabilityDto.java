package com.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;

public class AvailabilityDto {
    private Long availabilityId;

    @NotBlank(message = "Day of week is required (e.g. MONDAY)")
    private String dayOfWeek;

    @NotBlank(message = "Start time is required (e.g. 14:00)")
    private String startTime;

    @NotBlank(message = "End time is required (e.g. 16:00)")
    private String endTime;

    public AvailabilityDto() {}

    public AvailabilityDto(Long availabilityId, String dayOfWeek, String startTime, String endTime) {
        this.availabilityId = availabilityId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getAvailabilityId() { return availabilityId; }
    public void setAvailabilityId(Long availabilityId) { this.availabilityId = availabilityId; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
}
