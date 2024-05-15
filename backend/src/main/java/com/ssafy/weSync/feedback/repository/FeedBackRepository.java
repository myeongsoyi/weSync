package com.ssafy.weSync.feedback.repository;

import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.team.entity.TeamUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedBackRepository extends JpaRepository<FeedBack, Long> {

}
