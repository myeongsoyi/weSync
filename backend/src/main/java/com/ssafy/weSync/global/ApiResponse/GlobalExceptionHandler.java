package com.ssafy.weSync.global.ApiResponse;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<Response> handleGlobalException(GlobalException ex){
        Response response = new Response().builder()
                .success(false)
                .data(null)
                .error(new ErrorResponse(Integer.toString(ex.getCustomError().getErrorCode()), ex.getCustomError().getErrorMessage()))
                .build();
        return new ResponseEntity<Response>(response, HttpStatusCode.valueOf(ex.getCustomError().getErrorCode()));
    }
}
