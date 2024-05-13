package com.ssafy.weSync.record.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateResponse {
    private Long recordId;
    private String url;

    public static CreateResponse toDto(Long recordId, String url){
        return CreateResponse.builder()
                .recordId(recordId)
                .url(url)
                .build();
    }
}
