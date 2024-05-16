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
public class GetAllResponse {
    private Long feedbackId;
    private String content;
    private Long userId;
    private String nickname;
    private String profileImg;
    private LocalDateTime createdAt;

    public static GetAllResponse toDto(FeedBack feedBack){
        return GetAllResponse.builder()
                .feedbackId(feedBack.getFeedBackId())
                .content(feedBack.getContent())
                .userId(feedBack.getTeamUser().getUser().getUserId())
                .nickname(feedBack.getTeamUser().getUser().getNickname())
                .profileImg(feedBack.getTeamUser().getUser().getImgUrl())
                .createdAt(feedBack.getCreatedAt())
                .build();
    }
}
