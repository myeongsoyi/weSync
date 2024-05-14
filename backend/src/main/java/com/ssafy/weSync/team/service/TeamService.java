package com.ssafy.weSync.team.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.ssafy.weSync.global.ApiResponse.*;
import com.ssafy.weSync.global.entity.Expunger;
import com.ssafy.weSync.team.dto.request.*;
import com.ssafy.weSync.team.dto.response.*;
import com.ssafy.weSync.team.entity.*;
import com.ssafy.weSync.team.repository.*;
import com.ssafy.weSync.s3.service.S3Service;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamService {

    private final S3Service s3Service;

    private final TeamRepository teamRepository;
    private final InvitationRepository invitationRepository;
    private final TeamUserRepository teamUserRepository;
    private final AmazonS3Client amazonS3Client;
    private final UserRepository userRepository;
    private final ColorRepository colorRepository;
    private final PositionRepository positionRepository;
    private final ScoreRepository scoreRepository;

    private final AccessTokenValidationAspect accessTokenValidationAspect;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private static final String[] DefaultPositionName = {"소프라노","메조소프라노", "알토", "바리톤", "테너", "베이스", "퍼커션"}; // 디폴트 포지션 이름
    private static final Long[] DefaultColorId = {1L,1L,1L,1L,1L,1L,1L}; // 디폴트 포지션별 colorId

    private static final String defaultProfileUrl = "https://we-sync.s3.ap-southeast-2.amazonaws.com/teamProfile/efc7da8d-f082-305e-9775-70509e96f33c%202024-05-13%2015%3A05%3A53.jpg"; //추후 변경

//    public TeamService(TeamRepository teamRepository, InvitationRepository invitationRepository, TeamUserRepository teamUserRepository, AmazonS3Client amazonS3Client, UserRepository userRepository, ColorRepository colorRepository, PositionRepository positionRepository, ScoreRepository scoreRepository, AccessTokenValidationAspect accessTokenValidationAspect) {
//        this.teamRepository = teamRepository;
//        this.invitationRepository = invitationRepository;
//        this.teamUserRepository = teamUserRepository;
//        this.amazonS3Client = amazonS3Client;
//        this.userRepository = userRepository;
//        this.colorRepository = colorRepository;
//        this.positionRepository = positionRepository;
//        this.scoreRepository = scoreRepository;
//        this.accessTokenValidationAspect = accessTokenValidationAspect;
//    }

    //팀 생성
    public ResponseEntity<Response<TeamIdDto>> createTeam(CreateTeamInfoDto createTeamInfoDto) throws IOException {

        if (createTeamInfoDto == null ||
                createTeamInfoDto.getTeamName() == null ||
                createTeamInfoDto.getTeamName().isEmpty()) {
            throw new GlobalException(CustomError.INCOMPLETE_INFORMATION);
        }

        //팀 등록
        Team newTeam = new Team();
        newTeam.setTeamLeaderId(accessTokenValidationAspect.getUserId());
        newTeam.setTeamName(createTeamInfoDto.getTeamName());
        newTeam.setSongName(createTeamInfoDto.getSongName());

        MultipartFile teamProfile = createTeamInfoDto.getTeamProfile();

        if(!Arrays.toString(teamProfile.getBytes()).equals("[]")){
            String teamProfileUrl = s3Service.upload(createTeamInfoDto.getTeamProfile(),"teamProfile");
            newTeam.setProfileUrl(teamProfileUrl);
        }
        else{
            newTeam.setProfileUrl(defaultProfileUrl);
        }
        newTeam.setIsFinished(false);
        Long newTeamId = teamRepository.save(newTeam).getTeamId();

        //팀원 등록(본인)
        TeamUser newTeamUser = new TeamUser();
        if(userRepository.findByUserId(accessTokenValidationAspect.getUserId()).isEmpty()){
            throw new GlobalException(CustomError.NO_USER);
        }
        else if(teamRepository.findByTeamId(newTeamId).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
        }
        newTeamUser.setUser(userRepository.findByUserId(accessTokenValidationAspect.getUserId()).get());
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
                !editTeamInfoDto.getTeamName().isEmpty() ||
                editTeamInfoDto.getIsFinished() == null) {
            throw new GlobalException(CustomError.INCOMPLETE_INFORMATION);
        }
        else {

            //팀 등록
            if(teamRepository.findByTeamId(id).isEmpty()){
                throw new GlobalException(CustomError.NO_TEAM);
            }
            Team editTeam = teamRepository.findByTeamId(id).get();
            editTeam.setTeamName(editTeamInfoDto.getTeamName());
            editTeam.setSongName(editTeamInfoDto.getSongName());
            String beforeUrl = editTeam.getProfileUrl();

            //이전 프로필 S3 데이터 삭제
            if(!Objects.equals(beforeUrl, defaultProfileUrl)){
                int startIndex = beforeUrl.indexOf("teamProfile/");
                String beforeParsingKey = beforeUrl.substring(startIndex);
                String parsing = beforeParsingKey.replaceAll("%20", " ");
                String parsedKey = parsing.replaceAll("%3A", ":");
                s3Service.deleteS3Object(parsedKey);
                System.out.println(parsedKey);
            }

            //새 프로필 S3 등록
            MultipartFile teamProfile = editTeamInfoDto.getTeamProfile();

            if(!Arrays.toString(teamProfile.getBytes()).equals("[]")){
                String teamProfileUrl = s3Service.upload(editTeamInfoDto.getTeamProfile(),"teamProfile");
                editTeam.setProfileUrl(teamProfileUrl);
            }
            else{
                editTeam.setProfileUrl(defaultProfileUrl);
            }

            editTeam.setIsFinished(editTeamInfoDto.getIsFinished());
            teamRepository.save(editTeam);

            //을답
            TeamIdDto teamIdDto = new TeamIdDto();
            teamIdDto.setTeamId(id);
            return ResponseFactory.success(teamIdDto);
        }
    }

    //현재 속한 팀 이름, 곡 이름, 프로필 사진, 팀장 여부, 진행중인 팀 이름, 곡 이름, 프로필 사진 조회
    public ResponseEntity<Response<ShortCurrentTeamInfoDto>> getActiveTeamsShort(Long teamId){
        Long userId = accessTokenValidationAspect.getUserId();
        if(teamRepository.findByTeamId(teamId).isEmpty() ||
                teamRepository.findByTeamId(teamId).get().isDeleted()){
            throw new GlobalException(CustomError.NO_TEAM);
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
        shortCurrentTeamInfoDto.setFinished(currentTeam.getIsFinished());
        List<ShortActiveTeamInfoDto> shortActiveTeamInfoDtoList = new ArrayList<>();
        if(userRepository.findByUserId(userId).isEmpty()){
            throw new GlobalException(CustomError.NO_USER);
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
                shortActiveTeamInfoDto.setFinished(team.getIsFinished());
                shortActiveTeamInfoDtoList.add(shortActiveTeamInfoDto);
            }
        }
        shortCurrentTeamInfoDto.setActiveTeams(shortActiveTeamInfoDtoList);

        return ResponseFactory.success(shortCurrentTeamInfoDto);
    }

    //팀 링크 생성
    public ResponseEntity<Response<TeamLinkDto>> getTeamLink(Long id){
        UUID uuid = UUID.randomUUID();
        String randomLink = "https://wesync.co.kr/api/team/invite/" + uuid;

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
            throw new GlobalException(CustomError.NO_TEAMUSER);
        }
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

    //악보별 포지션 할당
    public ResponseEntity<Response<ScorePositionDto>> scorePositionMapping(ScorePositionDto scorePositionDto){

        if(scoreRepository.findByScoreId(scorePositionDto.getScoreId()).isEmpty()){
            throw new GlobalException(CustomError.NO_SCORE);
        }
        else if(positionRepository.findByPositionId(scorePositionDto.getPositionId()).isEmpty()){
            throw new GlobalException(CustomError.NO_POSITION);
        }

        Score score = scoreRepository.findByScoreId(scorePositionDto.getScoreId()).get();
        score.setPosition(positionRepository.findByPositionId(scorePositionDto.getPositionId()).get());
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
            throw new GlobalException(CustomError.NO_TEAM);
        }
        List<Position> positionList = positionRepository.findByTeam(teamRepository.findByTeamId(id).get());

        if(positionList.isEmpty()){
            List<Position> positions = new ArrayList<>();
            for(int defaultIdx = 0; defaultIdx<7; defaultIdx++){
                Position position = new Position();
                if(colorRepository.findByColorId(DefaultColorId[defaultIdx]).isEmpty()){
                    throw new GlobalException(CustomError.POSITION_COLOR_NOT_FOUND);
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
            throw new GlobalException(CustomError.NO_TEAM);
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
            longTeamInfoDto.setTeamId(team.getTeamId());
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
    public ResponseEntity<Response<List<LongTeamInfoDto>>>getActiveTeams() {
        Long id = accessTokenValidationAspect.getUserId();
        if (userRepository.findByUserId(id).isEmpty()) {
            throw new GlobalException(CustomError.NO_USER);
        }
        List<TeamUser> teamUserList = teamUserRepository.findByUserOrderByCreatedAtDesc(userRepository.findByUserId(id).get());
        List<LongTeamInfoDto> longTeamInfoDtoList = extractTeamInfo(teamUserList, id, true);
        return ResponseFactory.success(longTeamInfoDtoList);
    }

    //전체 팀목록
    public ResponseEntity<Response<List<LongTeamInfoDto>>>getAllTeams() {
        Long id = accessTokenValidationAspect.getUserId();
        if(userRepository.findByUserId(id).isEmpty()){
            throw new GlobalException(CustomError.NO_USER);
        }
        List<TeamUser> teamUserList = teamUserRepository.findByUserOrderByCreatedAtDesc(userRepository.findByUserId(id).get());
        List<LongTeamInfoDto> longTeamInfoDtoList = extractTeamInfo(teamUserList, id, false);
        return ResponseFactory.success(longTeamInfoDtoList);
    }

    //팀원 teamUserId, 이름, 리더 여부, 프로필, 포지션 존재 여부, 포지션 이름, 색깔 이름, 색깔 코드 조회
    public ResponseEntity<Response<List<LongMemberInfoDto>>> getTeamMembersInfo(Long id){
        if(teamRepository.findByTeamId(id).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
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
        if(teamUserRepository.findByTeamUserId(teamUserPositionDto.getTeamUserId()).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAMUSER);
        }
        else if(positionRepository.findByPositionId(teamUserPositionDto.getPositionId()).isEmpty()){
            throw new GlobalException(CustomError.NO_POSITION);
        }
        TeamUser teamUser = teamUserRepository.findByTeamUserId(teamUserPositionDto.getTeamUserId()).get();
        teamUser.setPosition(positionRepository.findByPositionId(teamUserPositionDto.getPositionId()).get());
        teamUserRepository.save(teamUser);

        //응답
        return ResponseFactory.success(teamUserPositionDto);
    }

    //팀 삭제
    public ResponseEntity<Response<TeamIdDto>> deleteTeam(Long id){
        Optional<Team> deleteTeam = teamRepository.findByTeamId(id);

        if(deleteTeam.isPresent()){
            deleteTeam.get().setDeleted(true);
            deleteTeam.get().setDeletedBy(Expunger.normal);
            deleteTeam.get().setIsFinished(true);
            teamRepository.save(deleteTeam.get());

            //응답
            TeamIdDto teamIdDto = new TeamIdDto(id);
            return ResponseFactory.success(teamIdDto);
        }
        else{
            throw new GlobalException(CustomError.NO_TEAM);
        }
    }

    //팀 나가기
    public ResponseEntity<Response<TeamIdDto>> leaveTeam(Long teamId){
        Long userId = accessTokenValidationAspect.getUserId();
        Optional<TeamUser> leaveUser = teamUserRepository.findByUserUserIdAndTeamTeamId(userId, teamId);

        if(leaveUser.isPresent() && !leaveUser.get().getIsBanned()){
            //나가기
            leaveUser.get().setIsBanned(true);
            teamUserRepository.save(leaveUser.get());

            //응답
            TeamIdDto teamIdDto = new TeamIdDto(teamId);
            return ResponseFactory.success(teamIdDto);
        }
        else{
            throw new GlobalException(CustomError.NO_TEAM);
        }
    }
}