package com.skillbridge.repository;

import com.skillbridge.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByUserUserId(Long userId);
    void deleteByUserUserId(Long userId);
}
