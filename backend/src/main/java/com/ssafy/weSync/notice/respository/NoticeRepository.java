package com.ssafy.weSync.notice.respository;

import com.ssafy.weSync.notice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    @Query("SELECT n FROM Notice n WHERE n.team.teamId = :teamId ORDER BY n.createdAt DESC")
    List<Notice> findAllByTeamIdOrderByCreatedAt(@Param("teamId") Long teamId);
}
