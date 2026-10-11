package com.skillbridge.repository;

import com.skillbridge.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserUserId(Long userId);

    @Query("SELECT us FROM UserSkill us WHERE us.type IN ('TEACH', 'BOTH')")
    List<UserSkill> findAllMentors();

    @Query("SELECT us FROM UserSkill us WHERE us.type IN ('TEACH', 'BOTH') AND " +
           "(:skillQuery IS NULL OR LOWER(us.skill.skillName) LIKE LOWER(CONCAT('%', :skillQuery, '%'))) AND " +
           "(:category IS NULL OR LOWER(us.skill.category) = LOWER(:category)) AND " +
           "(:proficiency IS NULL OR LOWER(us.proficiency) = LOWER(:proficiency))")
    List<UserSkill> searchMentors(
            @Param("skillQuery") String skillQuery,
            @Param("category") String category,
            @Param("proficiency") String proficiency
    );

    Optional<UserSkill> findByUserUserIdAndSkillSkillIdAndType(Long userId, Long skillId, String type);
}
