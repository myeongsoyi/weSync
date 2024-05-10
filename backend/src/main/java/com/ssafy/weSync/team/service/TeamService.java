package com.ssafy.weSync.team.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.ssafy.weSync.global.ApiResponse.ErrorResponse;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.global.ApiResponse.ResponseFactory;
import com.ssafy.weSync.team.dto.request.*;
import com.ssafy.weSync.team.dto.response.*;
import com.ssafy.weSync.team.entity.*;
import com.ssafy.weSync.team.repository.*;
import com.ssafy.weSync.s3.service.S3Service;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;
    private final InvitationRepository invitationRepository;
    private final TeamUserRepository teamUserRepository;
    private final AmazonS3Client amazonS3Client;
    private  final UserRepository userRepository;
    private final ColorRepository colorRepository;
    private final PositionRepository positionRepository;
    private final ScoreRepository scoreRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private static final String[] DefaultPositionName = {"소프라노","메조소프라노", "알토", "바리톤", "테너", "베이스", "퍼커션"}; // 디폴트 포지션 이름
    private static final Long[] DefaultColorId = {1L,1L,1L,1L,1L,1L,1L}; // 디폴트 포지션별 colorId

    public TeamService(TeamRepository teamRepository, InvitationRepository invitationRepository, TeamUserRepository teamUserRepository, AmazonS3Client amazonS3Client, UserRepository userRepository, ColorRepository colorRepository, PositionRepository positionRepository, ScoreRepository scoreRepository) {
        this.teamRepository = teamRepository;
        this.invitationRepository = invitationRepository;
        this.teamUserRepository = teamUserRepository;
        this.amazonS3Client = amazonS3Client;
        this.userRepository = userRepository;
        this.colorRepository = colorRepository;
        this.positionRepository = positionRepository;
        this.scoreRepository = scoreRepository;
    }

    //팀 생성
    public ResponseEntity<Response<TeamIdDto>> createTeam(CreateTeamInfoDto createTeamInfoDto) throws IOException {

        if (createTeamInfoDto == null ||
                createTeamInfoDto.getUserId() == null ||
                createTeamInfoDto.getTeamName() == null) {
            return ResponseFactory.fail("에러(팀 생성): 입력한 정보가 부족합니다");
        }

        //팀 등록
        Team newTeam = new Team();
        newTeam.setTeamLeaderId(createTeamInfoDto.getUserId());
        newTeam.setTeamName(createTeamInfoDto.getTeamName());
        newTeam.setSongName(createTeamInfoDto.getSongName());
        if(createTeamInfoDto.getTeamProfile()!=null){
            S3Service s3Service = new S3Service(amazonS3Client, bucket);
            String teamProfileUrl = s3Service.upload(createTeamInfoDto.getTeamProfile(),"teamProfile");
            newTeam.setProfileUrl(teamProfileUrl);
        }
        newTeam.setIsFinished(false);
        Long newTeamId = teamRepository.save(newTeam).getTeamId();

        //팀원 등록(본인)
        TeamUser newTeamUser = new TeamUser();
        if(userRepository.findByUserId(createTeamInfoDto.getUserId()).isEmpty() ||
                teamRepository.findByTeamId(newTeamId).isEmpty()){
            return ResponseFactory.fail("에러(팀 생성): 서버 db 오류");
        }
        newTeamUser.setUser(userRepository.findByUserId(createTeamInfoDto.getUserId()).get());
        newTeamUser.setTeam(teamRepository.findByTeamId(newTeamId).get());
        newTeamUser.setIsBanned(false);
        teamUserRepository.save(newTeamUser);

        //응답
        TeamIdDto teamIdDto = new TeamIdDto();
        teamIdDto.setTeamId(newTeamId);
        return ResponseFactory.success(teamIdDto);
    }

    //팀 정보 수정
    public ResponseEntity<Response<TeamIdDto>> editTeam(EditTeamInfoDto editTeamInfoDto, Long id) throws IOException {

        if (editTeamInfoDto == null ||
                editTeamInfoDto.getTeamName() == null ||
                editTeamInfoDto.getIsFinished() == null ||
                editTeamInfoDto.getTeamProfile() == null) {
            return ResponseFactory.fail("에러(팀 정보 수정): 입력한 정보가 부족합니다");
        }
        else {
            S3Service s3Service = new S3Service(amazonS3Client, bucket);
            String editTeamProfileUrl = s3Service.upload(editTeamInfoDto.getTeamProfile(),"teamProfile");

            //팀 등록
            if(teamRepository.findByTeamId(id).isEmpty()){
                return ResponseFactory.fail("에러(팀 정보 수정): 조회한 팀은 존재하지 않습니다");
            }
            Team editTeam = teamRepository.findByTeamId(id).get();
            editTeam.setTeamName(editTeamInfoDto.getTeamName());
            editTeam.setSongName(editTeamInfoDto.getSongName());
            String beforeUrl = editTeam.getProfileUrl();

            //이전 프로필 S3 데이터 삭제
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

            //을답
            TeamIdDto teamIdDto = new TeamIdDto();
            teamIdDto.setTeamId(id);
            return ResponseFactory.success(teamIdDto);
        }
    }

    //현재 속한 팀 이름, 곡 이름, 프로필 사진, 팀장 여부, 진행중인 팀 이름, 곡 이름, 프로필 사진 조회
    public ResponseEntity<Response<ShortCurrentTeamInfoDto>> getActiveTeamsShort(Long teamId, Long userId){
        if(teamRepository.findByTeamId(teamId).isEmpty() ||
                teamRepository.findByTeamId(teamId).get().isDeleted()){
            return ResponseFactory.fail("에러(getActiveTeamsShort): 조회한 팀은 존재하지 않습니다");
        }
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
        shortCurrentTeamInfoDto.setTeamLeader(Objects.equals(currentTeam.getTeamLeaderId(), userId));
        List<ShortActiveTeamInfoDto> shortActiveTeamInfoDtoList = new ArrayList<>();
        if(userRepository.findByUserId(userId).isEmpty()){
            return ResponseFactory.fail("에러(getActiveTeamsShort): 조회한 유저는 존재하지 않습니다");
        }
        List<TeamUser> teamUserList = teamUserRepository.findByUser(userRepository.findByUserId(userId).get());
        for(TeamUser teamUser : teamUserList){
            Team team = teamUser.getTeam();
            if(!team.getIsFinished() && !team.isDeleted()){
                ShortActiveTeamInfoDto shortActiveTeamInfoDto = new ShortActiveTeamInfoDto();
                shortActiveTeamInfoDto.setTeamId(team.getTeamId());
                shortActiveTeamInfoDto.setTeamName(team.getTeamName());
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

        return ResponseFactory.success(shortCurrentTeamInfoDto);
    }

    //팀 링크 생성
    public ResponseEntity<Response<TeamLinkDto>> getTeamLink(Long id){
        UUID uuid = UUID.randomUUID();
        String randomLink = "http://localhost:8080/api/team/invite/" + uuid;

        //팀 링크 등록
        Invitation newInvitation = new Invitation();
        newInvitation.setLink(randomLink);
        if(teamRepository.findByTeamId(id).isEmpty()){
            return ResponseFactory.fail("에러(팀 링크 생성): 조회한 팀이 존재하지 않습니다");
        }
        newInvitation.setTeam(teamRepository.findByTeamId(id).get());
        newInvitation.setIsValid(true);
        invitationRepository.save(newInvitation);

        //응답
        TeamLinkDto teamLinkDto = new TeamLinkDto(randomLink);
        return ResponseFactory.success(teamLinkDto);
    }

    //팀원 강퇴
    public ResponseEntity<Response<TeamUserDto>> deleteTeamUser(Long id){
        Optional<TeamUser> deleteUser = teamUserRepository.findByTeamUserId(id);

        if(deleteUser.isPresent() && !deleteUser.get().getIsBanned()){
            //강퇴
            deleteUser.get().setIsBanned(true);
            teamUserRepository.save(deleteUser.get());

            //응답
            TeamUserDto teamUserDto = new TeamUserDto(id);
            return ResponseFactory.success(teamUserDto);
        }
        else{
            return ResponseFactory.fail("에러(팀 링크 생성): 강퇴할 대상이 존재하지 않습니다.");
        }
    }

    //팀 링크 접속
    public ResponseEntity<Response<TeamIdDto>>redirectToTeam(String UUID, String id){
        String link = "http://localhost:8080/api/team/invite/" + UUID;

        if(invitationRepository.findByLink(link).isEmpty() ||
                !invitationRepository.findByLink(link).get().getIsValid()){
            return ResponseFactory.fail("에러(팀 링크 접속): 헤딩 링크로 접속가능한 팀이 존재하지 않습니다");
        }

        Invitation invitation = invitationRepository.findByLink(link).get();

        //이미 존재하는 회원인지 확인
        List<TeamUser> teamUserList = teamUserRepository.findByUser(userRepository.findByUserId(Long.parseLong(id)).get());
        Long linkTeamId = invitation.getTeam().getTeamId();
        boolean isAlreadyExist = teamUserList.stream()
                .anyMatch(teamUser -> Objects.equals(teamUser.getTeam().getTeamId(), linkTeamId));

        if(isAlreadyExist){
            return ResponseFactory.fail("에러(팀 링크 접속): 이미 속해있는 회원입니다");
        }

        //팀원 추가
        TeamUser newTeamUser = new TeamUser();
        if(userRepository.findByUserId(Long.parseLong(id)).isEmpty()){
            return ResponseFactory.fail("에러(팀 링크 접속): 입력한 id에 해당하는 유저가 존재하지 않습니다");
        }
        if(teamRepository.findByTeamId(invitation.getTeam().getTeamId()).isEmpty() ||
                teamRepository.findByTeamId(invitation.getTeam().getTeamId()).get().isDeleted()){
            return ResponseFactory.fail("에러(팀 링크 접속): 헤딩 링크로 접속가능한 팀이 존재하지 않습니다");
        }
        newTeamUser.setUser(userRepository.findByUserId(Long.parseLong(id)).get());
        newTeamUser.setTeam(teamRepository.findByTeamId(invitation.getTeam().getTeamId()).get());
        newTeamUser.setIsBanned(false);
        teamUserRepository.save(newTeamUser);

        //응답
        TeamIdDto teamIdDto = new TeamIdDto(invitation.getTeam().getTeamId());
        return ResponseFactory.success(teamIdDto);
    }

    //악보별 포지션 할당
    public ResponseEntity<Response<ScorePositionDto>> scorePositionMapping(ScorePositionDto scorePositionDto){

        if(scoreRepository.findByScoreId(scorePositionDto.getScoreId()).isEmpty() ||
                positionRepository.findByPositionId(scorePositionDto.getPositionId()).isEmpty()){
            return ResponseFactory.fail("에러(악보별 포지션 할당): 입력한 값에 해당하는 악보나 포지션이 존재하지 않습니다");
        }

        Score score = scoreRepository.findByScoreId(scorePositionDto.getScoreId()).get();
        score.setPositionId(positionRepository.findByPositionId(scorePositionDto.getPositionId()).get());
        scoreRepository.save(score);

        //응답
        return ResponseFactory.success(scorePositionDto);
    }

    //색상 조회
    public ResponseEntity<Response<List<ColorDto>>> getColorList(){
        List<ColorDto> colorData = new ArrayList<>();
        List<Color> colorList = colorRepository.findAllByOrderByColorIdAsc();
        for(Color color : colorList){
            ColorDto colorDto = new ColorDto();
            colorDto.setColorId(color.getColorId());
            colorDto.setColorName(color.getColorName());
            colorDto.setColorCode(color.getColorCode());
            colorData.add(colorDto);
        }

        //응답
        return ResponseFactory.success(colorData);
    }

    //포지션 조회
    public ResponseEntity<Response<List<PositionDto>>> getPositionList(Long id){
        List<PositionDto> positionData = new ArrayList<>();
        if(teamRepository.findByTeamId(id).isEmpty()){
            return ResponseFactory.fail("에러(포지션 조회): 입력한 id에 해당하는 팀이 존재하지 않습니다");
        }
        List<Position> positionList = positionRepository.findByTeam(teamRepository.findByTeamId(id).get());

        if(positionList.isEmpty()){
            List<Position> positions = new ArrayList<>();
            for(int defaultIdx = 0; defaultIdx<7; defaultIdx++){
                Position position = new Position();
                if(colorRepository.findByColorId(DefaultColorId[defaultIdx]).isEmpty()){
                    return ResponseFactory.fail("에러(포지션 조회): 서버 db 오류");
                }
                position.setColor(colorRepository.findByColorId(DefaultColorId[defaultIdx]).get());
                position.setPositionName(DefaultPositionName[defaultIdx]);
                position.setTeam(teamRepository.findByTeamId(id).get());
                positions.add(position);
                positionList.add(position);
            }
            positionRepository.saveAll(positions);
        }

        for(Position position : positionList){
            PositionDto positionDto = new PositionDto();
            positionDto.setPositionId(position.getPositionId());
            positionDto.setPositionName(position.getPositionName());
            positionDto.setColorId(position.getColor().getColorId());
            positionData.add(positionDto);
        }

        //응답
        return ResponseFactory.success(positionData);
    }

    //커스텀 포지션 생성
    public ResponseEntity<Response<CustomPositionDto>> addCustomPosition(CustomPositionDto customPositionDto){
        if(teamRepository.findByTeamId(customPositionDto.getTeamId()).isEmpty()){
            return ResponseFactory.fail("에러(커스텀 포지션 생성): 입력한 id에 해당하는 팀이 존재하지 않습니다");
        }
        List<Position> positionList = positionRepository.findByTeam(teamRepository.findByTeamId(customPositionDto.getTeamId()).get());
        String newPositionName = customPositionDto.getPositionName();
        boolean isDuplicate = false;
        for(int defaultIdx = 0; defaultIdx<7; defaultIdx++){
            if(newPositionName.equals(DefaultPositionName[defaultIdx])){
                isDuplicate = true;
                break;
            }
        }
        for(Position position : positionList){
            if(newPositionName.equals(position.getPositionName())){
                isDuplicate = true;
                break;
            }
        }
        if(isDuplicate){
            return  ResponseFactory.fail("에러(커스텀 포지션 생성): 포지션 이름이 중복됩니다");
        }
            //등록
            Position newPosition = new Position();
            newPosition.setPositionName(customPositionDto.getPositionName());
            newPosition.setTeam(teamRepository.findByTeamId(customPositionDto.getTeamId()).get());
            if(colorRepository.findByColorId(customPositionDto.getColorId()).isEmpty()){
                return ResponseFactory.fail("에러(커스텀 포지션 생성): 서버 db 오류");
            }
            newPosition.setColor(colorRepository.findByColorId(customPositionDto.getColorId()).get());
            positionRepository.save(newPosition);

            //응답
            return ResponseFactory.success(customPositionDto);
    }

    //팀 정보 추출
    private List<LongTeamInfoDto> extractTeamInfo(List<TeamUser> teamUserList, Long id, boolean activeTeamsOnly) {
        List<LongTeamInfoDto> longTeamInfoDtoList = new ArrayList<>();
        for (TeamUser teamUser : teamUserList) {
            Team team = teamUser.getTeam();
            if (activeTeamsOnly && team.getIsFinished()) {
                continue;
            }
            LongTeamInfoDto longTeamInfoDto = new LongTeamInfoDto();
            longTeamInfoDto.setTeamName(team.getTeamName());
            if(team.getSongName()!=null){
                longTeamInfoDto.setSongNameExist(true);
                longTeamInfoDto.setSongName(team.getSongName());
            }
            else{
                longTeamInfoDto.setSongNameExist(false);
            }
            if(teamUser.getPosition()!=null){
                longTeamInfoDto.setMyPositionExist(true);
                longTeamInfoDto.setMyPosition(teamUser.getPosition().getPositionName());
                longTeamInfoDto.setPositionColor(teamUser.getPosition().getColor().getColorName());
                longTeamInfoDto.setPositionCode(teamUser.getPosition().getColor().getColorCode());
            }
            else{
                longTeamInfoDto.setMyPositionExist(false);
            }
            longTeamInfoDto.setTeamProfileUrl(team.getProfileUrl());
            longTeamInfoDto.setIsLeader(Objects.equals(team.getTeamLeaderId(), id));
            longTeamInfoDto.setIsFinished(team.getIsFinished());
            longTeamInfoDto.setCreatedAt(team.getCreatedAt());

            List<TeamUser> memberList = new ArrayList<>(team.getTeamUsers());
            memberList.sort(Comparator.comparing(TeamUser::getTeamUserId));
            List<MemberInfoDto> memberInfoDtoList = new ArrayList<>();
            for(TeamUser member : memberList){
                if(member.getIsBanned()){
                    continue;
                }
                MemberInfoDto memberInfoDto = new MemberInfoDto();
                memberInfoDto.setLeader(Objects.equals(team.getTeamLeaderId(), member.getUser().getUserId()));
                memberInfoDto.setNickName(member.getUser().getNickname());
                memberInfoDto.setUserProfileUrl(member.getUser().getImgUrl());
                memberInfoDtoList.add(memberInfoDto);
            }
            longTeamInfoDto.setMember(memberInfoDtoList);
            longTeamInfoDtoList.add(longTeamInfoDto);
        }
        return longTeamInfoDtoList;
    }

    //활성화 된 팀목록
    public ResponseEntity<Response<List<LongTeamInfoDto>>>getActiveTeams(Long id) {
        if (userRepository.findByUserId(id).isEmpty()) {
            return ResponseFactory.fail("에러(활성화 된 팀목록): 입력한 id에 해당하는 회원이 존재하지 않습니다");
        }
        List<TeamUser> teamUserList = teamUserRepository.findByUserOrderByCreatedAtDesc(userRepository.findByUserId(id).get());
        List<LongTeamInfoDto> longTeamInfoDtoList = extractTeamInfo(teamUserList, id, true);
        return ResponseFactory.success(longTeamInfoDtoList);
    }

    //전체 팀목록
    public ResponseEntity<Response<List<LongTeamInfoDto>>>getAllTeams(Long id) {
        if(userRepository.findByUserId(id).isEmpty()){
            return ResponseFactory.fail("에러(전체 팀목록): 입력한 id에 해당하는 회원이 존재하지 않습니다");
        }
        List<TeamUser> teamUserList = teamUserRepository.findByUserOrderByCreatedAtDesc(userRepository.findByUserId(id).get());
        List<LongTeamInfoDto> longTeamInfoDtoList = extractTeamInfo(teamUserList, id, false);
        return ResponseFactory.success(longTeamInfoDtoList);
    }

    //팀원 teamUserId, 이름, 리더 여부, 프로필, 포지션 존재 여부, 포지션 이름, 색깔 이름, 색깔 코드 조회
    public ResponseEntity<Response<List<LongMemberInfoDto>>> getTeamMembersInfo(Long id){
        if(teamRepository.findByTeamId(id).isEmpty()){
            return ResponseFactory.fail("에러(getTeamMembersInfo): 입력한 id에 해당하는 팀이 존재하지 않습니다");
        }
        Team team = teamRepository.findByTeamId(id).get();
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
        if(teamUserRepository.findByTeamUserId(teamUserPositionDto.getTeamUserId()).isEmpty() ||
                positionRepository.findByPositionId(teamUserPositionDto.getPositionId()).isEmpty()){
            return ResponseFactory.fail("에러(팀원 포지션 설정, 변경): 입력한 id에 해당하는 팀원 혹은 포지션이 존재하지 않습니다");
        }
        TeamUser teamUser = teamUserRepository.findByTeamUserId(teamUserPositionDto.getTeamUserId()).get();
        teamUser.setPosition(positionRepository.findByPositionId(teamUserPositionDto.getPositionId()).get());
        teamUserRepository.save(teamUser);

        //응답
        return ResponseFactory.success(teamUserPositionDto);
    }
}