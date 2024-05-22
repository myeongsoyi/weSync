package com.ssafy.weSync.record.dto.response;

import com.ssafy.weSync.record.entity.Record;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
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
                .startAt(record.getStartAt())
                .endAt(record.getEndAt())
                .createdAt(record.getCreatedAt())
                .userId(record.getTeamUser().getUser().getUserId())
                .nickname(record.getTeamUser().getUser().getNickname())
                .positionId(record.getScore().getPosition() != null ?
                        record.getScore().getPosition().getPositionId() : null)
                .positionName(record.getScore().getPosition() != null ?
                        record.getScore().getPosition().getPositionName() : null)
                .colorCode(record.getScore().getPosition() != null && record.getScore().getPosition().getColor() != null ?
                        record.getScore().getPosition().getColor().getColorCode() : null)
                .build();
    }
}
