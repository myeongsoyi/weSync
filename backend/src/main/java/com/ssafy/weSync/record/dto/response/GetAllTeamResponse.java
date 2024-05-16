package com.ssafy.weSync.record.dto.response;

import com.ssafy.weSync.record.entity.Record;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class GetAllTeamResponse extends GetAllTeamCommon{
    private Long userId;
    private String nickname;
    private Long positionId;
    private String positionName;
    private String colorCode;

    public static GetAllTeamResponse toDto(Record record){
        return GetAllTeamResponse.builder()
                .recordId(record.getRecordId())
                .title(record.getTitle())
                .recordUrl(record.getUrl())
                .isPublic(record.isPublic())
                .startAt(parseTime(record.getStartAt()))
                .endAt(parseTime(record.getEndAt()))
                .createAt(record.getCreatedAt())
                .userId(record.getTeamUser().getUser().getUserId())
                .nickname(record.getTeamUser().getUser().getNickname())
                .positionId(record.getTeamUser().getPosition().getPositionId())
                .positionName(record.getTeamUser().getPosition().getPositionName())
                .colorCode(record.getTeamUser().getPosition().getColor().getColorCode())
                .build();
    }
}
