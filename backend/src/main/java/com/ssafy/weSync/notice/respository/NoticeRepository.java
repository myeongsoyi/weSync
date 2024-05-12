package com.ssafy.weSync.notice.respository;

import com.ssafy.weSync.notice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
