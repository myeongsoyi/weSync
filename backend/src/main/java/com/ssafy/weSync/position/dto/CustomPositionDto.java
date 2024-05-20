package com.ssafy.weSync.position.dto;

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