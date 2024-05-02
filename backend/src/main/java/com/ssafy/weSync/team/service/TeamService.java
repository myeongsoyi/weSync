package com.ssafy.weSync.team.service;

import com.ssafy.weSync.global.ApiResponse.ErrorResponse;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.team.dto.response.TeamIdDto;
import com.ssafy.weSync.team.dto.response.TeamLinkDto;
import com.ssafy.weSync.team.dto.response.TeamUserDto;
import com.ssafy.weSync.team.entity.Invitation;
import com.ssafy.weSync.team.entity.TeamUser;
import com.ssafy.weSync.team.repository.InvitationRepository;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.team.repository.TeamUserRepository;
import com.ssafy.weSync.user.dto.LoginDto;
import com.ssafy.weSync.user.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;
    private final InvitationRepository invitationRepository;
    private final TeamUserRepository teamUserRepository;

    public TeamService(TeamRepository teamRepository, InvitationRepository invitationRepository, TeamUserRepository teamUserRepository) {
        this.teamRepository = teamRepository;
        this.invitationRepository = invitationRepository;
        this.teamUserRepository = teamUserRepository;
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

    //팀원 강퇴
    public ResponseEntity<Response<TeamUserDto>> deleteTeamUser(Long id){
        Optional<TeamUser> deleteUser = teamUserRepository.findByTeamUserId(id);
        Response<TeamUserDto> responseBody = new Response<>();
        HttpHeaders responseHeaders = new HttpHeaders();

        if(deleteUser.isPresent() && !deleteUser.get().getIsBanned()){
            deleteUser.get().setIsBanned(true);
            teamUserRepository.save(deleteUser.get());
            TeamUserDto teamUserDto = new TeamUserDto(id);
            responseBody.setSuccess(true);
            responseBody.setData(teamUserDto);
            responseBody.setError(null);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
        }
        else{
            responseBody.setSuccess(false);
            responseBody.setData(null);
            ErrorResponse responseError = new ErrorResponse("400", "강퇴할 대상이 존재하지 않습니다.");
            responseBody.setError(responseError);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
        }
    }

    public ResponseEntity<Response<TeamIdDto>>redirectToTeam(String UUID){
        String link = "http://localhost:8080/api/team/invite/" + UUID;
        Invitation invitation = invitationRepository.findByLink(link).get();
        HttpHeaders responseHeaders = new HttpHeaders();
        Response<TeamIdDto> responseBody = new Response<>();
        if(invitation.getIsValid()){
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