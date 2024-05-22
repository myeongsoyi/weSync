package com.ssafy.weSync.invitation.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.invitation.entity.Invitation;
import com.ssafy.weSync.invitation.service.InvitationService;
import com.ssafy.weSync.invitation.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/team")
public class InvitationController {

    @Autowired
    private InvitationService invitationService;

    //팀 초대 링크 생성
    @GetMapping("/{id}")
    public ResponseEntity<Response<TeamLinkDto>> getTeamLink(@PathVariable Long id) {
        return invitationService.getTeamLink(id);
    }

    //초대된 팀으로 이동
    @GetMapping("/invite/{UUID}")
    public ResponseEntity<Response<TeamIdDto>> redirectToTeam(@PathVariable String UUID) {
        return invitationService.redirectToTeam(UUID);
    }

}