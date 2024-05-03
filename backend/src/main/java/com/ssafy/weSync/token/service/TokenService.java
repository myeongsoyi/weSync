package com.ssafy.weSync.token.service;

import com.ssafy.weSync.global.ApiResponse.ErrorResponse;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.token.dto.TokenDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
public class TokenService {

    private final RestTemplate restTemplate;

    public TokenService(RestTemplateBuilder builder) {
        restTemplate = builder.build();
    }

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    public ResponseEntity<Response<TokenDto>> updateAccessToken(HttpServletRequest request){

        String refreshToken = request.getHeader("Authorization").replaceFirst("Bearer ", "");
        String kakaoUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders kakaoHeaders = new HttpHeaders();
        kakaoHeaders.add("Content-type","application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> kakaoBody = new LinkedMultiValueMap<>();
        kakaoBody.add("grant_type", "refresh_token");
        kakaoBody.add("client_id", kakaoClientId);
        kakaoBody.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> kakaoRequest = new HttpEntity<>(kakaoBody, kakaoHeaders);
        ResponseEntity<String> kakaoResponse = restTemplate.postForEntity(kakaoUrl, kakaoRequest, String.class);

        Response<TokenDto> responseBody = new Response<>();

        if(kakaoResponse.getStatusCode() == HttpStatus.OK){
            String kakaoResponseBody = kakaoResponse.getBody();

            JSONObject kakaoJsonObject = new JSONObject(kakaoResponseBody);

            String accessToken = kakaoJsonObject.getString("access_token");
            Integer accessTokenExpireTime = kakaoJsonObject.getInt("expires_in");
            TokenDto responseToken = new TokenDto(accessToken,accessTokenExpireTime);
            responseBody = new Response<>(true,responseToken,null);

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
        }
        else{
            HttpHeaders responseHeaders = new HttpHeaders();
            ErrorResponse responseError = new ErrorResponse("400", "카카오 API 호출이 실패했습니다.");
            responseBody.setSuccess(false);
            responseBody.setError(responseError);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
        }
    }
}