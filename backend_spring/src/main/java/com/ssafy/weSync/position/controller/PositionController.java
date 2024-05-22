package com.ssafy.weSync.position.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.position.dto.*;
import com.ssafy.weSync.position.service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team")
public class PositionController {

    @Autowired
    private PositionService positionService;

    //악보별 포지션 할당
    @PostMapping("/score-position")
    public ResponseEntity<Response<ScorePositionDto>> scorePositionMapping(@RequestBody ScorePositionDto scorePositionDto) {
        return positionService.scorePositionMapping(scorePositionDto);
    }

    //포지션 조회
    @GetMapping("/position")
    public ResponseEntity<Response<List<PositionDto>>> getPositionList(@RequestParam() Long teamId) {
        return positionService.getPositionList(teamId);
    }

    //커스텀 포지션 생성
    @PostMapping("/position")
    public ResponseEntity<Response<PositionDto>> addCustomPosition(@RequestBody CustomPositionDto customPositionDto) {
        return positionService.addCustomPosition(customPositionDto);
    }

    //포지션 수정
    @PutMapping("/position")
    public ResponseEntity<Response<PositionDto>> editCustomPosition(@RequestBody PositionDto positionDto) {
        return positionService.editCustomPosition(positionDto);
    }

    //포지션 삭제
    @DeleteMapping("/position")
    public ResponseEntity<Response<PositionDto>> deleteCustomPosition(@RequestBody PositionDto positionDto) {
        return positionService.deleteCustomPosition(positionDto);
    }
}