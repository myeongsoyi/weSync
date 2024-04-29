package com.ssafy.weSync.member.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    @GetMapping("/1")
    public String Test1(){
        return "Hello World1";
    }

    @GetMapping("/2")
    public String Test2(){
        return "Hello World2";
    }

    @GetMapping("/3")
    public String Test3(){
        return "Hello World3";
    }

}
