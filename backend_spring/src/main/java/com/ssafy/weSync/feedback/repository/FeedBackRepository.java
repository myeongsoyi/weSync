package com.ssafy.weSync.feedback.repository;

import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedBackRepository extends JpaRepository<FeedBack, Long> {

    @Query("SELECT f FROM FeedBack f WHERE f.record.recordId = :recordId ORDER BY f.createdAt DESC ")
    List<FeedBack> findAllByRecordId(@Param("recordId") Long recordId);
}
