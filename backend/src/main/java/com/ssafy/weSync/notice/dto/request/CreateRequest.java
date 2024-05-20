package com.ssafy.weSync.notice.dto.request;

import com.ssafy.weSync.notice.entity.Notice;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRequest {
    private String content;
    private Boolean isFixed;
    private Team team;
    private TeamUser teamUser;

    public Notice toEntity(){
        return Notice.builder()
                .content(content)
                .isFixed(isFixed)
                .team(team)
                .teamUser(teamUser)
                .build();
    }
}
