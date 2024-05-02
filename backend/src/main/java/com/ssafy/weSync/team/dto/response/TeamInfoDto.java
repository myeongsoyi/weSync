package com.ssafy.weSync.team.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamInfoDto {
    private String teamName;
    private boolean isSongNameExist;
    private String songName;
    private boolean isMyPositionExist;
    private String myPosition;
    private String teamProfileUrl;
    private MemberInfoDto member;
}