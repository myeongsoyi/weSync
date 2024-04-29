package com.ssafy.weSync.token.service;

import com.ssafy.weSync.global.ApiResponse.Response;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.json.JSONException;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Enumeration;
import java.util.Optional;

@Service
@Transactional
public class TokenService {

    private final RestTemplate restTemplate;

    public TokenService(RestTemplateBuilder builder) {
        restTemplate = builder.build();
    }

    public ResponseEntity<Response> updateAccessToken(HttpServletRequest request) throws JSONException{


//        Enumeration<String> headerNames = request.getHeaderNames();
//        while (headerNames.hasMoreElements()) {
//            String headerName = headerNames.nextElement();
//            String headerValue = request.getHeader(headerName);
//            System.out.println(headerName + ": " + headerValue);
//        }
        String refreshToken = request.getHeader("Authorization").replaceFirst("Bearer ", "");
        System.out.println(9999);
        System.out.println(refreshToken);
        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type","application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", "e727d2a8c4603102e14f05db20f8e942");
        body.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(body, headers);
        ResponseEntity<String> res = restTemplate.postForEntity(url, req, String.class);

        if(res.getStatusCode() == HttpStatus.OK){
            System.out.println(res.getBody());
            String responseBody = res.getBody();

            System.out.println("updateToken");
        }

        ResponseEntity<Response> r = null;
        return r;
    }
}