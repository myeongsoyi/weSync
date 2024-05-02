package com.ssafy.weSync.team.repository;

import com.ssafy.weSync.team.entity.TeamUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamUserRepository extends JpaRepository<TeamUser, Long> {
    Optional<TeamUser> findByTeamUserId(Long teamUserId);
}
