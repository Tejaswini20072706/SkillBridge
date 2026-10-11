package com.skillbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SessionScheduleDto {
    @NotNull(message = "Request ID is required")
    private Long requestId;

    @NotBlank(message = "Scheduled time is required")
    private String scheduledAt;

    @NotNull(message = "Duration is required (in minutes)")
    private Integer duration;

    @NotBlank(message = "Mode is required (ONLINE or OFFLINE)")
    private String mode;

    private String meetingLinkOrLocation;

    public SessionScheduleDto() {}

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public String getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getMeetingLinkOrLocation() { return meetingLinkOrLocation; }
    public void setMeetingLinkOrLocation(String meetingLinkOrLocation) { this.meetingLinkOrLocation = meetingLinkOrLocation; }
}
