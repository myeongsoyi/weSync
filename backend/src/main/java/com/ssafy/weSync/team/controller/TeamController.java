package com.ssafy.weSync.team.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.team.dto.request.CreateTeamInfoDto;
import com.ssafy.weSync.team.dto.request.CustomPositionDto;
import com.ssafy.weSync.team.dto.request.EditTeamInfoDto;
import com.ssafy.weSync.team.dto.request.ScorePositionDto;
import com.ssafy.weSync.team.dto.response.*;
import com.ssafy.weSync.team.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/team")
@CrossOrigin(origins = "http://localhost:3000") //추후 프론트 배포 주소로 변경
public class TeamController {

    @Autowired
    private TeamService teamService;

    //팀 생성
    @PostMapping("")
    public ResponseEntity<Response<TeamIdDto>> createTeam(@ModelAttribute CreateTeamInfoDto createTeamInfoDto) throws IOException {
        return teamService.createTeam(createTeamInfoDto);
    }

    //팀 정보 변경
    @PutMapping("/{id}")
    public ResponseEntity<Response<TeamIdDto>> editTeam(@ModelAttribute EditTeamInfoDto editTeamInfoDto, @PathVariable Long id) throws IOException {
        return teamService.editTeam(editTeamInfoDto, id);
    }

    //현재 속한 팀 이름, 곡 이름, 프로필 사진, 팀장 여부, 진행중인 팀 이름, 곡 이름, 프로필 사진 조회
    @GetMapping("/info")
    public ResponseEntity<Response<ShortCurrentTeamInfoDto>> activeTeamsInfo(@RequestParam(required = true) Long teamId, @RequestParam(required = true) Long userId) {
        return teamService.getActiveTeamsShort(teamId, userId);
    }

    //팀 초대 링크 생성
    @GetMapping("/{id}")
    public ResponseEntity<Response<TeamLinkDto>> getTeamLink(@PathVariable Long id) {
        return teamService.getTeamLink(id);
    }

    //유저 강퇴
    @DeleteMapping("/{id}")
    public ResponseEntity<Response<TeamUserDto>> deleteTeamUser(@PathVariable Long id) {
        return teamService.deleteTeamUser(id);
    }

    //초대된 팀으로 이동
    @GetMapping("/invite/{UUID}")
    public ResponseEntity<Response<TeamIdDto>> redirectToTeam(@PathVariable String UUID, @RequestParam(required = true) String id) {
        return teamService.redirectToTeam(UUID, id);
    }

    //악보별 포지션 할당
    @PostMapping("/score-position")
    public ResponseEntity<Response<ScorePositionDto>> scorePositionMapping(@ModelAttribute ScorePositionDto scorePositionDto) {
        return teamService.scorePositionMapping(scorePositionDto);
    }

    //색상 조회
    @GetMapping("/color")
    public ResponseEntity<Response<List<ColorDto>>> getColorList() {
        return teamService.getColorList();
    }

    //포지션 조회
    @GetMapping("/position")
    public ResponseEntity<Response<List<PositionDto>>> getPositionList(@RequestParam(required = true) Long id) {
        return teamService.getPositionList(id);
    }

    //커스텀 포지션 생성
    @PostMapping("/position")
    public ResponseEntity<Response<CustomPositionDto>> addCustomPosition(@ModelAttribute CustomPositionDto customPositionDto) {
        return teamService.addCustomPosition(customPositionDto);
    }

    //진행중인 팀목록 조회
    @GetMapping("/active/{id}")
    public ResponseEntity<Response<List<LongTeamInfoDto>>> getActiveTeams(@PathVariable Long id) {
        return teamService.getActiveTeams(id);
    }

    //전체 팀목록 조회
    @GetMapping("/total/{id}")
    public ResponseEntity<Response<List<LongTeamInfoDto>>> getAllTeams(@PathVariable Long id) {
        return teamService.getAllTeams(id);
    }

    //팀의 맴버들 이름, 방장여부, 프로필 조회 - 구현중
    @GetMapping("/members/{id}")
    public ResponseEntity<Response<List<MemberInfoDto>>> getTeamMembersInfo(@PathVariable Long id) {
        return teamService.getTeamMembersInfo(id);
    }

}