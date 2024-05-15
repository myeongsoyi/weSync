package com.ssafy.weSync.feedback.repository;

import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.team.entity.TeamUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedBackRepository extends JpaRepository<FeedBack, Long> {

    @Query("SELECT tu FROM TeamUser tu JOIN tu.team t JOIN tu.user u WHERE u.userId = :userId And t.teamId = :teamId")
    TeamUser findByUserIdAndTeamId(@Param("userId") Long userId, @Param("teamId") Long teamId);
}
