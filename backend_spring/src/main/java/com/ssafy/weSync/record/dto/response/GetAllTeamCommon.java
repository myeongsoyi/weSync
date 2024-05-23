package com.ssafy.weSync.record.dto.response;

import com.ssafy.weSync.notice.dto.response.GetAllResponse;
import com.ssafy.weSync.record.entity.Record;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class GetAllTeamCommon {
    private Long recordId;
    private String title;
    private String recordUrl;
    private boolean isPublic;
    private Long startAt;
    private Long endAt;
    private LocalDateTime createdAt;

}
