package com.skillbridge.service;

import com.skillbridge.dto.SkillDto;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.UserSkill;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserSkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    public SkillService(SkillRepository skillRepository, UserSkillRepository userSkillRepository) {
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill createSkill(SkillDto dto) {
        if (skillRepository.findBySkillNameIgnoreCase(dto.getSkillName()).isPresent()) {
            throw new IllegalArgumentException("Skill already exists: " + dto.getSkillName());
        }
        Skill skill = new Skill(dto.getSkillName(), dto.getCategory(), dto.getDescription());
        return skillRepository.save(skill);
    }

    public List<UserSkill> searchMentors(String query, String category, String proficiency) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanCat = (category != null && !category.trim().equalsIgnoreCase("ALL") && !category.trim().isEmpty()) ? category.trim() : null;
        String cleanProf = (proficiency != null && !proficiency.trim().equalsIgnoreCase("ALL") && !proficiency.trim().isEmpty()) ? proficiency.trim() : null;

        return userSkillRepository.searchMentors(cleanQuery, cleanCat, cleanProf);
    }
}
