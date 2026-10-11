package com.skillbridge.service;

import com.skillbridge.dto.FeedbackCreateDto;
import com.skillbridge.entity.Feedback;
import com.skillbridge.entity.Session;
import com.skillbridge.entity.User;
import com.skillbridge.repository.FeedbackRepository;
import com.skillbridge.repository.SessionRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            SessionRepository sessionRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.feedbackRepository = feedbackRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Feedback submitFeedback(Long reviewerId, FeedbackCreateDto dto) {
        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + dto.getSessionId()));

        if (!"COMPLETED".equalsIgnoreCase(session.getStatus())) {
            throw new IllegalStateException("Feedback can only be submitted for COMPLETED sessions");
        }

        Long learnerId = session.getRequest().getLearner().getUserId();
        Long mentorId = session.getRequest().getMentor().getUserId();

        if (!reviewerId.equals(learnerId) && !reviewerId.equals(mentorId)) {
            throw new SecurityException("Only session participants can submit feedback");
        }

        if (feedbackRepository.existsBySessionSessionIdAndReviewerUserId(session.getSessionId(), reviewerId)) {
            throw new IllegalArgumentException("You have already submitted feedback for this session");
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer not found"));
        User targetUser = userRepository.findById(dto.getTargetUserId())
                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));

        Feedback feedback = new Feedback(session, reviewer, targetUser, dto.getRating(), dto.getComment());
        Feedback saved = feedbackRepository.save(feedback);

        // Notify target user
        notificationService.createNotification(
                targetUser,
                "New Rating & Feedback",
                reviewer.getName() + " rated your session " + dto.getRating() + "/5 stars!"
        );

        return saved;
    }

    public List<Feedback> getUserFeedbacks(Long userId) {
        return feedbackRepository.findByTargetUserUserIdOrderByCreatedAtDesc(userId);
    }

    public Double getAverageRating(Long userId) {
        Double avg = feedbackRepository.calculateAverageRatingForUser(userId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 5.0;
    }
}
