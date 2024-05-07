package com.ssafy.weSync.team.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.ssafy.weSync.global.ApiResponse.ErrorResponse;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.team.dto.request.CreateTeamInfoDto;
import com.ssafy.weSync.team.dto.request.EditTeamInfoDto;
import com.ssafy.weSync.team.dto.response.*;
import com.ssafy.weSync.team.entity.Invitation;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.team.entity.TeamUser;
import com.ssafy.weSync.team.repository.InvitationRepository;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.team.repository.TeamUserRepository;
import com.ssafy.weSync.s3.service.S3Service;
import com.ssafy.weSync.user.entity.User;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;
    private final InvitationRepository invitationRepository;
    private final TeamUserRepository teamUserRepository;
    private final AmazonS3Client amazonS3Client;
    private  final UserRepository userRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public TeamService(TeamRepository teamRepository, InvitationRepository invitationRepository, TeamUserRepository teamUserRepository, AmazonS3Client amazonS3Client, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.invitationRepository = invitationRepository;
        this.teamUserRepository = teamUserRepository;
        this.amazonS3Client = amazonS3Client;
        this.userRepository = userRepository;
    }

    //팀 생성
    public ResponseEntity<Response<TeamIdDto>> createTeam(CreateTeamInfoDto createTeamInfoDto) throws IOException {
        if (createTeamInfoDto == null || createTeamInfoDto.getTeamProfile() == null) {
            //에러
            HttpHeaders responseHeaders = new HttpHeaders();
            Response<TeamIdDto> responseBody = new Response<>();
            responseBody.setSuccess(false);
            responseBody.setData(null);
            ErrorResponse responseError = new ErrorResponse("400", "잘못된 요청입니다.");
            responseBody.setError(responseError);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
        }
        else {
            S3Service s3Service = new S3Service(amazonS3Client, bucket);
            String teamProfileUrl = s3Service.upload(createTeamInfoDto.getTeamProfile(),"teamProfile");

            //팀 등록
            Team newTeam = new Team();
            newTeam.setTeamLeaderId(createTeamInfoDto.getUserId());
            newTeam.setTeamName(createTeamInfoDto.getTeamName());
            newTeam.setSongName(createTeamInfoDto.getSongName());
            newTeam.setProfileUrl(teamProfileUrl);
            newTeam.setIsFinished(false);
            teamRepository.save(newTeam);
            Long newTeamId = teamRepository.findByProfileUrl(teamProfileUrl).get().getTeamId();

            //팀원 등록(본인)
            TeamUser newTeamUser = new TeamUser();
            newTeamUser.setUser(userRepository.findByUserId(createTeamInfoDto.getUserId()).get());
            newTeamUser.setTeam(teamRepository.findByTeamId(newTeamId).get());
            newTeamUser.setIsBanned(false);
            teamUserRepository.save(newTeamUser);

            //응답
            HttpHeaders responseHeaders = new HttpHeaders();
            Response<TeamIdDto> responseBody = new Response<>();
            TeamIdDto teamIdDto = new TeamIdDto();
            teamIdDto.setTeamId(newTeamId);
            responseBody.setSuccess(true);
            responseBody.setData(teamIdDto);
            responseBody.setError(null);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
        }
    }

    //팀 정보 수정
    public ResponseEntity<Response<TeamIdDto>> editTeam(EditTeamInfoDto editTeamInfoDto, Long id) throws IOException {
        if (editTeamInfoDto == null || editTeamInfoDto.getTeamProfile() == null) {
            //에러
            HttpHeaders responseHeaders = new HttpHeaders();
            Response<TeamIdDto> responseBody = new Response<>();
            responseBody.setSuccess(false);
            responseBody.setData(null);
            ErrorResponse responseError = new ErrorResponse("400", "잘못된 요청입니다.");
            responseBody.setError(responseError);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
        }
        else {
            S3Service s3Service = new S3Service(amazonS3Client, bucket);
            String editTeamProfileUrl = s3Service.upload(editTeamInfoDto.getTeamProfile(),"teamProfile");

            //팀 등록
            Team editTeam = teamRepository.findByTeamId(id).get();
            editTeam.setTeamName(editTeamInfoDto.getTeamName());
            editTeam.setSongName(editTeamInfoDto.getSongName());
            String beforeUrl = editTeam.getProfileUrl();
            //이전 프로필 데이터 삭제
            if(beforeUrl!=null){
                int startIndex = beforeUrl.indexOf("teamProfile/");
                String beforeParsingKey = beforeUrl.substring(startIndex);
                String parsing = beforeParsingKey.replaceAll("%20", " ");
                String parsedKey = parsing.replaceAll("%3A", ":");
                s3Service.deleteS3Object(parsedKey);
                System.out.println(parsedKey);
            }
            editTeam.setProfileUrl(editTeamProfileUrl);
            editTeam.setIsFinished(editTeamInfoDto.getIsFinished());
            teamRepository.save(editTeam);

            //응답
            HttpHeaders responseHeaders = new HttpHeaders();
            Response<TeamIdDto> responseBody = new Response<>();
            TeamIdDto teamIdDto = new TeamIdDto();
            teamIdDto.setTeamId(id);
            responseBody.setSuccess(true);
            responseBody.setData(teamIdDto);
            responseBody.setError(null);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
        }
    }

    //현재 속한 팀 이름, 곡 이름, 프로필 사진, 팀장 여부, 진행중인 팀 이름, 곡 이름, 프로필 사진 조회
    public ResponseEntity<Response<ShortCurrentTeamInfoDto>> getActiveTeamsShort(Long teamId, Long userId){
        Team currentTeam = teamRepository.findByTeamId(teamId).get();

        //응답
        ShortCurrentTeamInfoDto shortCurrentTeamInfoDto = new ShortCurrentTeamInfoDto();
        shortCurrentTeamInfoDto.setTeamId(teamId);
        shortCurrentTeamInfoDto.setTeamName(currentTeam.getTeamName());
        if(currentTeam.getSongName()!=null){
            shortCurrentTeamInfoDto.setSongNameExist(true);
            shortCurrentTeamInfoDto.setSongName(currentTeam.getSongName());
        }
        else{
            shortCurrentTeamInfoDto.setSongNameExist(false);
        }
        shortCurrentTeamInfoDto.setTeamProfileUrl(currentTeam.getProfileUrl());
        if(currentTeam.getTeamLeaderId()==userId){
            shortCurrentTeamInfoDto.setTeamLeader(true);
        }
        else{
            shortCurrentTeamInfoDto.setTeamLeader(false);
        }
        List<ShortActiveTeamInfoDto> shortActiveTeamInfoDtoList = new ArrayList<>();
        List<TeamUser> teamUserList = teamUserRepository.findByUser(userRepository.findByUserId(userId).get());
        for(TeamUser teamUser : teamUserList){
            Team team = teamUser.getTeam();
            if(!team.getIsFinished()){
                ShortActiveTeamInfoDto shortActiveTeamInfoDto = new ShortActiveTeamInfoDto();
                shortActiveTeamInfoDto.setTeamId(team.getTeamId());
                if(team.getSongName()!=null){
                    shortActiveTeamInfoDto.setSongNameExist(true);
                    shortActiveTeamInfoDto.setSongName(team.getSongName());
                }
                else{
                    shortActiveTeamInfoDto.setSongNameExist(false);
                }
                shortActiveTeamInfoDto.setTeamProfileUrl(team.getProfileUrl());
                shortActiveTeamInfoDtoList.add(shortActiveTeamInfoDto);
            }
        }
        shortCurrentTeamInfoDto.setActiveTeams(shortActiveTeamInfoDtoList);

        Response<ShortCurrentTeamInfoDto> responseBody = new Response<>(true, shortCurrentTeamInfoDto, null);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
    }

    //팀 링크 생성
    public ResponseEntity<Response<TeamLinkDto>> getTeamLink(Long id){
        UUID uuid = UUID.randomUUID();
        String randomLink = "http://localhost:8080/api/team/invite/" + uuid.toString();

        //팀 링크 등록
        Invitation newInvitation = new Invitation();
        newInvitation.setLink(randomLink);
        newInvitation.setTeam(teamRepository.findByTeamId(id).get());
        newInvitation.setIsValid(true);
        invitationRepository.save(newInvitation);

        //응답
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
            //강퇴
            deleteUser.get().setIsBanned(true);
            teamUserRepository.save(deleteUser.get());

            //응답
            TeamUserDto teamUserDto = new TeamUserDto(id);
            responseBody.setSuccess(true);
            responseBody.setData(teamUserDto);
            responseBody.setError(null);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
        }
        else{
            //에러
            responseBody.setSuccess(false);
            responseBody.setData(null);
            ErrorResponse responseError = new ErrorResponse("400", "강퇴할 대상이 존재하지 않습니다.");
            responseBody.setError(responseError);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
        }
    }

    //팀 링크 접속
    public ResponseEntity<Response<TeamIdDto>>redirectToTeam(String UUID, String id){
        String link = "http://localhost:8080/api/team/invite/" + UUID;
        Invitation invitation = invitationRepository.findByLink(link).get();
        HttpHeaders responseHeaders = new HttpHeaders();
        Response<TeamIdDto> responseBody = new Response<>();

        //이미 존재하는 회원인지 확인
        List<TeamUser> teamUserList = teamUserRepository.findByUser(userRepository.findByUserId(Long.parseLong(id)).get());
        Long linkTeamId = invitation.getTeam().getTeamId();
        boolean isAlreadyExist = false;
        for(TeamUser teamUser : teamUserList){
            if(teamUser.getTeam().getTeamId()==linkTeamId){
                isAlreadyExist = true;
                break;
            }
        }

        if(invitation.getIsValid() && !isAlreadyExist){
            //팀원 추가
            TeamUser newTeamUser = new TeamUser();
            newTeamUser.setUser(userRepository.findByUserId(Long.parseLong(id)).get());
            newTeamUser.setTeam(teamRepository.findByTeamId(invitation.getTeam().getTeamId()).get());
            newTeamUser.setIsBanned(false);
            teamUserRepository.save(newTeamUser);

            //응답
            TeamIdDto teamIdDto = new TeamIdDto(invitation.getTeam().getTeamId());
            responseBody.setSuccess(true);
            responseBody.setData(teamIdDto);
            responseBody.setError(null);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
        }
        else{
            //에러
            ErrorResponse responseError = new ErrorResponse("400", "잘못된 요청입니다.");
            responseBody.setSuccess(false);
            responseBody.setError(responseError);
            return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(400));
        }
    }

    //활성화 된 팀목록
//    public ResponseEntity<Response<TeamInfoDto>>getActiveTeams(Long id) {
//        List<TeamUser> teamUserList = teamUserRepository.findByUser(userRepository.findByUserId(id).get());
//        LongTeamInfoDto longTeamInfoDto = new LongTeamInfoDto();
//        for(TeamUser teamUser : teamUserList){
//            Team team = teamUser.getTeam();
//
//        }
//        HttpHeaders responseHeaders = new HttpHeaders();
//        Response<LongTeamInfoDto> responseBody = new Response<>();
//        responseBody.setSuccess(true);
//        responseBody.setData(longTeamInfoDto);
//        responseBody.setError(null);
//        return new ResponseEntity<Response<TeamInfoDto>>(responseBody,responseHeaders,HttpStatus.valueOf(200));
//    }
}