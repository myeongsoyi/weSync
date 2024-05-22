package com.ssafy.weSync.notice.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
