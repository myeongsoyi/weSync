package com.ssafy.weSync.record.dto.request;

import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.score.entity.Score;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRequest {
    private String title;
    private String startAt;
    private String endAt;

    public Record toEntity(String url, Score score, TeamUser teamUser){
        return Record.builder()
                .title(title)
                .url(url)
                .startAt(parseTime(startAt))
                .endAt(parseTime(endAt))
                .score(score)
                .teamUser(teamUser)
                .build();
    }

    public Long parseTime(String time){
        if (time == null){
            return 0L;
        }
        String[] parts = time.split(":");
        if (parts.length != 2){
            throw new GlobalException(CustomError.WRONG_TIME_FORMAT);
        }
        return 1000L * Long.parseLong(parts[0]) + Long.parseLong(parts[1]);
    }
}
