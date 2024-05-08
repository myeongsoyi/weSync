package com.ssafy.weSync.team.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditTeamInfoDto {
    private String teamName;
    private String songName;
    private Boolean isFinished;
    private MultipartFile teamProfile;
}