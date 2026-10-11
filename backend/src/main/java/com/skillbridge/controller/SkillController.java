package com.skillbridge.controller;

import com.skillbridge.dto.SkillDto;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.UserSkill;
import com.skillbridge.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @PostMapping
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody SkillDto dto) {
        return ResponseEntity.ok(skillService.createSkill(dto));
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<UserSkill>> searchMentors(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String proficiency
    ) {
        return ResponseEntity.ok(skillService.searchMentors(query, category, proficiency));
    }
}
