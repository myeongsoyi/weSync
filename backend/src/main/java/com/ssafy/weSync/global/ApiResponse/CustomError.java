package com.ssafy.weSync.global.ApiResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum CustomError {

    // User
    NO_USER(400, "존재하지 않는 유저입니다."),
    DUPLICATE_USER(400, "중복된 유저입니다."),

    // Team
    NO_TEAM(400, "존재하지 않는 팀입니다."),

    // TeamUser
    NO_TEAMUSER(400, "존재하지 않는 팀원입니다."),

    // Position
    NO_POSITION(400, "존재하지 않는 포지션입니다."),
    DUPLICATE_POSITION(400, "중복된 포지션입니다."),
    POSITION_COLOR_NOT_FOUND(400, "포지션 색깔이 DB에 존재하지 않습니다."),

    // Score
    NO_SCORE(400, "존재하지 않는 악보입니다."),

    // Notice
    NO_NOTICE(400, "존재하지 않는 공지입니다."),
    NO_TEAM_LEADER(401, "팀장이 아닙니다."),

    // Record
    WRONG_TIME_FORMAT(400, "잘못된 시간 형식입니다."),

    // Others
    INCOMPLETE_INFORMATION(400, "입력한 정보가 부족합니다."),
    KAKAO_API_ERROR(400, "카카오 api 오류가 발생했습니다"),
    ;

    private final int errorCode;
    private final String errorMessage;
}
