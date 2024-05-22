package com.ssafy.weSync.team.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberInfoDto {
    private String nickName;
    private boolean isLeader;
    private String userProfileUrl;
}
