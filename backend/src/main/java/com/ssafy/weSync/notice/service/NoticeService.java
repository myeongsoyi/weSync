package com.ssafy.weSync.notice.service;

import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.ErrorResponse;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.notice.dto.request.CreateRequest;
import com.ssafy.weSync.notice.dto.response.CreateResponse;
import com.ssafy.weSync.notice.dto.response.GetAllResponse;
import com.ssafy.weSync.notice.entity.Notice;
import com.ssafy.weSync.notice.respository.NoticeRepository;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.team.entity.TeamUser;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.team.repository.TeamUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final TeamRepository teamRepository;
    private final TeamUserRepository teamUserRepository;

    public CreateResponse createNotice(CreateRequest createRequest, Long teamId, Long teamUserId) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new GlobalException(CustomError.NO_TEAM));
        TeamUser teamUser = teamUserRepository.findById(teamUserId).orElseThrow(() -> new GlobalException(CustomError.NO_TEAMUSER));

        // 권한체크
        if (teamUserId != team.getTeamLeaderId()){
            throw new GlobalException(CustomError.NO_TEAM_LEADER);
        }

        createRequest.setTeam(team);
        createRequest.setTeamUser(teamUser);

        Long noticeId = noticeRepository.save(createRequest.toEntity()).getNoticeId();
        Notice notice = noticeRepository.findById(noticeId).orElseThrow(() -> new GlobalException(CustomError.NO_NOTICE));
        LocalDateTime createdTime = notice.getCreatedAt();

        return CreateResponse.toDto(noticeId, createdTime);
    }

    public List<GetAllResponse> getAllNotices(Long teamId) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new GlobalException(CustomError.NO_TEAM));

        List<Notice> notices = noticeRepository.findAllByTeamIdOrderByCreatedAt(teamId);
        List<GetAllResponse> getAllResponses = notices.stream()
                .map(GetAllResponse::toDto)
                .collect(Collectors.toList());

        return getAllResponses;
    }
}
