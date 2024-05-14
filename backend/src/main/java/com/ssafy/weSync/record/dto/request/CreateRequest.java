package com.ssafy.weSync.record.dto.request;

import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.record.entity.Status;
import com.ssafy.weSync.team.entity.Score;
import com.ssafy.weSync.team.entity.TeamUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRequest {
    private String title;
    private Status status;
    private String time;
    private MultipartFile file;

    public Record toEntity(String url, Score score, TeamUser teamUser){
        return Record.builder()
                .title(title)
                .url(url)
                .status(status)
                .startAt(parseTime(time))
                .score(score)
                .teamUser(teamUser)
                .build();
    }

    public Long parseTime(String time){
        if (time == null){
            return 0L;
        }
        String[] parts = time.split(":");
        if (parts.length != 3){
            throw new GlobalException(CustomError.WRONG_TIME_FORMAT);
        }
        return 60000L * Long.parseLong(parts[0]) + 1000L * Long.parseLong(parts[1]) + Long.parseLong(parts[2]);
    }
}
