package com.ssafy.weSync.team.repository;

import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByTeamId(Long teamId);
    Optional<Team> findByProfileUrl(String profileUrl);
}