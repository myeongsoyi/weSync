package com.ssafy.weSync.team.service;

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
import org.springframework.http.*;
import org.springframework.stereotype.Service;

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
    private final UserRepository userRepository;
    private final ColorRepository colorRepository;
    private final PositionRepository positionRepository;
    private final ScoreRepository scoreRepository;

    private final AccessTokenValidationAspect accessTokenValidationAspect;

    private static final String[] DefaultPositionName = {"소프라노","메조소프라노", "알토", "바리톤", "테너", "베이스", "퍼커션"}; // 디폴트 포지션 이름
    private static final Long[] DefaultColorId = {1L,2L,3L,4L,5L,6L,7L}; // 디폴트 포지션별 colorId
    private static final String defaultProfileUrl = "https://we-sync.s3.ap-southeast-2.amazonaws.com/front/wesync_icon.svg"; // 디폴트 팀 프로필

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
        if(createTeamInfoDto.getSongName().isEmpty()){
            newTeam.setSongName(null);
        }
        else{
            newTeam.setSongName(createTeamInfoDto.getSongName());
        }

        //팀 프로필이 없는 경우
        if(createTeamInfoDto.getTeamProfile() == null || Arrays.toString(createTeamInfoDto.getTeamProfile().getBytes()).equals("[]")){
            newTeam.setProfileUrl(defaultProfileUrl);
        }
        else{
            String teamProfileUrl = s3Service.upload(createTeamInfoDto.getTeamProfile(),"teamProfile");
            newTeam.setProfileUrl(teamProfileUrl);
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

        //기본 포지션 등록(본인)
        List<Position> positions = new ArrayList<>();
        for(int defaultIdx = 0; defaultIdx<7; defaultIdx++){
            Position position = new Position();
            if(colorRepository.findByColorId(DefaultColorId[defaultIdx]).isEmpty()){
                throw new GlobalException(CustomError.POSITION_COLOR_NOT_FOUND);
            }
            position.setColor(colorRepository.findByColorId(DefaultColorId[defaultIdx]).get());
            position.setPositionName(DefaultPositionName[defaultIdx]);
            position.setTeam(teamRepository.findByTeamId(newTeamId).get());
            positions.add(position);
        }
        positionRepository.saveAll(positions);

        //응답
        TeamIdDto teamIdDto = new TeamIdDto();
        teamIdDto.setTeamId(newTeamId);
        return ResponseFactory.success(teamIdDto);

    }

    //팀 정보 수정 (방장만 가능)
    public ResponseEntity<Response<TeamIdDto>> editTeam(EditTeamInfoDto editTeamInfoDto, Long id) throws IOException {

        if (editTeamInfoDto == null ||
                editTeamInfoDto.getTeamName() == null ||
                editTeamInfoDto.getTeamName().isEmpty() ||
                editTeamInfoDto.getIsFinished() == null) {
            throw new GlobalException(CustomError.INCOMPLETE_INFORMATION);
        }

        if(teamRepository.findByTeamId(id).isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
        }

        Long userId = accessTokenValidationAspect.getUserId();
        if(!Objects.equals(teamRepository.findByTeamId(id).get().getTeamLeaderId(), userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        //팀 등록
        Team editTeam = teamRepository.findByTeamId(id).get();
        editTeam.setTeamName(editTeamInfoDto.getTeamName());

        if(editTeamInfoDto.getSongName().isEmpty()){
            editTeam.setSongName(null);
        }
        else{
            editTeam.setSongName(editTeamInfoDto.getSongName());
        }
        String beforeUrl = editTeam.getProfileUrl();

        //변경할 팀 프로필이 없는 경우
        if(editTeamInfoDto.getTeamProfile() == null || Arrays.toString(editTeamInfoDto.getTeamProfile().getBytes()).equals("[]")){
            editTeam.setProfileUrl(defaultProfileUrl);
        }
        else{

            //이전 프로필 S3 데이터 삭제
            if(!Objects.equals(beforeUrl, defaultProfileUrl)){
                int startIndex = beforeUrl.indexOf("teamProfile/");
                String beforeParsingKey = beforeUrl.substring(startIndex);
                String parsing = beforeParsingKey.replaceAll("%20", " ");
                String parsedKey = parsing.replaceAll("%3A", ":");
                s3Service.deleteS3Object(parsedKey);
            }

            String teamProfileUrl = s3Service.upload(editTeamInfoDto.getTeamProfile(),"teamProfile");
            editTeam.setProfileUrl(teamProfileUrl);
        }

        editTeam.setIsFinished(editTeamInfoDto.getIsFinished());
        teamRepository.save(editTeam);

        //응답
        TeamIdDto teamIdDto = new TeamIdDto();
        teamIdDto.setTeamId(id);
        return ResponseFactory.success(teamIdDto);

    }

    //현재 속한 팀 이름, 곡 이름, 프로필 사진, 팀장 여부, 진행중인 팀 이름, 곡 이름, 프로필 사진 조회
    public ResponseEntity<Response<ShortCurrentTeamInfoDto>> getActiveTeamsShort(Long teamId){
        Long userId = accessTokenValidationAspect.getUserId();

        if(teamRepository.findByTeamId(teamId).isEmpty() ||
                teamRepository.findByTeamId(teamId).get().isDeleted()){
            throw new GlobalException(CustomError.NO_TEAM);
        }

        if(!checkAuthorized(teamId, userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
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
            if(team!=null && !team.getIsFinished() && !team.isDeleted()){
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
        teamUserRepository.save(deleteUser.get());

        //응답
        TeamUserDto teamUserDto = new TeamUserDto(id);
        return ResponseFactory.success(teamUserDto);
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

    //팀 정보 추출
    private List<LongTeamInfoDto> extractTeamInfo(List<TeamUser> teamUserList, Long id, boolean activeTeamsOnly) {
        List<LongTeamInfoDto> longTeamInfoDtoList = new ArrayList<>();
        for (TeamUser teamUser : teamUserList) {
            Team team = teamUser.getTeam();
            if(team==null){
                continue;
            }
            if(team.isDeleted() || teamUser.getIsBanned()){
                continue;
            }
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
        Long userId = accessTokenValidationAspect.getUserId();
        if (userRepository.findByUserId(userId).isEmpty()) {
            throw new GlobalException(CustomError.NO_USER);
        }

        List<TeamUser> teamUserList = teamUserRepository.findByUserOrderByCreatedAtDesc(userRepository.findByUserId(userId).get());
        List<LongTeamInfoDto> longTeamInfoDtoList = extractTeamInfo(teamUserList, userId, true);
        return ResponseFactory.success(longTeamInfoDtoList);
    }

    //전체 팀목록
    public ResponseEntity<Response<List<LongTeamInfoDto>>>getAllTeams() {
        Long userId = accessTokenValidationAspect.getUserId();
        if(userRepository.findByUserId(userId).isEmpty()){
            throw new GlobalException(CustomError.NO_USER);
        }
        List<TeamUser> teamUserList = teamUserRepository.findByUserOrderByCreatedAtDesc(userRepository.findByUserId(userId).get());
        List<LongTeamInfoDto> longTeamInfoDtoList = extractTeamInfo(teamUserList, userId, false);
        return ResponseFactory.success(longTeamInfoDtoList);
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

    //팀 삭제(방장만 가능)
    public ResponseEntity<Response<TeamIdDto>> deleteTeam(Long id){
        Optional<Team> deleteTeam = teamRepository.findByTeamId(id);

        if(deleteTeam.isEmpty()){
            throw new GlobalException(CustomError.NO_TEAM);
        }

        Long userId = accessTokenValidationAspect.getUserId();
        if(!Objects.equals(deleteTeam.get().getTeamLeaderId(), userId)){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        deleteTeam.get().setDeleted(true);
        deleteTeam.get().setDeletedBy(Expunger.normal);
        deleteTeam.get().setIsFinished(true);
        teamRepository.save(deleteTeam.get());

        List<TeamUser> teamUserList = teamUserRepository.findByTeam(deleteTeam.get());
        for(TeamUser teamUser : teamUserList){
            teamUser.setTeam(null);
        }

        //응답
        TeamIdDto teamIdDto = new TeamIdDto(id);
        return ResponseFactory.success(teamIdDto);
    }

    //팀 나가기
    public ResponseEntity<Response<TeamIdDto>> leaveTeam(Long teamId){
        Long userId = accessTokenValidationAspect.getUserId();
        Optional<TeamUser> leaveUser = teamUserRepository.findByUserUserIdAndTeamTeamId(userId, teamId);

        if(leaveUser.isEmpty() ||
                leaveUser.get().getIsBanned() ||
                teamRepository.findByTeamId(teamId).isEmpty() ||
                teamRepository.findByTeamId(teamId).get().isDeleted()){
            throw new GlobalException(CustomError.NO_TEAM);
        }

        leaveUser.get().setIsBanned(true);
        teamUserRepository.save(leaveUser.get());

        if(Objects.equals(leaveUser.get().getTeam().getTeamLeaderId(), userId)){

            Optional<Team> leaveTeam = teamRepository.findByTeamId(teamId);
            if(leaveTeam.isEmpty()){
                throw new GlobalException(CustomError.NO_TEAM);
            }
            List<TeamUser> teamUserList = leaveTeam.get().getTeamUsers();
            for(TeamUser teamUser : teamUserList){
                if(!teamUser.getIsBanned()){
                    leaveTeam.get().setTeamLeaderId(teamUser.getUser().getUserId());
                    teamRepository.save(leaveTeam.get());
                    break;
                }
            }
        }

        //응답
        TeamIdDto teamIdDto = new TeamIdDto(teamId);
        return ResponseFactory.success(teamIdDto);
    }
}