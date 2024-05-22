package com.ssafy.weSync.teamUser.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LongMemberInfoDto {
    private Long teamUserId;
    private String nickName;
    private boolean isLeader;
    private String userProfileUrl;
    private boolean isPositionExist;
    private String positionName;
    private String colorName;
    private String colorCode;
}
