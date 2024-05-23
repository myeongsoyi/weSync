package com.ssafy.weSync.feedback.service;

import com.ssafy.weSync.feedback.dto.request.CreateRequest;
import com.ssafy.weSync.feedback.dto.request.UpdateRequest;
import com.ssafy.weSync.feedback.dto.response.UpdateResponse;
import com.ssafy.weSync.feedback.dto.response.CreateResponse;
import com.ssafy.weSync.feedback.dto.response.GetAllResponse;
import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.feedback.repository.FeedBackRepository;
import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.global.entity.Expunger;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.record.repository.RecordRepository;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.teamUser.repository.TeamUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
        Record record = recordRepository.findByRecordIdWithScoreAndTeamAndTeamUser(recordId).orElseThrow(() -> new GlobalException(CustomError.NO_RECORD));
        TeamUser teamUser = null;
        for (TeamUser tu : record.getScore().getTeam().getTeamUsers()) {
            if (tu.getUser().getUserId() == userId){
                teamUser = tu;
                break;
            }
        }
        FeedBack feedBack = feedBackRepository.save(createRequest.toEntity(record, teamUser));
        return CreateResponse.toDto(feedBack);
    }

    public List<GetAllResponse> getAllFeedbacks(Long recordId) {
        recordRepository.findById(recordId).orElseThrow(() -> new GlobalException(CustomError.NO_RECORD));
        List<FeedBack> feedbacks = feedBackRepository.findAllByRecordId(recordId);
        return feedbacks.stream()
                .map(GetAllResponse::toDto)
                .collect(Collectors.toList());
    }

    public UpdateResponse updateFeedBack(UpdateRequest updateRequest, Long userId, Long feedbackId) {
        FeedBack feedBack = feedBackRepository.findByFeedbackId(feedbackId).orElseThrow(() -> new GlobalException(CustomError.NO_FEEDBACK));

        // 권한 체크
        if (feedBack.getTeamUser().getUser().getUserId() != userId){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        feedBack.updateContent(updateRequest.getContent());
        FeedBack newFeedBack = feedBackRepository.save(feedBack);
        return UpdateResponse.toDto(newFeedBack);
    }

    public void deleteFeedback(Long userId, Long feedbackId) {
        FeedBack feedBack = feedBackRepository.findByFeedbackId(feedbackId).orElseThrow(() -> new GlobalException(CustomError.NO_FEEDBACK));

        // 권한 체크
        if (feedBack.getTeamUser().getUser().getUserId() != userId){
            throw new GlobalException(CustomError.UNAUTHORIZED_USER);
        }

        feedBack.setDeletedBy(Expunger.normal);
        feedBackRepository.deleteById(feedbackId);
    }
}
