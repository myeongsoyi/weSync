package com.ssafy.weSync.global.ApiResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// ResponseEntity 응답
@Slf4j // log
public class ResponseFactory {
    public static <T> ResponseEntity<Response<T>> success(T data) {
        HttpHeaders responseHeaders = new HttpHeaders();
        Response<T> responseBody = new Response<>();
        responseBody.setSuccess(true);
        responseBody.setData(data);
        responseBody.setError(null);
        return new ResponseEntity<>(responseBody, responseHeaders, HttpStatus.valueOf(200));
    }

    public static <T> ResponseEntity<Response<T>> fail() {
        HttpHeaders responseHeaders = new HttpHeaders();
        Response<T> responseBody = new Response<>();
        responseBody.setSuccess(false);
        responseBody.setData(null);
        ErrorResponse responseError = new ErrorResponse("400", "잘못된 요청입니다.");
        responseBody.setError(responseError);
        log.info("에러: 잘못된 요청입니다.");
        return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
    }

    public static <T> ResponseEntity<Response<T>> fail(String errorMessage) {
        HttpHeaders responseHeaders = new HttpHeaders();
        Response<T> responseBody = new Response<>();
        responseBody.setSuccess(false);
        responseBody.setData(null);
        ErrorResponse responseError = new ErrorResponse("400", errorMessage);
        responseBody.setError(responseError);
        log.info(errorMessage);
        return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
    }
}
