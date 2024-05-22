package com.ssafy.weSync.feedback.dto.request;

import com.ssafy.weSync.feedback.entity.FeedBack;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRequest {
    private String content;
}
