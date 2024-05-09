package com.ssafy.weSync.token.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.token.dto.TokenDto;
import com.ssafy.weSync.token.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "https://wesync.co.kr")
public class TokenController {

    @Autowired
    private TokenService tokenService;

    @PostMapping("access-token/issue")
    public ResponseEntity<Response<TokenDto>> updateAccessToken(HttpServletRequest request){
        return tokenService.updateAccessToken(request);
    }
}
