package com.ssafy.weSync.team.repository;

import com.ssafy.weSync.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByTeamId(Long teamId);

    @Query("SELECT t FROM Team t LEFT JOIN FETCH t.notices n WHERE t.teamId=:teamId")
    Optional<Team> findByTeamIdWithNotices(@Param("teamId") Long teamId);
}