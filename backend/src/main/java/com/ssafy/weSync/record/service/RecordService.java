package com.ssafy.weSync.record.service;

import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.record.dto.request.CreateRequest;
import com.ssafy.weSync.record.dto.response.CreateResponse;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.record.repository.RecordRepository;
import com.ssafy.weSync.s3.service.S3Service;
import com.ssafy.weSync.team.entity.Score;
import com.ssafy.weSync.team.entity.TeamUser;
import com.ssafy.weSync.team.repository.ScoreRepository;
import com.ssafy.weSync.team.repository.TeamUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@Service
@RequiredArgsConstructor
@Transactional
public class RecordService {

    private final S3Service s3Service;

    private final RecordRepository recordRepository;
    private final ScoreRepository scoreRepository;
    private final TeamUserRepository teamUserRepository;

    /***
     *
     * @param createRequest
     * @param file
     * @param scoreId
     * @param teamUserId
     * @return CreateResponse
     * @throws IOException
     */
    public CreateResponse createRecord(CreateRequest createRequest, MultipartFile file, Long scoreId, Long teamUserId) throws IOException {
        Score score = scoreRepository.findByScoreId(scoreId).orElseThrow(() -> new GlobalException(CustomError.NO_SCORE));
        TeamUser teamUser = teamUserRepository.findByTeamUserId(teamUserId).orElseThrow(() -> new GlobalException(CustomError.NO_TEAMUSER));
        String url = s3Service.upload(file, "record");

        Record record = createRequest.toEntity(url, score, teamUser);
        Long recordId = recordRepository.save(record).getRecord_id();
        return CreateResponse.toDto(recordId, url);
    }



}
