package com.skillbridge.controller;

import com.skillbridge.dto.AvailabilityDto;
import com.skillbridge.dto.UserDto;
import com.skillbridge.dto.UserSkillRequest;
import com.skillbridge.entity.Availability;
import com.skillbridge.entity.User;
import com.skillbridge.entity.UserSkill;
import com.skillbridge.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(userService.getUserProfile(user.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody User updated, Authentication authentication) {
        User current = userService.getUserByEmail(authentication.getName());
        if (!current.getUserId().equals(id)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userService.updateProfile(id, updated));
    }

    @PostMapping("/{id}/skills")
    public ResponseEntity<UserSkill> addUserSkill(
            @PathVariable Long id,
            @Valid @RequestBody UserSkillRequest request,
            Authentication authentication
    ) {
        User current = userService.getUserByEmail(authentication.getName());
        if (!current.getUserId().equals(id)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userService.addUserSkill(id, request));
    }

    @DeleteMapping("/{id}/skills/{userSkillId}")
    public ResponseEntity<Void> removeUserSkill(
            @PathVariable Long id,
            @PathVariable Long userSkillId,
            Authentication authentication
    ) {
        User current = userService.getUserByEmail(authentication.getName());
        if (!current.getUserId().equals(id)) {
            return ResponseEntity.status(403).build();
        }
        userService.removeUserSkill(id, userSkillId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<List<Availability>> updateAvailability(
            @PathVariable Long id,
            @RequestBody List<AvailabilityDto> list,
            Authentication authentication
    ) {
        User current = userService.getUserByEmail(authentication.getName());
        if (!current.getUserId().equals(id)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userService.updateAvailabilities(id, list));
    }
}
