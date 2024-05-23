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
public class GetAllTeamResponseByPos extends GetAllTeamCommon{
    private Long userId;
    private String nickname;

    public static GetAllTeamResponseByPos toDto(Record record){
        return GetAllTeamResponseByPos.builder()
                .recordId(record.getRecordId())
                .title(record.getTitle())
                .recordUrl(record.getUrl())
                .isPublic(record.isPublic())
                .startAt(record.getStartAt())
                .endAt(record.getEndAt())
                .createdAt(record.getCreatedAt())
                .userId(record.getTeamUser().getUser().getUserId())
                .nickname(record.getTeamUser().getUser().getNickname())
                .build();
    }
}
