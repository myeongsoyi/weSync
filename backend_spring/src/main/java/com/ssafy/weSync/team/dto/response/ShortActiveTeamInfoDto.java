package com.ssafy.weSync.team.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShortActiveTeamInfoDto {
    private Long teamId;
    private String teamName;
    private boolean isSongNameExist;
    private String songName;
    private String teamProfileUrl;
    private boolean isFinished;
}