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
                .positionId(record.getTeamUser().getPosition() != null ?
                        record.getTeamUser().getPosition().getPositionId() : null)
                .positionName(record.getTeamUser() != null ?
                        record.getTeamUser().getPosition().getPositionName() : null)
                .colorCode(record.getTeamUser().getPosition() != null && record.getTeamUser().getPosition().getColor() != null ?
                        record.getTeamUser().getPosition().getColor().getColorCode() : null)
                .build();
    }
}
