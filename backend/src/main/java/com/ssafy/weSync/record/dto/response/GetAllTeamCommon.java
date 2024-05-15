package com.ssafy.weSync.record.dto.response;

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
    private Long startAt;
    private LocalDateTime createAt;
}
