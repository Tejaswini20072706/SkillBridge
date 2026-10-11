package com.skillbridge.controller;

import com.skillbridge.dto.MentoringRequestCreateDto;
import com.skillbridge.entity.MentoringRequest;
import com.skillbridge.entity.User;
import com.skillbridge.service.MentoringRequestService;
import com.skillbridge.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class MentoringRequestController {

    private final MentoringRequestService requestService;
    private final UserService userService;

    public MentoringRequestController(MentoringRequestService requestService, UserService userService) {
        this.requestService = requestService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<MentoringRequest> createRequest(
            @Valid @RequestBody MentoringRequestCreateDto dto,
            Authentication authentication
    ) {
        User learner = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(requestService.createRequest(learner.getUserId(), dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<MentoringRequest>> getMyRequests(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(requestService.getMyRequests(user.getUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MentoringRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<MentoringRequest> acceptRequest(@PathVariable Long id, Authentication authentication) {
        User mentor = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(requestService.acceptRequest(id, mentor.getUserId()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<MentoringRequest> rejectRequest(@PathVariable Long id, Authentication authentication) {
        User mentor = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(requestService.rejectRequest(id, mentor.getUserId()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<MentoringRequest> cancelRequest(@PathVariable Long id, Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(requestService.cancelRequest(id, user.getUserId()));
    }
}
