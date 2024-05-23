package com.ssafy.weSync.feedback.repository;

import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FeedBackRepository extends JpaRepository<FeedBack, Long> {

    @Query("SELECT f FROM FeedBack f JOIN f.record r JOIN FETCH f.teamUser tu JOIN FETCH tu.user u " +
            "WHERE r.recordId = :recordId ORDER BY f.createdAt DESC ")
    List<FeedBack> findAllByRecordId(@Param("recordId") Long recordId);

    @Query("SELECT f FROM FeedBack f JOIN FETCH f.teamUser tu WHERE f.feedBackId = :feedbackId")
    Optional<FeedBack> findByFeedbackId(@Param("feedbackId") Long feedbackId);
}
