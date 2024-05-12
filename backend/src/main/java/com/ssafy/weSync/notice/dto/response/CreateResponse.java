package com.ssafy.weSync.notice.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CreateResponse {
    private Long noticeId;
    private LocalDateTime createdAt;

    public static CreateResponse toDto(Long noticeId, LocalDateTime createdAt) {
        return CreateResponse.builder()
                .noticeId(noticeId)
                .createdAt(createdAt)
                .build();
    }
}
