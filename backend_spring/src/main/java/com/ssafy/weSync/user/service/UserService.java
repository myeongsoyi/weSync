package com.ssafy.weSync.user.service;

import com.ssafy.weSync.global.ApiResponse.*;
import com.ssafy.weSync.user.dto.LoginDto;
import com.ssafy.weSync.user.entity.User;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
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

import java.util.Base64;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    public UserService(UserRepository userRepository, RestTemplateBuilder builder) {
        this.userRepository = userRepository;
        restTemplate = builder.build();
    }

    //로그인, 회원가입
    public ResponseEntity<Response<LoginDto>> kakaoCallback(String authorizationCode, HttpServletRequest request){

        String origin = request.getHeader("Origin");
        String redirectUri;

        if ("http://localhost:3000".equals(origin)) {
            redirectUri = "http://localhost:3000/oauth/kakao";
        } else {
            // 기본값 설정
            redirectUri = "https://wesync.co.kr/oauth/kakao";
        }

        //토큰 받기
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
        tokenBody.add("grant_type", "authorization_code");
        tokenBody.add("client_id", kakaoClientId);
        tokenBody.add("redirect_uri", redirectUri);
        tokenBody.add("code", authorizationCode);

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenBody, tokenHeaders);
        ResponseEntity<String> tokenResponse = restTemplate.postForEntity(tokenUrl, tokenRequest, String.class);

        if (tokenResponse.getStatusCode() != HttpStatus.OK){
            throw new GlobalException(CustomError.KAKAO_API_ERROR);
        }

        String tokenResponseBody = tokenResponse.getBody();
        JSONObject tokenJsonObject = new JSONObject(tokenResponseBody);

        String accessToken = tokenJsonObject.getString("access_token");
        String refreshToken = tokenJsonObject.getString("refresh_token");
        String idToken = tokenJsonObject.getString("id_token");
        Integer expires_in = tokenJsonObject.getInt("expires_in");
        Integer refresh_token_expires_in = tokenJsonObject.getInt("refresh_token_expires_in");

        //idToken 디코딩
        String payloadBase64 = idToken.split("\\.")[1];
        byte[] decodedBytes = Base64.getUrlDecoder().decode(payloadBase64);
        String decodedHeader = new String(decodedBytes);
        JSONObject payloadJsonObject = new JSONObject(decodedHeader);

        String nickname = payloadJsonObject.getString("nickname");
        Long kakaoId = Long.parseLong(payloadJsonObject.getString("sub"));
        String img = payloadJsonObject.getString("picture");

        Long userId;

        Optional<User> user = userRepository.findByKakaoIdAndIsActiveTrue(kakaoId);

        //신규회원
        if(user.isEmpty()){
            User newUser = new User();
            newUser.setKakaoId(kakaoId);
            newUser.setNickname(nickname);
            newUser.setImgUrl(img);
            newUser.setIsActive(true);
            userRepository.save(newUser);
            User savedUser = userRepository.save(newUser);
            userId = savedUser.getUserId();
        }
        //기존회원
        else{
            userId = user.get().getUserId();
        }

        LoginDto responseUser = new LoginDto(userId, nickname, img, "bearer", accessToken, expires_in, refreshToken, refresh_token_expires_in);

        return ResponseFactory.success(responseUser);
    }

    //회원탈퇴
    public ResponseEntity<Response<LoginDto>> deleteUser(HttpServletRequest request){

        String accessToken = request.getHeader("Authorization");
        ResponseEntity<String> kakaoResponse = logoutFromKakao(accessToken);

        if (kakaoResponse.getStatusCode() == HttpStatus.OK) {
            String kakaoResponseBody = kakaoResponse.getBody();
            JSONObject kakaoJsonObject = new JSONObject(kakaoResponseBody);
            long kakaoId = kakaoJsonObject.getLong("id");
            Optional<User> user = userRepository.findByKakaoIdAndIsActiveTrue(kakaoId);
            System.out.println(user.isEmpty());
            if(user.isEmpty()){
                throw new GlobalException(CustomError.NO_USER);
            }
            user.get().setIsActive(false);

            return ResponseFactory.success(null);

        } else {
            throw new GlobalException(CustomError.KAKAO_API_ERROR);
        }
    }

    //로그아웃
    public ResponseEntity<Response<LoginDto>> logout(HttpServletRequest request){
        String accessToken = request.getHeader("Authorization");
        ResponseEntity<String> kakaoResponse = logoutFromKakao(accessToken);

        if(kakaoResponse.getStatusCode() == HttpStatus.OK){
            return ResponseFactory.success(null);
        }
        else{
            throw new GlobalException(CustomError.KAKAO_API_ERROR);
        }
    }

    //카카오에 로그아웃 요청
    public ResponseEntity<String> logoutFromKakao(String accessToken) {

        String logoutUrl = "https://kapi.kakao.com/v1/user/logout";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", accessToken);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.postForEntity(logoutUrl, requestEntity, String.class);
    }

}