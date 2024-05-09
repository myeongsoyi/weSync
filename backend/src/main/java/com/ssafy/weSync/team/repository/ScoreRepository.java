package com.ssafy.weSync.team.repository;

import com.ssafy.weSync.team.entity.Color;
import com.ssafy.weSync.team.entity.Position;
import com.ssafy.weSync.team.entity.Score;
import com.ssafy.weSync.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findByScoreId(Long scoreId);
}