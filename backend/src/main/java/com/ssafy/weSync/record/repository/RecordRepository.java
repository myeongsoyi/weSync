package com.ssafy.weSync.record.repository;

import com.ssafy.weSync.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<Record, Long> {
}
