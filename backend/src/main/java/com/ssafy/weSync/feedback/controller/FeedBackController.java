package com.ssafy.weSync.feedback.controller;

import com.ssafy.weSync.feedback.dto.request.CreateRequest;
import com.ssafy.weSync.feedback.dto.response.CreateResponse;
import com.ssafy.weSync.feedback.service.FeedBackService;
import com.ssafy.weSync.global.ApiResponse.AccessTokenValidationAspect;
import com.ssafy.weSync.global.ApiResponse.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/feedbacks")
public class FeedBackController {

    private final AccessTokenValidationAspect accessTokenValidationAspect;

    private final FeedBackService feedBackService;

    @PostMapping("/{teamId}/{recordId}")
    public ResponseEntity<Response<CreateResponse>> createFeedback(@RequestBody CreateRequest createRequest,
                                                                   @PathVariable("teamId") Long teamId,
                                                                   @PathVariable("recordId") Long recordId){
        Long userId = accessTokenValidationAspect.getUserId();
        CreateResponse createResponse = feedBackService.createFeedBack(createRequest, userId, teamId, recordId);
        Response<CreateResponse> response = new Response<>(true, createResponse, null);
        return ResponseEntity.ok(response);
    }
}
