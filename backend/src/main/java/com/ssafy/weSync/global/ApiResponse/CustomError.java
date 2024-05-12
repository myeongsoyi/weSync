package com.ssafy.weSync.global.ApiResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum CustomError {

    // Team
    NO_TEAM(400, "존재하지 않는 팀입니다."),

    // TeamUser
    NO_TEAMUSER(400, "존재하지 않는 팀원입니다."),

    // Notice
    NO_NOTICE(400, "존재하지 않는 공지입니다."),
    NO_TEAM_LEADER(401, "팀장이 아닙니다.")
    ;

    private final int errorCode;
    private final String errorMessage;
}
