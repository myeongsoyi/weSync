package com.ssafy.weSync.notice.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CreateResponse {
    private Long noticeId;
    private LocalDateTime createAt;
}
