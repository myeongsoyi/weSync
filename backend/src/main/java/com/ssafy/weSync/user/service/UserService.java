package com.ssafy.weSync.user.service;

import com.ssafy.weSync.global.ApiResponse.ErrorResponse;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.user.dto.LoginDto;
import com.ssafy.weSync.user.entity.User;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private HttpSession session;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    public UserService(UserRepository userRepository, RestTemplateBuilder builder) {
        this.userRepository = userRepository;
        restTemplate = builder.build();
    }

    public ResponseEntity<Response<LoginDto>> kakaoCallback(String authorizationCode){

        //토큰 받기
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
        tokenBody.add("grant_type", "authorization_code");
        tokenBody.add("client_id", kakaoClientId);
        tokenBody.add("redirect_uri", "http://localhost:3000/home"); //추후 프론트 리다이랙트 주소로 변경
        tokenBody.add("code", authorizationCode);

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenBody, tokenHeaders);
        ResponseEntity<String> tokenResponse = restTemplate.postForEntity(tokenUrl, tokenRequest, String.class);

        if (tokenResponse.getStatusCode() == HttpStatus.OK) {
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

            //세션 저장
            session.setAttribute("nickname", nickname);
            session.setAttribute("id", userId);
            session.setAttribute("img", img);

            LoginDto responseUser = new LoginDto(userId, nickname, img, "bearer", accessToken, expires_in, refreshToken, refresh_token_expires_in);
            Response<LoginDto> responseBody = new Response<>(true,responseUser,null);

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));

        } else {
            HttpHeaders responseHeaders = new HttpHeaders();
            ErrorResponse responseError = new ErrorResponse("400", "카카오 API 호출이 실패했습니다.");
            Response<LoginDto> responseBody = new Response<>(false,null,responseError);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
        }

    }

    public ResponseEntity<Response<LoginDto>> deleteUser(HttpServletRequest request){

        String accessToken = request.getHeader("Authorization");

        ResponseEntity<String> kakaoResponse = logoutFromKakao(accessToken);

        long userId;
        Response<LoginDto> responseBody = new Response<>();

        if(kakaoResponse.getStatusCode() == HttpStatus.OK){
            String kakaoResponseBody = kakaoResponse.getBody();
            JSONObject kakaoJsonObject = new JSONObject(kakaoResponseBody);
            long kakaoId = kakaoJsonObject.getLong("id");
            Optional<User> user = userRepository.findByKakaoIdAndIsActiveTrue(kakaoId);
            user.get().setIsActive(false);

            responseBody.setSuccess(true);
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

    public ResponseEntity<Response<LoginDto>> logout(HttpServletRequest request){
        String accessToken = request.getHeader("Authorization");
        ResponseEntity<String> kakaoResponse = logoutFromKakao(accessToken);
        Response<LoginDto> responseBody = new Response<>();

        if(kakaoResponse.getStatusCode() == HttpStatus.OK){
            responseBody.setSuccess(true);
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

    //카카오 로그아웃
    public ResponseEntity<String> logoutFromKakao(String accessToken) {

        String logoutUrl = "https://kapi.kakao.com/v1/user/logout";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", accessToken);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.postForEntity(logoutUrl, requestEntity, String.class);
    }

}