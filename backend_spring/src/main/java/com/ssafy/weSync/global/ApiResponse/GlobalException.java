package com.ssafy.weSync.global.ApiResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class GlobalException extends RuntimeException{
    private final CustomError customError;
}
