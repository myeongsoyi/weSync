package com.ssafy.weSync.notice.service;

import com.ssafy.weSync.global.ApiResponse.AccessTokenValidationAspect;
import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.global.entity.Expunger;
import com.ssafy.weSync.notice.dto.request.CreateRequest;
import com.ssafy.weSync.notice.dto.request.UpdateRequest;
import com.ssafy.weSync.notice.dto.response.CreateResponse;
import com.ssafy.weSync.notice.dto.response.FixUpdateResponse;
import com.ssafy.weSync.notice.dto.response.GetAllResponse;
import com.ssafy.weSync.notice.dto.response.ContentUpdateResponse;
import com.ssafy.weSync.notice.entity.Notice;
import com.ssafy.weSync.notice.respository.NoticeRepository;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.teamUser.repository.TeamUserRepository;
import com.ssafy.weSync.user.entity.User;
import com.ssafy.weSync.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final TeamRepository teamRepository;
    private final TeamUserRepository teamUserRepository;

    public CreateResponse createNotice(CreateRequest createRequest, Long teamId, Long userId) {
        TeamUser teamUser = teamUserRepository.findByUserIdAndTeamId(userId, teamId).orElseThrow(() -> new GlobalException(CustomError.NO_TEAMUSER));
        Team team = teamUser.getTeam();

        // 권한체크
        if (userId != team.getTeamLeaderId()){
            throw new GlobalException(CustomError.NOT_TEAM_LEADER);
        }

        createRequest.setTeam(team);
        createRequest.setTeamUser(teamUser);

        Notice notice = noticeRepository.save(createRequest.toEntity());
        LocalDateTime createdTime = notice.getCreatedAt();
        return CreateResponse.toDto(notice.getNoticeId(), createdTime);
    }

    public List<GetAllResponse> getAllNotices(Long teamId) {
        Team team = teamRepository.findByTeamIdWithNotices(teamId).orElseThrow(() -> new GlobalException(CustomError.NO_TEAM));
        List<Notice> notices = team.getNotices();
        List<GetAllResponse> getAllResponses = notices.stream()
                .map(GetAllResponse::toDto)
                .collect(Collectors.toList());
        return getAllResponses;
    }

    // 상단고정여부 변경
    public FixUpdateResponse updateNotice(Long noticeId, Long userId) {
        Notice notice = noticeRepository.findByNoticeIdWithTeamAndTeamUser(noticeId).orElseThrow(() -> new GlobalException(CustomError.NO_NOTICE));
        Team team = notice.getTeam();

        // 권한체크
        if (userId != team.getTeamLeaderId()){
            throw new GlobalException(CustomError.NOT_TEAM_LEADER);
        }

        notice.updateIsFixed();
        Notice newNotice = noticeRepository.save(notice);
        return FixUpdateResponse.toDto(newNotice.isFixed());
    }

    // 공지내용변경
    public ContentUpdateResponse updateNotice(UpdateRequest updateRequest, Long noticeId, Long userId){
        Notice notice = noticeRepository.findByNoticeIdWithTeamAndTeamUser(noticeId).orElseThrow(() -> new GlobalException(CustomError.NO_NOTICE));
        Team team = notice.getTeam();

        // 권한체크
        if (userId != team.getTeamLeaderId()){
            throw new GlobalException(CustomError.NOT_TEAM_LEADER);
        }

        notice.updateContent(updateRequest.getContent());
        Notice newNotice = noticeRepository.save(notice);
        return ContentUpdateResponse.toDto(newNotice.getUpdatedAt());
    }

    public void deleteNotice(Long noticeId, Long userId) {
        Notice notice = noticeRepository.findByNoticeIdWithTeamAndTeamUser(noticeId).orElseThrow(() -> new GlobalException(CustomError.NO_NOTICE));
        Team team = notice.getTeam();

        // 권한체크
        if (userId != team.getTeamLeaderId()){
            throw new GlobalException(CustomError.NOT_TEAM_LEADER);
        }

        notice.setDeletedBy(Expunger.normal);
        noticeRepository.deleteById(noticeId);
    }

}
