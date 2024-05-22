package com.ssafy.weSync.feedback.dto.response;

import com.ssafy.weSync.feedback.entity.FeedBack;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateResponse {
    private LocalDateTime updatedAt;

    public static UpdateResponse toDto(FeedBack feedBack){
        return UpdateResponse.builder()
                .updatedAt(feedBack.getUpdatedAt())
                .build();
    }
}
