package com.ssafy.weSync.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto {
    private Long id;
    private String nickname;
    private String img;
    private String grantType;
    private String accessToken;
    private Integer accessTokenExpireTime;
    private String refreshToken;
    private Integer refreshTokenExpireTime;
}
