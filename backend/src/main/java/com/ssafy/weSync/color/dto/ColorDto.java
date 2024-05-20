package com.ssafy.weSync.color.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColorDto {
    private Long colorId;
    private String colorName;
    private String colorCode;
}