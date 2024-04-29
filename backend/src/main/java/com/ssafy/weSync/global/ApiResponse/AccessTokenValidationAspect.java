package com.ssafy.weSync.global.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Aspect
@Component
public class AccessTokenValidationAspect {

    private final HttpServletRequest request;

    public AccessTokenValidationAspect(HttpServletRequest request) {
        this.request = request;
    }


    @Before("execution(* com.ssafy.weSync.*.controller.*.*(..)) && " +
            "!execution(* com.ssafy.weSync.user.controller.UserController.kakaoCallback(..)) &&" +
            "!execution(* com.ssafy.weSync.token.controller.TokenController.updateAccessToken(..))")
    public void AccessTokenValidation(JoinPoint joinPoint) throws Throwable {
        String accessToken = request.getHeader("Authorization");

        // Kakao API에 대한 요청을 보내기 위한 URL
        String url = "https://kapi.kakao.com/v1/user/access_token_info";

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", accessToken);
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);

        // RestTemplate을 사용하여 GET 요청 보내기
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);

            // 응답 코드 확인
            HttpStatus statusCode = (HttpStatus) responseEntity.getStatusCode();
            if (statusCode == HttpStatus.OK) {
                System.out.println("유효");
            } else {
                System.out.println("무효");
            }
        } catch (HttpClientErrorException e) {
            // HttpClientErrorException은 4xx 또는 5xx 에러를 나타냅니다.
            // 401은 Unauthorized이므로, 해당 경우에 "무효"를 출력합니다.
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                System.out.println("무효");
            } else {
                // 그 외의 에러 코드는 여기에서 처리할 수 있습니다.
                System.out.println("다른 에러가 발생했습니다: " + e.getStatusCode());
            }
        }
    }
}
