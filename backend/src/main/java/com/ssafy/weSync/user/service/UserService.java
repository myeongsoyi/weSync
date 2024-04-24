package com.ssafy.weSync.user.service;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;

import java.util.Base64;

@Service
@Transactional
public class UserService {

    @Autowired
    private HttpSession session;

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public UserService(UserRepository userRepository, RestTemplateBuilder builder) {
        this.userRepository = userRepository;
        restTemplate = builder.build();
    }

    public Response kakaoCallback(String authorizationCode) throws JSONException {
        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", "e727d2a8c4603102e14f05db20f8e942");
        body.add("redirect_uri", "http://localhost:3000/home");
        body.add("code", authorizationCode);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            String responseBody = response.getBody();
            JSONObject jsonObject = new JSONObject(responseBody);
            String accessToken = jsonObject.getString("access_token");
            String refreshToken = jsonObject.getString("refresh_token");
            String idToken = jsonObject.getString("id_token");
            // JWT에서 첫 번째 온점 이전의 문자열을 추출합니다.
            String payloadBase64 = idToken.split("\\.")[1];

            byte[] decodedBytes = Base64.getUrlDecoder().decode(payloadBase64);
            String decodedHeader = new String(decodedBytes);
            JSONObject payloadJsonObject = new JSONObject(decodedHeader);

            String nickname = payloadJsonObject.getString("nickname");
            String id = payloadJsonObject.getString("sub");
            String img = payloadJsonObject.getString("picture");

            session.setAttribute("nickname", nickname);
            session.setAttribute("id", id);
            session.setAttribute("img", img);

            System.out.print("accessToken : ");
            System.out.println(accessToken);
            System.out.print("refreshToken : ");
            System.out.println(refreshToken);
            System.out.print("nickname : ");
            System.out.println(nickname);
            System.out.print("id : ");
            System.out.println(id);
            System.out.print("img : ");
            System.out.println(img);




        } else {
            throw new RuntimeException("카카오 API 호출이 실패했습니다. 응답 코드: " + response.getStatusCodeValue());
        }
        Response r = new Response();
        return r;
    }

    public Response deleteUser(){
        Response response = new Response();
        System.out.println("ddd");
        return response;
    }

    public Response logout(){
        Response response = new Response();
        System.out.println("lll");
        return response;
    }
}