package com.ssafy.weSync.team.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomPositionDto {
    private Long teamId;
    private String positionName;
    private Long colorId;
}