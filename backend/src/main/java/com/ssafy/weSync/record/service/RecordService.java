package com.ssafy.weSync.record.service;

import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.record.dto.request.CreateRequest;
import com.ssafy.weSync.record.dto.response.*;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.record.repository.RecordRepository;
import com.ssafy.weSync.s3.service.S3Service;
import com.ssafy.weSync.team.entity.Score;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.team.entity.TeamUser;
import com.ssafy.weSync.team.repository.ScoreRepository;
import com.ssafy.weSync.team.repository.TeamRepository;
import com.ssafy.weSync.team.repository.TeamUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class RecordService {

    private final S3Service s3Service;

    private final RecordRepository recordRepository;
    private final ScoreRepository scoreRepository;
    private final TeamUserRepository teamUserRepository;
    private final TeamRepository teamRepository;

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
        Long recordId = recordRepository.save(record).getRecordId();
        return CreateResponse.toDto(recordId, url);
    }


    public List<GetAllMyResponse> getMyRecordList(Long userId) {
        List<Record> records = recordRepository.findAllByUserId(userId);
        List<GetAllMyResponse> getAllMyResponses = records.stream()
                .map(GetAllMyResponse::toDto)
                .collect(Collectors.toList());
        return getAllMyResponses;
    }

    public List<GetAllTeamCommon> getTeamRecordList(Long teamId, String filter, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new GlobalException(CustomError.NO_TEAM));

        List<GetAllTeamCommon> getAllTeamCommons = new ArrayList<>();
        if (filter.equals("all")){
            List<GetAllTeamResponse> getAllTeamResponses = getAllTeamRecordList(teamId);
            for (GetAllTeamResponse r : getAllTeamResponses){
                getAllTeamCommons.add(r);
            }
        }
        else if (filter.equals("my")){
            List<GetAllMyTeamResponse> getAllMyTeamResponses = getAllMyTeamRecordList(userId, teamId);
            for (GetAllMyTeamResponse r : getAllMyTeamResponses){
                getAllTeamCommons.add(r);
            }
        }
        else if (filter.substring(0, 3).equals("pos")){
            Long posId = Long.valueOf(filter.substring(3));
            List<GetAllTeamResponseByPos> getAllTeamResponsesByPos = getAllTeamRecordListByPos(teamId, posId);
            for (GetAllTeamResponseByPos r : getAllTeamResponsesByPos){
                getAllTeamCommons.add(r);
            }
        }
        else {
            throw new GlobalException(CustomError.WRONT_FILTER_FORMAT);
        }
        return getAllTeamCommons;
    }


    private List<GetAllTeamResponse> getAllTeamRecordList(Long teamId) {
        List<Record> records = recordRepository.findAllByTeamId(teamId);
        return records.stream()
                .map(GetAllTeamResponse::toDto)
                .collect(Collectors.toList());
    }
    private List<GetAllTeamResponseByPos> getAllTeamRecordListByPos(Long teamId, Long posId) {
        List<Record> records = recordRepository.findAllByTeamIdByPosition(teamId, posId);
        return records.stream()
                .map(GetAllTeamResponseByPos::toDto)
                .collect(Collectors.toList());
    }
    private List<GetAllMyTeamResponse> getAllMyTeamRecordList(Long userId, Long teamId) {
        List<Record> records = recordRepository.findAllByUserIdByTeamId(userId, teamId);
        return records.stream()
                .map(GetAllMyTeamResponse::toDto)
                .collect(Collectors.toList());
    }

}
