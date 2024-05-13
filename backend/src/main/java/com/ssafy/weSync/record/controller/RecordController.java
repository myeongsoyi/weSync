package com.ssafy.weSync.record.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.notice.dto.response.CreateResponse;
import com.ssafy.weSync.record.dto.request.CreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final RecordService recordService;

    @PostMapping("/{scoreId}/{teamUserId}")
    public ResponseEntity<Response<CreateResponse>> createRecord(@RequestBody CreateRequest createRequest,
                                                                 @PathVariable Long scoreId,
                                                                 @PathVariable Long teamUserId){
        CreateResponse createResponse = recordService.createRecord(createRequest, scoreId, teamUserId);
        Response<CreateResponse> response = new Response<>(true, createResponse, null);
        return ResponseEntity.ok(response);
    }
}