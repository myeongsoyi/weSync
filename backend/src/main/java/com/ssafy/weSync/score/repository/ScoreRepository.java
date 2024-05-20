package com.ssafy.weSync.score.repository;

import com.ssafy.weSync.position.entity.Position;
import com.ssafy.weSync.score.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findByScoreId(Long scoreId);
    List<Score> findByPosition(Position position);
}