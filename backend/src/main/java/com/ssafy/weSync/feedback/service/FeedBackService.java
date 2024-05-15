package com.ssafy.weSync.feedback.service;

import com.ssafy.weSync.feedback.dto.request.CreateRequest;
import com.ssafy.weSync.feedback.dto.response.CreateResponse;
import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.feedback.repository.FeedBackRepository;
import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.record.repository.RecordRepository;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.team.entity.TeamUser;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.team.repository.TeamUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedBackService {

    private final FeedBackRepository feedBackRepository;
    private final TeamRepository teamRepository;
    private final TeamUserRepository teamUserRepository;
    private final RecordRepository recordRepository;

    public CreateResponse createFeedBack(CreateRequest createRequest, Long userId, Long teamId, Long recordId) {
        Team team =  teamRepository.findById(teamId).orElseThrow(() -> new GlobalException(CustomError.NO_TEAM));
        TeamUser teamUser = teamUserRepository.findByUserIdAndTeamId(userId, team.getTeamId());
        Record record = recordRepository.findById(recordId).orElseThrow(() -> new GlobalException(CustomError.NO_RECORD));

        FeedBack feedBack = feedBackRepository.save(createRequest.toEntity(record, teamUser));
        return CreateResponse.toDto(feedBack);
    }
}
