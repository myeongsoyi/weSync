package com.ssafy.weSync.user.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.user.dto.LoginDto;
import com.ssafy.weSync.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") //추후 프론트 배포 주소로 변경
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<Response<LoginDto>> kakaoCallback(@RequestParam("code") String authorizationCode){
        return userService.kakaoCallback(authorizationCode);
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
