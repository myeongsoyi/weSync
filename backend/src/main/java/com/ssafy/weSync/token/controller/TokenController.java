package com.ssafy.weSync.token.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.token.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:3000")
public class TokenController {

    @Autowired
    private TokenService tokenService;

    @PostMapping("access-token/issue")
    public ResponseEntity<Response> updateAccessToken(HttpServletRequest request) throws JSONException {
        ResponseEntity<Response> response = tokenService.updateAccessToken(request);
        return response;
    }
}
