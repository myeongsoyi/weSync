package com.ssafy.weSync.global.ApiResponse;

import com.ssafy.weSync.token.dto.TokenDto;
import com.ssafy.weSync.user.entity.User;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Aspect
@Component
public class AccessTokenValidationAspect {

    private final HttpServletRequest request;

    private final UserRepository userRepository;

    @Getter
    private Long userId;

    public AccessTokenValidationAspect(HttpServletRequest request, UserRepository userRepository) {
        this.request = request;
        this.userRepository = userRepository;
    }

    // 로그인, access 토큰 갱신하는 경우를 제외하고 토큰 검증
      @Around("execution(* com.ssafy.weSync.*.controller.*.*(..)) && " +
              "!execution(* com.ssafy.weSync.user.controller.UserController.kakaoCallback(..)) &&" +
              "!execution(* com.ssafy.weSync.token.controller.TokenController.updateAccessToken(..))")
    public Object AccessTokenValidation(ProceedingJoinPoint pjp) throws Throwable {
        String accessToken = request.getHeader("Authorization");

        String kakaoUrl = "https://kapi.kakao.com/v1/user/access_token_info";

        HttpHeaders kakaoHeaders = new HttpHeaders();
        kakaoHeaders.add("Authorization", accessToken);
        HttpEntity<?> requestEntity = new HttpEntity<>(kakaoHeaders);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> kakaoResponse = restTemplate.exchange(kakaoUrl, HttpMethod.GET, requestEntity, String.class);
            JSONObject tokenJsonObject = new JSONObject(kakaoResponse.getBody());
            Long kakaoId = tokenJsonObject.getLong("id");
            User user = userRepository.findByKakaoIdAndIsActiveTrue(kakaoId).get();
            userId = user.getUserId();
            if (kakaoResponse.getStatusCode() != HttpStatus.OK) {

                Response<TokenDto> responseBody = new Response<>();

                HttpHeaders responseHeaders = new HttpHeaders();
                ErrorResponse responseError = new ErrorResponse("401", "유효한 토큰이 아닙니다.");

                responseBody.setSuccess(false);
                responseBody.setError(responseError);

                return new ResponseEntity<>(responseBody, responseHeaders, HttpStatus.valueOf(401));
            }
        } catch (HttpClientErrorException e) {
            Response<TokenDto> responseBody = new Response<>();

            HttpHeaders responseHeaders = new HttpHeaders();
            ErrorResponse responseError = new ErrorResponse("401", "유효한 토큰이 아닙니다.");

            responseBody.setSuccess(false);
            responseBody.setError(responseError);

            return new ResponseEntity<>(responseBody, responseHeaders, HttpStatus.valueOf(401));

        }
        return pjp.proceed();
    }
}
