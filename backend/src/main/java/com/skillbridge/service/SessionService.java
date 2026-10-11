package com.skillbridge.service;

import com.skillbridge.dto.SessionScheduleDto;
import com.skillbridge.entity.MentoringRequest;
import com.skillbridge.entity.Session;
import com.skillbridge.repository.MentoringRequestRepository;
import com.skillbridge.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final MentoringRequestRepository requestRepository;
    private final NotificationService notificationService;

    public SessionService(
            SessionRepository sessionRepository,
            MentoringRequestRepository requestRepository,
            NotificationService notificationService
    ) {
        this.sessionRepository = sessionRepository;
        this.requestRepository = requestRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Session scheduleSession(Long userId, SessionScheduleDto dto) {
        MentoringRequest req = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Mentoring request not found: " + dto.getRequestId()));

        if (!req.getMentor().getUserId().equals(userId) && !req.getLearner().getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized to schedule session for this request");
        }

        if (!"ACCEPTED".equalsIgnoreCase(req.getStatus())) {
            throw new IllegalStateException("Sessions can only be scheduled for ACCEPTED requests (Current: " + req.getStatus() + ")");
        }

        if (sessionRepository.findByRequestRequestId(dto.getRequestId()).isPresent()) {
            throw new IllegalArgumentException("A session is already scheduled for this mentoring request");
        }

        Session session = new Session(
                req,
                dto.getScheduledAt(),
                dto.getDuration(),
                dto.getMode().toUpperCase(),
                dto.getMeetingLinkOrLocation()
        );

        Session saved = sessionRepository.save(session);

        // Notify both parties
        notificationService.createNotification(
                req.getLearner(),
                "Session Confirmed",
                "Your session with " + req.getMentor().getName() + " is confirmed for " + dto.getScheduledAt()
        );
        notificationService.createNotification(
                req.getMentor(),
                "Session Scheduled",
                "Your session with " + req.getLearner().getName() + " is confirmed for " + dto.getScheduledAt()
        );

        return saved;
    }

    public List<Session> getMySessions(Long userId) {
        return sessionRepository.findAllByUserId(userId);
    }

    public Session getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
    }

    @Transactional
    public Session completeSession(Long sessionId, Long userId) {
        Session session = getSessionById(sessionId);

        MentoringRequest req = session.getRequest();
        if (!req.getMentor().getUserId().equals(userId) && !req.getLearner().getUserId().equals(userId)) {
            throw new SecurityException("Only session participants can mark it as completed");
        }

        if ("COMPLETED".equalsIgnoreCase(session.getStatus())) {
            throw new IllegalStateException("Session is already marked as COMPLETED");
        }

        session.setStatus("COMPLETED");
        req.setStatus("COMPLETED");
        requestRepository.save(req);

        Session saved = sessionRepository.save(session);

        // Notify both parties to leave feedback
        notificationService.createNotification(
                req.getLearner(),
                "Session Completed!",
                "Session completed! Please take a moment to leave feedback for " + req.getMentor().getName()
        );
        notificationService.createNotification(
                req.getMentor(),
                "Session Completed!",
                "Session completed! Feel free to review your learning exchange with " + req.getLearner().getName()
        );

        return saved;
    }
}
