package com.ssafy.weSync.notice.dto.response;

import com.ssafy.weSync.notice.entity.Notice;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GetAllResponse {
    private Long noticeId;
    private String content;
    private boolean isFixed;
    private LocalDateTime createdAt;

    public static GetAllResponse toDto(Notice notice){
        return GetAllResponse.builder()
                .noticeId(notice.getNoticeId())
                .content(notice.getContent())
                .isFixed(notice.getIsFixed())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}
