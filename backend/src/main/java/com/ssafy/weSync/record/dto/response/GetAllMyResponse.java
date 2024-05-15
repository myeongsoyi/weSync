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
    private String startAt;
    private String endAt;
    private LocalDateTime createdAt;
    private Long teamId;
    private String teamUrl;
    private String songName;
    private String positionName;
    private String colorCode;

    public static GetAllMyResponse toDto(Record record) {
        return builder()
                .recordId(record.getRecordId())
                .title(record.getTitle())
                .recordUrl(record.getUrl())
                .teamId(record.getScore().getTeam().getTeamId())
                .teamUrl(record.getScore().getTeam().getProfileUrl())
                .songName(record.getScore().getTitle())
                .positionName(record.getScore().getPosition().getPositionName())
                .colorCode(record.getScore().getPosition().getColor().getColorCode())
                .startAt(parseTime(record.getStartAt()))
                .endAt(parseTime(record.getEndAt()))
                .createdAt(record.getCreatedAt())
                .build();
    }

    public static String parseTime(Long time){
        long seconds = time / 1000;
        long milliseconds = time % 1000;
        return String.format("%d:%03d", seconds, milliseconds);
    }
}
