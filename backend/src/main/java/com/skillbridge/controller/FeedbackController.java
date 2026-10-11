package com.skillbridge.controller;

import com.skillbridge.dto.FeedbackCreateDto;
import com.skillbridge.entity.Feedback;
import com.skillbridge.entity.User;
import com.skillbridge.service.FeedbackService;
import com.skillbridge.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserService userService;

    public FeedbackController(FeedbackService feedbackService, UserService userService) {
        this.feedbackService = feedbackService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(
            @Valid @RequestBody FeedbackCreateDto dto,
            Authentication authentication
    ) {
        User reviewer = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(feedbackService.submitFeedback(reviewer.getUserId(), dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getUserFeedbacks(@PathVariable Long userId) {
        return ResponseEntity.ok(feedbackService.getUserFeedbacks(userId));
    }

    @GetMapping("/user/{userId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long userId) {
        return ResponseEntity.ok(feedbackService.getAverageRating(userId));
    }
}
