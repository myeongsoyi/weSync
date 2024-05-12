package com.ssafy.weSync.team.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamUserPositionDto {
    private Long teamUserId;
    private Long positionId;
}