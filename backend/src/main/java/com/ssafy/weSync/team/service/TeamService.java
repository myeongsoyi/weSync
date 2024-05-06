package com.ssafy.weSync.team.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.ssafy.weSync.global.ApiResponse.ErrorResponse;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.team.dto.request.CreateTeamInfoDto;
import com.ssafy.weSync.team.dto.response.TeamIdDto;
import com.ssafy.weSync.team.dto.response.TeamInfoDto;
import com.ssafy.weSync.team.dto.response.TeamLinkDto;
import com.ssafy.weSync.team.dto.response.TeamUserDto;
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
        Optional<TeamUser> existUser = teamUserRepository.findByUser(userRepository.findByUserId(Long.parseLong(id)).get());

        if(invitation.getIsValid() && existUser.isEmpty()){
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
    public ResponseEntity<Response<TeamInfoDto>>getActiveTeams() { //아직 미구현
        HttpHeaders responseHeaders = new HttpHeaders();
        Response<TeamInfoDto> responseBody = new Response<>();
        TeamInfoDto teamInfoDto = new TeamInfoDto();
        responseBody.setSuccess(true);
        responseBody.setData(teamInfoDto);
        responseBody.setError(null);
        return new ResponseEntity<>(responseBody,responseHeaders,HttpStatus.valueOf(200));
    }
}