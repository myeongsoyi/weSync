package com.ssafy.weSync.teamUser.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.teamUser.dto.*;
import com.ssafy.weSync.teamUser.service.TeamUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team")
public class TeamUserController {

    @Autowired
    private TeamUserService teamUserService;

    //유저 강퇴
    @DeleteMapping("/{id}")
    public ResponseEntity<Response<TeamUserDto>> deleteTeamUser(@PathVariable Long id) {
        return teamUserService.deleteTeamUser(id);
    }

    //팀원 teamUserId, 이름, 리더 여부, 프로필, 포지션 존재 여부, 포지션 이름, 색깔 이름, 색깔 코드 조회
    @GetMapping("/members/{id}")
    public ResponseEntity<Response<List<LongMemberInfoDto>>> getTeamMembersInfo(@PathVariable Long id) {
        return teamUserService.getTeamMembersInfo(id);
    }

    //팀원 포지션 설정, 변경
    @PutMapping("/team-position")
    public ResponseEntity<Response<TeamUserPositionDto>> teamUserPositionMapping(@RequestBody TeamUserPositionDto teamUserPositionDto) {
        return teamUserService.teamUserPositionMapping(teamUserPositionDto);
    }


}