package com.ssafy.weSync.position.service;

import com.ssafy.weSync.color.repository.ColorRepository;
import com.ssafy.weSync.global.ApiResponse.*;
import com.ssafy.weSync.global.entity.Expunger;
import com.ssafy.weSync.position.dto.*;
import com.ssafy.weSync.position.dto.ScorePositionDto;

import com.ssafy.weSync.position.entity.Position;
import com.ssafy.weSync.position.repository.*;
import com.ssafy.weSync.score.entity.Score;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import com.ssafy.weSync.score.repository.ScoreRepository;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.teamUser.repository.TeamUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class PositionService {

    private final TeamRepository teamRepository;
    private final TeamUserRepository teamUserRepository;
    private final ColorRepository colorRepository;
    private final PositionRepository positionRepository;
    private final ScoreRepository scoreRepository;

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

    //악보별 포지션 할당
    public ResponseEntity<Response<ScorePositionDto>> scorePositionMapping(ScorePositionDto scorePositionDto){

        Long userId = accessTokenValidationAspect.getUserId();

        if(scoreRepository.findByScoreId(scorePositionDto.getScoreId()).isEmpty()){
            throw new GlobalException(CustomError.NO_SCORE);
        }
        else if(positionRepository.findByPositionId(scorePositionDto.getPositionId()).isEmpty()){
            throw new GlobalException(CustomError.NO_POSITION);
        }

        Score score = scoreRepository.findByScoreId(scorePositionDto.getScoreId()).get();

        Position position = positionRepository.findByPositionId(scorePositionDto.getPositionId()).get();

        if(!score.getTeam().equals(position.getTeam())){
            throw new GlobalException(CustomError.POSITION_SCORE_MISMATCH);
        }

        if(!checkAuthorized(score.getTeam().getTeamId(), userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        score.setPosition(positionRepository.findByPositionId(scorePositionDto.getPositionId()).get());
        scoreRepository.save(score);

        //응답
        return ResponseFactory.success(scorePositionDto);
    }

    //포지션 조회
    public ResponseEntity<Response<List<PositionDto>>> getPositionList(Long id){

        Long userId = accessTokenValidationAspect.getUserId();

        if(!checkAuthorized(id, userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        List<PositionDto> positionData = new ArrayList<>();
        if(teamRepository.findByTeamId(id).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
        }
        List<Position> positionList = positionRepository.findByTeam(teamRepository.findByTeamId(id).get());

        for(Position position : positionList){
            PositionDto positionDto = new PositionDto();
            positionDto.setPositionId(position.getPositionId());
            positionDto.setPositionName(position.getPositionName());
            positionDto.setColorId(position.getColor().getColorId());
            positionDto.setColorCode(position.getColor().getColorCode());
            positionData.add(positionDto);
        }

        //응답
        return ResponseFactory.success(positionData);
    }

    //커스텀 포지션 생성
    public ResponseEntity<Response<PositionDto>> addCustomPosition(CustomPositionDto customPositionDto){
        Long userId = accessTokenValidationAspect.getUserId();
        if(teamRepository.findByTeamId(customPositionDto.getTeamId()).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
        }

        if(!checkAuthorized(customPositionDto.getTeamId(), userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        //중복체크
        List<Position> positionList = positionRepository.findByTeam(teamRepository.findByTeamId(customPositionDto.getTeamId()).get());
        String newPositionName = customPositionDto.getPositionName();
        boolean isDuplicate = false;
        for(Position position : positionList){
            if(newPositionName.equals(position.getPositionName())){
                isDuplicate = true;
                break;
            }
        }
        if(isDuplicate){
            throw new GlobalException(CustomError.DUPLICATE_POSITION);
        }
        //등록
        Position newPosition = new Position();
        newPosition.setPositionName(customPositionDto.getPositionName());
        newPosition.setTeam(teamRepository.findByTeamId(customPositionDto.getTeamId()).get());
        if(colorRepository.findByColorId(customPositionDto.getColorId()).isEmpty()){
            throw new GlobalException(CustomError.POSITION_COLOR_NOT_FOUND);
        }
        newPosition.setColor(colorRepository.findByColorId(customPositionDto.getColorId()).get());
        Long newPositionId = positionRepository.save(newPosition).getPositionId();

        //응답
        PositionDto positionDto = new PositionDto(newPositionId, customPositionDto.getPositionName(), customPositionDto.getColorId(), colorRepository.findByColorId(customPositionDto.getColorId()).get().getColorCode());
        return ResponseFactory.success(positionDto);
    }

    //포지션 수정
    public ResponseEntity<Response<PositionDto>> editCustomPosition(PositionDto positionDto){
        Long userId = accessTokenValidationAspect.getUserId();

        if(positionDto.getPositionId()==null ||
                positionDto.getPositionName()==null ||
                positionRepository.findByPositionId(positionDto.getPositionId()).isEmpty()){
            throw new GlobalException(CustomError.NO_POSITION);
        }

        Long teamId = positionRepository.findByPositionId(positionDto.getPositionId()).get().getTeam().getTeamId();

        if(!checkAuthorized(teamId, userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        if(teamRepository.findByTeamId(teamId).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
        }

        //중복 확인
        String newPositionName = positionDto.getPositionName();
        Long positionId = positionDto.getPositionId();

        boolean isDuplicate = positionRepository.findByTeam(teamRepository.findByTeamId(teamId).get()).stream()
                .anyMatch(position -> newPositionName.equals(position.getPositionName()) &&
                        !Objects.equals(position.getPositionId(), positionId));
        if (isDuplicate) {
            throw new GlobalException(CustomError.DUPLICATE_POSITION);
        }

        if(positionDto.getColorId()==null ||
                colorRepository.findByColorId(positionDto.getColorId()).isEmpty()){
            throw new GlobalException(CustomError.POSITION_COLOR_NOT_FOUND);
        }

        Position editPosition = positionRepository.findByPositionId(positionDto.getPositionId()).get();

        editPosition.setPositionId(positionDto.getPositionId());
        editPosition.setPositionName(positionDto.getPositionName());
        editPosition.setColor(colorRepository.findByColorId(positionDto.getColorId()).get());

        positionRepository.save(editPosition);

        //응답
        positionDto.setColorCode(colorRepository.findByColorId(positionDto.getColorId()).get().getColorCode());
        return ResponseFactory.success(positionDto);
    }

    //포지션 삭제
    public ResponseEntity<Response<PositionDto>> deleteCustomPosition(PositionDto positionDto){
        Long userId = accessTokenValidationAspect.getUserId();
        if(positionDto.getPositionId()==null ||
                positionRepository.findByPositionId(positionDto.getPositionId()).isEmpty()){
            throw new GlobalException(CustomError.NO_POSITION);
        }

        Long teamId = positionRepository.findByPositionId(positionDto.getPositionId()).get().getTeam().getTeamId();

        if(!checkAuthorized(teamId, userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        Position deletePosition = positionRepository.findByPositionId(positionDto.getPositionId()).get();

        deletePosition.setDeleted(true);
        deletePosition.setDeletedBy(Expunger.normal);

        positionRepository.save(deletePosition);

        List<TeamUser> teamUserList = teamUserRepository.findByPosition(deletePosition);
        for(TeamUser teamUser:teamUserList){
            teamUser.setPosition(null);
        }

        List<Score> scoreList = scoreRepository.findByPosition(deletePosition);
        for(Score score : scoreList){
            score.setPosition(null);
        }

        //응답
        positionDto.setPositionName(deletePosition.getPositionName());
        positionDto.setColorId(deletePosition.getColor().getColorId());
        positionDto.setColorCode(deletePosition.getColor().getColorCode());
        return ResponseFactory.success(positionDto);
    }

}