package com.skillbridge.service;

import com.skillbridge.dto.MentoringRequestCreateDto;
import com.skillbridge.entity.MentoringRequest;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.User;
import com.skillbridge.entity.UserSkill;
import com.skillbridge.repository.MentoringRequestRepository;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MentoringRequestService {

    private final MentoringRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final NotificationService notificationService;

    public MentoringRequestService(
            MentoringRequestRepository requestRepository,
            UserRepository userRepository,
            SkillRepository skillRepository,
            UserSkillRepository userSkillRepository,
            NotificationService notificationService
    ) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public MentoringRequest createRequest(Long learnerId, MentoringRequestCreateDto dto) {
        if (learnerId.equals(dto.getMentorId())) {
            throw new IllegalArgumentException("You cannot request mentoring from yourself");
        }

        User learner = userRepository.findById(learnerId)
                .orElseThrow(() -> new IllegalArgumentException("Learner not found"));
        User mentor = userRepository.findById(dto.getMentorId())
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
        Skill skill = skillRepository.findById(dto.getSkillId())
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));

        // Validate mentor teaches this skill
        boolean teaches = userSkillRepository.findByUserUserId(dto.getMentorId())
                .stream()
                .anyMatch(us -> us.getSkill().getSkillId().equals(dto.getSkillId()) &&
                        (us.getType().equalsIgnoreCase("TEACH") || us.getType().equalsIgnoreCase("BOTH")));

        if (!teaches) {
            throw new IllegalArgumentException("Selected mentor does not offer mentoring for this skill");
        }

        // Validate no duplicate pending request
        if (requestRepository.existsByLearnerUserIdAndMentorUserIdAndSkillSkillIdAndStatus(
                learnerId, dto.getMentorId(), dto.getSkillId(), "PENDING")) {
            throw new IllegalArgumentException("You already have an active pending request for this mentor and skill");
        }

        MentoringRequest req = new MentoringRequest(learner, mentor, skill, dto.getMessage(), dto.getPreferredDateTime());
        MentoringRequest saved = requestRepository.save(req);

        // Notify mentor
        notificationService.createNotification(
                mentor,
                "New Mentoring Request",
                learner.getName() + " requested a micro-mentoring session on " + skill.getSkillName()
        );

        return saved;
    }

    public List<MentoringRequest> getMyRequests(Long userId) {
        return requestRepository.findAllByUser(userId);
    }

    public MentoringRequest getRequestById(Long requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found: " + requestId));
    }

    @Transactional
    public MentoringRequest acceptRequest(Long requestId, Long mentorId) {
        MentoringRequest req = getRequestById(requestId);
        if (!req.getMentor().getUserId().equals(mentorId)) {
            throw new SecurityException("Only the designated mentor can accept this request");
        }
        if (!req.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Request is not in PENDING state (Current state: " + req.getStatus() + ")");
        }

        req.setStatus("ACCEPTED");
        req.setUpdatedAt(LocalDateTime.now());
        MentoringRequest saved = requestRepository.save(req);

        // Notify learner
        notificationService.createNotification(
                req.getLearner(),
                "Request Accepted!",
                req.getMentor().getName() + " accepted your mentoring request for " + req.getSkill().getSkillName()
        );

        return saved;
    }

    @Transactional
    public MentoringRequest rejectRequest(Long requestId, Long mentorId) {
        MentoringRequest req = getRequestById(requestId);
        if (!req.getMentor().getUserId().equals(mentorId)) {
            throw new SecurityException("Only the designated mentor can reject this request");
        }
        if (!req.getStatus().equals("PENDING")) {
            throw new IllegalStateException("Request is not in PENDING state");
        }

        req.setStatus("REJECTED");
        req.setUpdatedAt(LocalDateTime.now());
        MentoringRequest saved = requestRepository.save(req);

        // Notify learner
        notificationService.createNotification(
                req.getLearner(),
                "Request Declined",
                req.getMentor().getName() + " was unable to accept your mentoring request for " + req.getSkill().getSkillName()
        );

        return saved;
    }

    @Transactional
    public MentoringRequest cancelRequest(Long requestId, Long userId) {
        MentoringRequest req = getRequestById(requestId);
        if (!req.getLearner().getUserId().equals(userId) && !req.getMentor().getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized to cancel this request");
        }

        req.setStatus("CANCELLED");
        req.setUpdatedAt(LocalDateTime.now());
        return requestRepository.save(req);
    }
}
