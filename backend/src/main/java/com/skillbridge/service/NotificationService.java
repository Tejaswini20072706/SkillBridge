package com.skillbridge.service;

import com.skillbridge.entity.Notification;
import com.skillbridge.entity.User;
import com.skillbridge.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(User user, String title, String message) {
        Notification notification = new Notification(user, title, message);
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public Notification markAsRead(Long notificationId, Long userId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        if (!notif.getUser().getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized to update this notification");
        }
        notif.setIsRead(true);
        return notificationRepository.save(notif);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifs = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : notifs) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(notifs);
    }
}
