package com.ssafy.weSync.position.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PositionDto {
    private  Long positionId;
    private String positionName;
    private Long colorId;
    private String colorCode;
}