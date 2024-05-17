package com.ssafy.weSync.record.controller;

import com.ssafy.weSync.global.ApiResponse.AccessTokenValidationAspect;
import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.notice.dto.request.UpdateRequest;
import com.ssafy.weSync.record.dto.request.CreateRequest;
import com.ssafy.weSync.record.dto.response.*;
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

    @PostMapping("/{scoreId}")
    public ResponseEntity<Response<CreateResponse>> createRecord(@RequestPart(value = "data") CreateRequest createRequest,
                                                                 @RequestPart(value = "file") MultipartFile file,
                                                                 @PathVariable Long scoreId) throws IOException {
        Long userId = accessTokenValidationAspect.getUserId();
        CreateResponse createResponse = recordService.createRecord(createRequest, file, scoreId, userId);
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

    @PutMapping("/{recordId}")
    public ResponseEntity<Response<UpdateResponse>> updateRecord(@PathVariable Long recordId){
        Long userId = accessTokenValidationAspect.getUserId();
        UpdateResponse updateResponse = recordService.updateRecord(userId, recordId);
        Response<UpdateResponse> response = new Response<>(true, updateResponse, null);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<?> deleteRecord(@PathVariable Long recordId){
        Long userId = accessTokenValidationAspect.getUserId();
        recordService.deleteRecord(userId, recordId);
        Response<?> response = new Response(true, null, null);
        return ResponseEntity.ok(response);
    }

}