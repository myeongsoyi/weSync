package com.ssafy.weSync.team.service;

import com.ssafy.weSync.color.repository.ColorRepository;
import com.ssafy.weSync.global.ApiResponse.*;
import com.ssafy.weSync.global.entity.Expunger;
import com.ssafy.weSync.invitation.repository.InvitationRepository;
import com.ssafy.weSync.invitation.service.InvitationService;
import com.ssafy.weSync.notice.entity.Notice;
import com.ssafy.weSync.notice.respository.NoticeRepository;
import com.ssafy.weSync.notice.service.NoticeService;
import com.ssafy.weSync.position.entity.Position;
import com.ssafy.weSync.position.repository.PositionRepository;
import com.ssafy.weSync.position.service.PositionService;
import com.ssafy.weSync.score.entity.Score;
import com.ssafy.weSync.score.repository.ScoreRepository;
import com.ssafy.weSync.score.service.ScoreService;
import com.ssafy.weSync.team.dto.request.*;
import com.ssafy.weSync.team.dto.response.*;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import com.ssafy.weSync.team.entity.*;
import com.ssafy.weSync.team.repository.*;
import com.ssafy.weSync.s3.service.S3Service;
import com.ssafy.weSync.teamUser.repository.TeamUserRepository;
import com.ssafy.weSync.teamUser.service.TeamUserService;
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
    private final TeamUserRepository teamUserRepository;
    private final UserRepository userRepository;
    private final ColorRepository colorRepository;
    private final PositionRepository positionRepository;

    private final AccessTokenValidationAspect accessTokenValidationAspect;

    private static final String[] DefaultPositionName = {"소프라노","메조소프라노", "알토", "바리톤", "테너", "베이스", "퍼커션"}; // 디폴트 포지션 이름
    private static final Long[] DefaultColorId = {1L,2L,3L,4L,5L,6L,7L}; // 디폴트 포지션별 colorId
    private static final String defaultProfileUrl = "https://we-sync.s3.ap-southeast-2.amazonaws.com/front/wesync_icon.svg"; // 디폴트 팀 프로필
    private final TeamUserService teamUserService;
    private final NoticeService noticeService;
    private final ScoreService scoreService;
    private final ScoreRepository scoreRepository;
    private final NoticeRepository noticeRepository;

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
            if(team!=null && !team.getIsFinished() && !team.isDeleted() && !teamUser.getIsBanned()){
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

        for (Notice n : deleteTeam.get().getNotices()){
            n.setDeletedBy(Expunger.normal);
            n.setDeleted(true);
            noticeRepository.save(n);
        }

        for (Score s : deleteTeam.get().getScores()){
            s.setDeletedBy(Expunger.normal);
            s.setDeleted(true);
            scoreRepository.save(s);
        }

        for (TeamUser tu : deleteTeam.get().getTeamUsers()) {
            tu.setDeletedBy(Expunger.normal);
            tu.setDeleted(true);
            teamUserRepository.save(tu);
        }

        deleteTeam.get().setDeleted(true);
        deleteTeam.get().setDeletedBy(Expunger.normal);
        deleteTeam.get().setIsFinished(true);
        teamRepository.save(deleteTeam.get());

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