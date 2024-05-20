package com.ssafy.weSync.invitation.service;

import com.ssafy.weSync.global.ApiResponse.*;
import com.ssafy.weSync.invitation.dto.*;

import com.ssafy.weSync.invitation.entity.Invitation;
import com.ssafy.weSync.invitation.repository.InvitationRepository;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.team.repository.*;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import com.ssafy.weSync.teamUser.repository.TeamUserRepository;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class InvitationService {

    private final TeamRepository teamRepository;
    private final InvitationRepository invitationRepository;
    private final TeamUserRepository teamUserRepository;
    private final UserRepository userRepository;

    private final AccessTokenValidationAspect accessTokenValidationAspect;

    //팀에 속해있는지 확인
    public Boolean checkAuthorized(Long teamId, Long userId){

        if(teamRepository.findByTeamId(teamId).isEmpty() ||
                teamRepository.findByTeamId(teamId).get().isDeleted()){
            throw new GlobalException(CustomError.NO_TEAM);
        }

        Team currentTeam = teamRepository.findByTeamId(teamId).get();

        List<TeamUser> currentTeamUsers = currentTeam.getTeamUsers();

        return currentTeamUsers.stream()
                .filter(teamUser -> !teamUser.getIsBanned())
                .anyMatch(teamUser -> Objects.equals(teamUser.getUser().getUserId(), userId));
    }

    //팀 링크 생성
    public ResponseEntity<Response<TeamLinkDto>> getTeamLink(Long id){

        Long userId = accessTokenValidationAspect.getUserId();

        if(!checkAuthorized(id, userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        UUID uuid = UUID.randomUUID();
        String randomLink = "https://wesync.co.kr/api/team/invite/" + uuid;
        String sendLink = "https://wesync.co.kr/invite/" + uuid;

        //팀 링크 등록
        Invitation newInvitation = new Invitation();
        newInvitation.setLink(randomLink);
        if(teamRepository.findByTeamId(id).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
        }
        newInvitation.setTeam(teamRepository.findByTeamId(id).get());
        newInvitation.setIsValid(true);
        invitationRepository.save(newInvitation);

        //응답
        TeamLinkDto teamLinkDto = new TeamLinkDto(sendLink);
        return ResponseFactory.success(teamLinkDto);
    }

    //팀 링크 접속
    public ResponseEntity<Response<TeamIdDto>>redirectToTeam(String UUID){
        Long id = accessTokenValidationAspect.getUserId();
        String link = "https://wesync.co.kr/api/team/invite/" + UUID;

        if(invitationRepository.findByLink(link).isEmpty() ||
                !invitationRepository.findByLink(link).get().getIsValid()){
            throw new GlobalException(CustomError.NO_TEAM);
        }

        Invitation invitation = invitationRepository.findByLink(link).get();

        LocalDateTime createdAt = invitation.getCreatedAt();
        LocalDateTime now = LocalDateTime.now();

        long daysDifference = ChronoUnit.DAYS.between(createdAt.toLocalDate(), now.toLocalDate());
        if (daysDifference >= 8) {
            throw new GlobalException(CustomError.EXPIRED_INVITATION);
        }

        //이미 존재하는 회원인지 확인
        List<TeamUser> teamUserList = teamUserRepository.findByUser(userRepository.findByUserId(id).get());
        Long linkTeamId = invitation.getTeam().getTeamId();
        boolean isAlreadyExist = teamUserList.stream()
                .anyMatch(teamUser -> Objects.equals(teamUser.getTeam().getTeamId(), linkTeamId));

        if(isAlreadyExist){
            throw new GlobalException(CustomError.DUPLICATE_USER);
        }

        //팀원 추가
        TeamUser newTeamUser = new TeamUser();
        if(userRepository.findByUserId(id).isEmpty()){
            throw new GlobalException(CustomError.NO_USER);
        }
        if(teamRepository.findByTeamId(invitation.getTeam().getTeamId()).isEmpty() ||
                teamRepository.findByTeamId(invitation.getTeam().getTeamId()).get().isDeleted()){
            throw new GlobalException(CustomError.NO_TEAM);
        }
        newTeamUser.setUser(userRepository.findByUserId(id).get());
        newTeamUser.setTeam(teamRepository.findByTeamId(invitation.getTeam().getTeamId()).get());
        newTeamUser.setIsBanned(false);
        teamUserRepository.save(newTeamUser);

        //응답
        TeamIdDto teamIdDto = new TeamIdDto(invitation.getTeam().getTeamId());
        return ResponseFactory.success(teamIdDto);
    }

}