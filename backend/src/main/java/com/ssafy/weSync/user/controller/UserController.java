package com.ssafy.weSync.user.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.user.dto.UserDto;
import com.ssafy.weSync.user.service.UserService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<Response> kakaoCallback(@RequestParam("code") String authorizationCode) throws JSONException {
        Response response = userService.kakaoCallback(authorizationCode);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("")
    public ResponseEntity<Response> deleteUser(){
        Response response = userService.deleteUser();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/logout")
    public ResponseEntity<Response> logout(){
        Response response = userService.logout();
        return ResponseEntity.ok(response);
    }
}
