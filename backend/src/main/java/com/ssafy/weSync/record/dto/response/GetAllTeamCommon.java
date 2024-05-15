package com.ssafy.weSync.record.dto.response;

import com.ssafy.weSync.notice.dto.response.GetAllResponse;
import com.ssafy.weSync.record.entity.Record;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class GetAllTeamCommon {
    private Long recordId;
    private String title;
    private String recordUrl;
    private boolean isPublic;
    private String startAt;
    private String endAt;
    private LocalDateTime createAt;

    public static String parseTime(Long time){
        long seconds = time / 1000;
        long milliseconds = time % 1000;
        return String.format("%d:%03d", seconds, milliseconds);
    }

}
