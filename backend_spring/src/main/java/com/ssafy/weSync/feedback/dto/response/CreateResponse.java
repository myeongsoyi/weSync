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
public class CreateResponse {
    private Long feedBackId;
    private String nickname;
    private LocalDateTime createdAt;

    public static CreateResponse toDto(FeedBack feedBack) {
        return CreateResponse.builder()
                .feedBackId(feedBack.getFeedBackId())
                .nickname(feedBack.getTeamUser().getUser().getNickname())
                .createdAt(feedBack.getCreatedAt())
                .build();
    }
}
