package com.skillbridge.service;

import com.skillbridge.dto.AvailabilityDto;
import com.skillbridge.dto.UserDto;
import com.skillbridge.dto.UserSkillRequest;
import com.skillbridge.dto.UserSkillResponseDto;
import com.skillbridge.entity.Availability;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.User;
import com.skillbridge.entity.UserSkill;
import com.skillbridge.repository.AvailabilityRepository;
import com.skillbridge.repository.FeedbackRepository;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final AvailabilityRepository availabilityRepository;
    private final FeedbackRepository feedbackRepository;

    public UserService(
            UserRepository userRepository,
            SkillRepository skillRepository,
            UserSkillRepository userSkillRepository,
            AvailabilityRepository availabilityRepository,
            FeedbackRepository feedbackRepository
    ) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.availabilityRepository = availabilityRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    public UserDto getUserProfile(Long userId) {
        User user = getUserById(userId);
        Double avgRating = feedbackRepository.calculateAverageRatingForUser(userId);
        int reviewCount = feedbackRepository.findByTargetUserUserIdOrderByCreatedAtDesc(userId).size();

        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setCollege(user.getCollege());
        dto.setDepartment(user.getDepartment());
        dto.setAcademicYear(user.getAcademicYear());
        dto.setBio(user.getBio());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 5.0);
        dto.setReviewCount(reviewCount);

        List<UserSkillResponseDto> skillDtos = userSkillRepository.findByUserUserId(userId).stream().map(us -> {
            UserSkillResponseDto sDto = new UserSkillResponseDto();
            sDto.setUserSkillId(us.getUserSkillId());
            sDto.setSkillId(us.getSkill().getSkillId());
            sDto.setSkillName(us.getSkill().getSkillName());
            sDto.setCategory(us.getSkill().getCategory());
            sDto.setProficiency(us.getProficiency());
            sDto.setType(us.getType());
            sDto.setExperienceDetails(us.getExperienceDetails());
            return sDto;
        }).collect(Collectors.toList());
        dto.setSkills(skillDtos);

        List<AvailabilityDto> availDtos = availabilityRepository.findByUserUserId(userId).stream().map(av ->
                new AvailabilityDto(av.getAvailabilityId(), av.getDayOfWeek(), av.getStartTime(), av.getEndTime())
        ).collect(Collectors.toList());
        dto.setAvailabilities(availDtos);

        return dto;
    }

    @Transactional
    public User updateProfile(Long userId, User updated) {
        User existing = getUserById(userId);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getCollege() != null) existing.setCollege(updated.getCollege());
        if (updated.getDepartment() != null) existing.setDepartment(updated.getDepartment());
        if (updated.getAcademicYear() != null) existing.setAcademicYear(updated.getAcademicYear());
        if (updated.getBio() != null) existing.setBio(updated.getBio());
        if (updated.getAvatarUrl() != null) existing.setAvatarUrl(updated.getAvatarUrl());
        return userRepository.save(existing);
    }

    @Transactional
    public UserSkill addUserSkill(Long userId, UserSkillRequest req) {
        User user = getUserById(userId);
        Skill skill = skillRepository.findById(req.getSkillId())
                .orElseThrow(() -> new IllegalArgumentException("Skill not found: " + req.getSkillId()));

        UserSkill userSkill = userSkillRepository
                .findByUserUserIdAndSkillSkillIdAndType(userId, req.getSkillId(), req.getType())
                .orElse(new UserSkill());

        userSkill.setUser(user);
        userSkill.setSkill(skill);
        userSkill.setProficiency(req.getProficiency());
        userSkill.setType(req.getType());
        userSkill.setExperienceDetails(req.getExperienceDetails());

        return userSkillRepository.save(userSkill);
    }

    @Transactional
    public void removeUserSkill(Long userId, Long userSkillId) {
        UserSkill us = userSkillRepository.findById(userSkillId)
                .orElseThrow(() -> new IllegalArgumentException("User skill not found"));
        if (!us.getUser().getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized to remove this skill");
        }
        userSkillRepository.delete(us);
    }

    @Transactional
    public List<Availability> updateAvailabilities(Long userId, List<AvailabilityDto> list) {
        User user = getUserById(userId);
        availabilityRepository.deleteByUserUserId(userId);

        List<Availability> toSave = list.stream().map(dto ->
                new Availability(user, dto.getDayOfWeek(), dto.getStartTime(), dto.getEndTime())
        ).collect(Collectors.toList());

        return availabilityRepository.saveAll(toSave);
    }
}
