package com.ssafy.weSync.teamUser.service;

import com.ssafy.weSync.global.ApiResponse.*;
import com.ssafy.weSync.global.entity.Expunger;
import com.ssafy.weSync.position.repository.PositionRepository;
import com.ssafy.weSync.invitation.entity.Invitation;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.invitation.repository.InvitationRepository;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.teamUser.dto.*;
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
public class TeamUserService {

    private final TeamRepository teamRepository;
    private final InvitationRepository invitationRepository;
    private final TeamUserRepository teamUserRepository;
    private final UserRepository userRepository;
    private final PositionRepository positionRepository;

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

    //팀원 강퇴(방장만 가능)
    public ResponseEntity<Response<TeamUserDto>> deleteTeamUser(Long id){

        Long userId = accessTokenValidationAspect.getUserId();

        Optional<TeamUser> deleteUser = teamUserRepository.findByTeamUserId(id);

        if(deleteUser.isEmpty() || deleteUser.get().getIsBanned()){
            throw new GlobalException(CustomError.NO_TEAMUSER);
        }

        if(!Objects.equals(deleteUser.get().getTeam().getTeamLeaderId(), userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        if(Objects.equals(deleteUser.get().getUser().getUserId(), userId)){
            throw new GlobalException(CustomError.CANNOT_BAN_YOURSELF);
        }

        //강퇴
        deleteUser.get().setIsBanned(true);
        deleteUser.get().setDeleted(true);
        deleteUser.get().setDeletedBy(Expunger.normal);
        teamUserRepository.save(deleteUser.get());

        //응답
        TeamUserDto teamUserDto = new TeamUserDto(id);
        return ResponseFactory.success(teamUserDto);
    }

    //팀원 teamUserId, 이름, 리더 여부, 프로필, 포지션 존재 여부, 포지션 이름, 색깔 이름, 색깔 코드 조회
    public ResponseEntity<Response<List<LongMemberInfoDto>>> getTeamMembersInfo(Long id){
        Long userId = accessTokenValidationAspect.getUserId();

        if(teamRepository.findByTeamId(id).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
        }
        Team team = teamRepository.findByTeamId(id).get();

        if(!checkAuthorized(team.getTeamId(), userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        List<TeamUser> teamUserList = team.getTeamUsers();
        teamUserList.sort(Comparator.comparing(TeamUser::getTeamUserId));
        List<LongMemberInfoDto> memberInfoDtoList = new ArrayList<>();
        for(TeamUser member : teamUserList){
            if(member.getIsBanned()){
                continue;
            }
            LongMemberInfoDto memberInfoDto = new LongMemberInfoDto();
            memberInfoDto.setLeader(Objects.equals(team.getTeamLeaderId(), member.getUser().getUserId()));
            memberInfoDto.setTeamUserId(member.getTeamUserId());
            memberInfoDto.setNickName(member.getUser().getNickname());
            memberInfoDto.setLeader(Objects.equals(team.getTeamLeaderId(), member.getUser().getUserId()));
            memberInfoDto.setUserProfileUrl(member.getUser().getImgUrl());
            if(member.getPosition()!=null){
                memberInfoDto.setPositionExist(true);
                memberInfoDto.setPositionName(member.getPosition().getPositionName());
                memberInfoDto.setColorName(member.getPosition().getColor().getColorName());
                memberInfoDto.setColorCode(member.getPosition().getColor().getColorCode());
            }
            else{
                memberInfoDto.setPositionExist(false);
            }
            memberInfoDtoList.add(memberInfoDto);
        }
        return ResponseFactory.success(memberInfoDtoList);
    }

    //팀원 포지션 설정, 변경
    public ResponseEntity<Response<TeamUserPositionDto>> teamUserPositionMapping(TeamUserPositionDto teamUserPositionDto) {
        if(teamUserRepository.findByTeamUserId(teamUserPositionDto.getTeamUserId()).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAMUSER);
        }
        else if(positionRepository.findByPositionId(teamUserPositionDto.getPositionId()).isEmpty()){
            throw new GlobalException(CustomError.NO_POSITION);
        }

        TeamUser teamUser = teamUserRepository.findByTeamUserId(teamUserPositionDto.getTeamUserId()).get();
        if(!teamUser.getTeam().equals(positionRepository.findByPositionId(teamUserPositionDto.getPositionId()).get().getTeam())){
            throw new GlobalException(CustomError.POSITION_TEAMUSER_MISMATCH);
        }

        Long userId = accessTokenValidationAspect.getUserId();
        if(!checkAuthorized(teamUser.getTeam().getTeamId(), userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        teamUser.setPosition(positionRepository.findByPositionId(teamUserPositionDto.getPositionId()).get());
        teamUserRepository.save(teamUser);

        //응답
        return ResponseFactory.success(teamUserPositionDto);
    }

}