package com.ssafy.weSync.team.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShortCurrentTeamInfoDto {
    private Long teamId;
    private String teamName;
    private boolean isSongNameExist;
    private String songName;
    private String teamProfileUrl;
    private boolean isTeamLeader;
    private List<ShortActiveTeamInfoDto> activeTeams;
    private boolean isFinished;
}