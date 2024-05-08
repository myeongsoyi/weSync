package com.ssafy.weSync.team.service;

import com.ssafy.weSync.global.ApiResponse.ErrorResponse;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.s3.service.S3Service;
import com.ssafy.weSync.team.dto.response.TeamIdDto;
import com.ssafy.weSync.team.dto.response.TeamLinkDto;
import com.ssafy.weSync.team.entity.Invitation;
import com.ssafy.weSync.team.repository.InvitationRepository;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.user.dto.LoginDto;
import com.ssafy.weSync.user.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;
    private final InvitationRepository invitationRepository;

    public TeamService(TeamRepository teamRepository, InvitationRepository invitationRepository) {
        this.teamRepository = teamRepository;
        this.invitationRepository = invitationRepository;
    }

    public ResponseEntity<Response<TeamLinkDto>> getTeamLink(Long id){
        UUID uuid = UUID.randomUUID();
        String randomLink = "http://localhost:8080/api/team/invite/" + uuid.toString();
        Invitation newInvitation = new Invitation();
        newInvitation.setLink(randomLink);
        newInvitation.setTeam(teamRepository.findByTeamId(id).get());
        newInvitation.setIsValid(true);

        invitationRepository.save(newInvitation);

        TeamLinkDto teamLinkDto = new TeamLinkDto(randomLink);
        Response<TeamLinkDto> responseBody = new Response<>(true, teamLinkDto, null);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
    }

    public ResponseEntity<Response<TeamIdDto>>redirectToTeam(String UUID){
        String link = "http://localhost:8080/api/team/invite/" + UUID;
        Invitation invitation = invitationRepository.findByLink(link).get();
        HttpHeaders responseHeaders = new HttpHeaders();
        Response<TeamIdDto> responseBody = new Response<>();
        if(invitation.getIsValid()){
//            System.out.println(invitation.getTeam().getTeamId());
            TeamIdDto teamIdDto = new TeamIdDto(invitation.getTeam().getTeamId());
            responseBody.setSuccess(true);
            responseBody.setData(teamIdDto);
            responseBody.setError(null);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
        }
        else{
            ErrorResponse responseError = new ErrorResponse("400", "잘못된 요청입니다.");
            responseBody.setSuccess(false);
            responseBody.setError(responseError);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
        }
    }

}