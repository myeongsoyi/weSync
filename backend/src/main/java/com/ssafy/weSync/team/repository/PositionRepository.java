package com.ssafy.weSync.team.repository;

import com.ssafy.weSync.team.entity.Position;
import com.ssafy.weSync.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByTeam(Team team);
    Optional<Position> findByPositionId(Long positionId);
}