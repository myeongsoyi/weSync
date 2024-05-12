package com.ssafy.weSync.team.repository;

import com.ssafy.weSync.team.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findByScoreId(Long scoreId);
}