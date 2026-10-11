package com.skillbridge.repository;

import com.skillbridge.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByRequestRequestId(Long requestId);

    @Query("SELECT s FROM Session s WHERE s.request.learner.userId = :userId OR s.request.mentor.userId = :userId ORDER BY s.scheduledAt ASC")
    List<Session> findAllByUserId(@Param("userId") Long userId);
}
