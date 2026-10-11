package com.skillbridge.controller;

import com.skillbridge.dto.SessionScheduleDto;
import com.skillbridge.entity.Session;
import com.skillbridge.entity.User;
import com.skillbridge.service.SessionService;
import com.skillbridge.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;
    private final UserService userService;

    public SessionController(SessionService sessionService, UserService userService) {
        this.sessionService = sessionService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Session> scheduleSession(
            @Valid @RequestBody SessionScheduleDto dto,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(sessionService.scheduleSession(user.getUserId(), dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Session>> getMySessions(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(sessionService.getMySessions(user.getUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Session> completeSession(@PathVariable Long id, Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(sessionService.completeSession(id, user.getUserId()));
    }
}
