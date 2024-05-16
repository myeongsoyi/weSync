package com.ssafy.weSync.team.repository;

import com.ssafy.weSync.team.entity.Position;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.team.entity.TeamUser;
import com.ssafy.weSync.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamUserRepository extends JpaRepository<TeamUser, Long> {
    Optional<TeamUser> findByTeamUserId(Long teamUserId);
    List<TeamUser> findByUser(User user);
    List<TeamUser> findByUserOrderByCreatedAtDesc(User user);
    List<TeamUser> findByTeam(Team team);
    Optional<TeamUser> findByUserUserIdAndTeamTeamId(Long userId, Long teamId);
    List<TeamUser> findByPosition(Position position);

    @Query("SELECT tu FROM TeamUser tu JOIN tu.team t JOIN tu.user u WHERE u.userId = :userId And t.teamId = :teamId")
    TeamUser findByUserIdAndTeamId(@Param("userId") Long userId, @Param("teamId") Long teamId);

    @Query("SELECT tu FROM TeamUser tu JOIN tu.notices n JOIN tu.user u WHERE n.noticeId =:noticeId AND u.userId = :userId")
    TeamUser findByUserIdAndNoticeId(@Param("userId") Long userId, @Param("noticeId") Long noticeId);
}
