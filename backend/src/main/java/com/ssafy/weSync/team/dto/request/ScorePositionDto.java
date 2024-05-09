package com.ssafy.weSync.team.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScorePositionDto {
    private Long scoreId;
    private Long positionId;
}