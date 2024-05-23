package com.ssafy.weSync.notice.respository;

import com.ssafy.weSync.notice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    @Query("SELECT n FROM Notice n JOIN FETCH n.team t WHERE n.noticeId = :noticeId ORDER BY n.isFixed DESC, n.createdAt DESC")
    Optional<Notice> findByNoticeIdWithTeamAndTeamUser(@Param("noticeId") Long noticeId);
}
