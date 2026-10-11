package com.skillbridge.repository;

import com.skillbridge.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByTargetUserUserIdOrderByCreatedAtDesc(Long targetUserId);
    List<Feedback> findBySessionSessionId(Long sessionId);
    boolean existsBySessionSessionIdAndReviewerUserId(Long sessionId, Long reviewerId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.targetUser.userId = :userId")
    Double calculateAverageRatingForUser(@Param("userId") Long userId);
}
