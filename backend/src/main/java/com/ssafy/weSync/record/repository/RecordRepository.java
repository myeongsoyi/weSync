package com.ssafy.weSync.record.repository;

import com.ssafy.weSync.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {
    @Query("SELECT r from Record r join r.score s join s.position p join s.team t join t.teamUsers tu " +
            "join tu.user u WHERE u.userId = :userId ORDER BY r.createdAt desc LIMIT 10")
    List<Record> findAllByUserId(@Param("userId") Long userId);
}
