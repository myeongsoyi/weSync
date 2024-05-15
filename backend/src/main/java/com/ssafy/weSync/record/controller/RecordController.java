package com.ssafy.weSync.record.controller;

import com.ssafy.weSync.global.ApiResponse.AccessTokenValidationAspect;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.record.dto.request.CreateRequest;
import com.ssafy.weSync.record.dto.response.GetAllMyResponse;
import com.ssafy.weSync.record.dto.response.CreateResponse;
import com.ssafy.weSync.record.dto.response.GetAllTeamCommon;
import com.ssafy.weSync.record.dto.response.GetAllTeamResponse;
import com.ssafy.weSync.record.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final AccessTokenValidationAspect accessTokenValidationAspect;

    private final RecordService recordService;

    @PostMapping("/{scoreId}/{teamUserId}")
    public ResponseEntity<Response<CreateResponse>> createRecord(@RequestPart(value = "data") CreateRequest createRequest,
                                                                 @RequestPart(value = "file") MultipartFile file,
                                                                 @PathVariable Long scoreId,
                                                                 @PathVariable Long teamUserId) throws IOException {
        CreateResponse createResponse = recordService.createRecord(createRequest, file, scoreId, teamUserId);
        Response<CreateResponse> response = new Response<>(true, createResponse, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<Response<List<GetAllMyResponse>>> getMyRecordList(){
        Long userId = accessTokenValidationAspect.getUserId();
        List<GetAllMyResponse> getAllMyResponse = recordService.getMyRecordList(userId);
        Response<List<GetAllMyResponse>> response = new Response<>(true, getAllMyResponse, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<Response<List<GetAllTeamCommon>>> getTeamRecordList(@PathVariable Long teamId, @RequestParam String filter){
        Long userId = accessTokenValidationAspect.getUserId();
        List<GetAllTeamCommon> getAllTeamResponses = recordService.getTeamRecordList(teamId, filter, userId);
        Response<List<GetAllTeamCommon>> response = new Response<>(true, getAllTeamResponses, null);
        return ResponseEntity.ok(response);
    }

}