package com.ssafy.weSync.feedback.dto.request;

import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.record.entity.Record;
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
    private String content;

    public FeedBack toEntity(Record record, TeamUser teamUser){
        return FeedBack.builder()
                .content(content)
                .record(record)
                .teamUser(teamUser)
                .build();
    }
}
