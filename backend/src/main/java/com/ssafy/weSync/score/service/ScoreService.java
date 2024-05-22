package com.ssafy.weSync.score.service;

import com.ssafy.weSync.global.ApiResponse.AccessTokenValidationAspect;
import com.ssafy.weSync.global.ApiResponse.CustomError;
import com.ssafy.weSync.global.ApiResponse.GlobalException;
import com.ssafy.weSync.global.entity.Expunger;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.record.service.RecordService;
import com.ssafy.weSync.s3.service.S3Service;
import com.ssafy.weSync.score.entity.Score;
import com.ssafy.weSync.score.repository.ScoreRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class ScoreService {

    private final S3Service s3Service;

    private final ScoreRepository scoreRepository;
    private final RecordService recordService;

    public void deleteScore(Long userId, Long scoreId) {
        Score score = scoreRepository.findById(scoreId).orElseThrow(() -> new GlobalException(CustomError.NO_SCORE));
        scoreRepository.deleteById(scoreId);

        String scoreUrl = score.getScoreUrl();
        int startIndex = scoreUrl.indexOf("score/");
        String beforeParsingKey = scoreUrl.substring(startIndex);
        String parsing = beforeParsingKey.replaceAll("%20", " ");
        String parsedKey = parsing.replaceAll("%3A", ":");
        s3Service.deleteS3Object(parsedKey);

        for (Record r : score.getRecords()){
            recordService.deleteRecord(userId, r.getRecordId());
        }

        score.setDeletedBy(Expunger.normal);
        scoreRepository.deleteById(scoreId);
    }
}
