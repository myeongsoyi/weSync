package com.ssafy.weSync.notice.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixUpdateResponse {
    private boolean isFixed;

    public static FixUpdateResponse toDto(boolean isFixed) {
        return FixUpdateResponse.builder()
                .isFixed(isFixed)
                .build();
    }
}
