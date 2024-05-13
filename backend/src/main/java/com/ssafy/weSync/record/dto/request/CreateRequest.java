package com.ssafy.weSync.record.dto.request;

import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.record.entity.Status;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class CreateRequest {
    private String title;
    private Status status;
    private String time;
    private MultipartFile file;

    public Record toEntity(String url){
        return Record.builder()
                .title(title)
                .status(status)
                .startAt(time)
                .url()
                .build();
    }
}
