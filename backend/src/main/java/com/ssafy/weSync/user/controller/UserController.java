package com.ssafy.weSync.user.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.user.dto.CodeDto;
import com.ssafy.weSync.user.dto.LoginDto;
import com.ssafy.weSync.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<Response<LoginDto>> kakaoCallback(@RequestParam String code, HttpServletRequest request){
        return userService.kakaoCallback(code, request);
    }

    @DeleteMapping("")
    public ResponseEntity<Response<LoginDto>> deleteUser(HttpServletRequest request){
        return userService.deleteUser(request);
    }

    @GetMapping("/logout")
    public ResponseEntity<Response<LoginDto>> logout(HttpServletRequest request){
        return userService.logout(request);
    }

}
