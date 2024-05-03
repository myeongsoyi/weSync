package com.ssafy.weSync.team.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.team.dto.response.TeamIdDto;
import com.ssafy.weSync.team.dto.response.TeamInfoDto;
import com.ssafy.weSync.team.dto.response.TeamLinkDto;
import com.ssafy.weSync.team.dto.response.TeamUserDto;
import com.ssafy.weSync.team.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/team/")
@CrossOrigin(origins = "http://localhost:3000") //추후 프론트 배포 주소로 변경
public class TeamController {

    @Autowired
    private TeamService teamService;

    //팀 초대 링크 생성
    @GetMapping("{id}")
    public ResponseEntity<Response<TeamLinkDto>> getTeamLink(@PathVariable Long id) {
        return teamService.getTeamLink(id);
    }

    //유저 강퇴
//    @DeleteMapping("{id}")
//    public ResponseEntity<Response<TeamUserDto>> deleteTeamUser(@PathVariable Long id) {
//        return teamService.deleteTeamUser(id);
//    }

    //초대된 팀으로 이동
    @GetMapping("invite/{UUID}")
    public ResponseEntity<Response<TeamIdDto>> redirectToTeam(@PathVariable String UUID) {
        return teamService.redirectToTeam(UUID);
    }

    //진행중인 팀목록 조회
//    @GetMapping("active")
//    public ResponseEntity<Response<TeamInfoDto>> getActiveTeams() {
//        return teamService.getActiveTeams();
//    }

}