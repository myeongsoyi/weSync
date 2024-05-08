package com.ssafy.weSync.team.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeamInfoDto {
    private Long userId;
    private String teamName;
    private String songName;
    private MultipartFile teamProfile;
}