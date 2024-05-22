package com.ssafy.weSync.notice.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentUpdateResponse {
    private LocalDateTime updatedAt;

    public static ContentUpdateResponse toDto(LocalDateTime updatedAt){
        return ContentUpdateResponse.builder()
                .updatedAt(updatedAt)
                .build();
    }
}
