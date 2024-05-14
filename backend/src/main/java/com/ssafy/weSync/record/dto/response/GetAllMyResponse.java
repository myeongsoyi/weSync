package com.ssafy.weSync.record.dto.response;

import com.ssafy.weSync.record.entity.Record;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAllMyResponse {
    private Long recordId;
    private String title;
    private String recordUrl;
    private Long teamId;
    private String teamUrl;
    private String songName;
    private String positionName;
    private Long startAt;
    private LocalDateTime createdAt;

    public static GetAllMyResponse toDto(Record record) {
        return builder()
                .recordId(record.getRecordId())
                .title(record.getTitle())
                .recordUrl(record.getUrl())
                .teamId(record.getScore().getTeam().getTeamId())
                .teamUrl(record.getScore().getTeam().getProfileUrl())
                .songName(record.getScore().getTitle())
                .positionName(record.getScore().getPosition().getPositionName())
                .startAt(record.getStartAt())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
