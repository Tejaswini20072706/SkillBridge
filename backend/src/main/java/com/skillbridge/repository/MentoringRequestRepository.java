package com.skillbridge.repository;

import com.skillbridge.entity.MentoringRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MentoringRequestRepository extends JpaRepository<MentoringRequest, Long> {
    List<MentoringRequest> findByLearnerUserIdOrderByCreatedAtDesc(Long learnerId);
    List<MentoringRequest> findByMentorUserIdOrderByCreatedAtDesc(Long mentorId);

    @Query("SELECT r FROM MentoringRequest r WHERE r.learner.userId = :userId OR r.mentor.userId = :userId ORDER BY r.createdAt DESC")
    List<MentoringRequest> findAllByUser(@Param("userId") Long userId);

    boolean existsByLearnerUserIdAndMentorUserIdAndSkillSkillIdAndStatus(Long learnerId, Long mentorId, Long skillId, String status);
}
