package com.ssafy.weSync.feedback.controller;

import com.ssafy.weSync.feedback.dto.request.CreateRequest;
import com.ssafy.weSync.feedback.dto.request.UpdateRequest;
import com.ssafy.weSync.feedback.dto.response.UpdateResponse;
import com.ssafy.weSync.feedback.dto.response.CreateResponse;
import com.ssafy.weSync.feedback.dto.response.GetAllResponse;
import com.ssafy.weSync.feedback.service.FeedBackService;
import com.ssafy.weSync.global.ApiResponse.AccessTokenValidationAspect;
import com.ssafy.weSync.global.ApiResponse.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{recordId}")
    public ResponseEntity<Response<List<GetAllResponse>>> getAllFeedbacks(@PathVariable Long recordId){
        List<GetAllResponse> getAllResponse = feedBackService.getAllFeedbacks(recordId);
        Response<List<GetAllResponse>> response = new Response<>(true, getAllResponse, null);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{feedbackId}")
    public ResponseEntity<Response<UpdateResponse>> updateFeedback(@RequestBody UpdateRequest updateRequest,
                                                                   @PathVariable Long feedbackId){
        Long userId = accessTokenValidationAspect.getUserId();
        UpdateResponse updateResponse = feedBackService.updateFeedBack(updateRequest, userId, feedbackId);
        Response<UpdateResponse> response = new Response<>(true, updateResponse, null);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long feedbackId){
        Long userId = accessTokenValidationAspect.getUserId();
        feedBackService.deleteFeedback(userId, feedbackId);
        Response<?> response = new Response<>(true, null, null);
        return ResponseEntity.ok(response);
    }
}
