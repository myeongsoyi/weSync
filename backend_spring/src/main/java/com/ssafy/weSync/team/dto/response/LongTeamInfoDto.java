package com.ssafy.weSync.team.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LongTeamInfoDto {
    private Long teamId;
    private String teamName;
    private boolean isSongNameExist;
    private String songName;
    private boolean isMyPositionExist;
    private String myPosition;
    private String positionColor;
    private String positionCode;
    private String teamProfileUrl;
    private Boolean isLeader;
    private Boolean isFinished;
    private LocalDateTime createdAt;
    private List<MemberInfoDto> member;
}