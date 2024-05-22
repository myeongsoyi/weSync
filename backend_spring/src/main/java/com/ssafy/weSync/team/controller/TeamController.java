package com.ssafy.weSync.team.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.team.dto.request.*;
import com.ssafy.weSync.team.dto.response.*;
import com.ssafy.weSync.team.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    @Autowired
    private TeamService teamService;

    //팀 생성
    @PostMapping("")
    public ResponseEntity<Response<TeamIdDto>> createTeam(@ModelAttribute CreateTeamInfoDto createTeamInfoDto) throws IOException {
        return teamService.createTeam(createTeamInfoDto);
    }

    //팀 정보 변경
    @PatchMapping("/{id}")
    public ResponseEntity<Response<TeamIdDto>> editTeam(@ModelAttribute EditTeamInfoDto editTeamInfoDto, @PathVariable Long id) throws IOException {
        return teamService.editTeam(editTeamInfoDto, id);
    }

    //현재 속한 팀 이름, 곡 이름, 프로필 사진, 팀장 여부, 진행중인 팀 이름, 곡 이름, 프로필 사진 조회
    @GetMapping("/info")
    public ResponseEntity<Response<ShortCurrentTeamInfoDto>> activeTeamsInfo(@RequestParam() Long teamId) {
        return teamService.getActiveTeamsShort(teamId);
    }

    //진행중인 팀목록 조회
    @GetMapping("/active")
    public ResponseEntity<Response<List<LongTeamInfoDto>>> getActiveTeams() {
        return teamService.getActiveTeams();
    }

    //전체 팀목록 조회
    @GetMapping("/total")
    public ResponseEntity<Response<List<LongTeamInfoDto>>> getAllTeams() {
        return teamService.getAllTeams();
    }

    //팀 삭제
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Response<TeamIdDto>> deleteTeam(@PathVariable Long id) {
        return teamService.deleteTeam(id);
    }

    //팀 나가기
    @DeleteMapping("/leave/{id}")
    public ResponseEntity<Response<TeamIdDto>> leaveTeam(@PathVariable Long id) {
        return teamService.leaveTeam(id);
    }

}