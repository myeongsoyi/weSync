package com.ssafy.weSync.notice.controller;

import com.ssafy.weSync.global.ApiResponse.Response;
import com.ssafy.weSync.notice.dto.request.CreateRequest;
import com.ssafy.weSync.notice.dto.response.CreateResponse;
import com.ssafy.weSync.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor // final이나 @NonNull으로 선언된 필드만을 파라미터로 받는 생성자를 생성
@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/{teamId}/{teamUserId}")
    public ResponseEntity<Response<CreateResponse>> createNotice(@RequestBody CreateRequest createRequset,
                                                                 @PathVariable Long teamId,
                                                                 @PathVariable Long teamUserId) {
        CreateResponse createResponse = noticeService.createNotice(createRequset, teamId, teamUserId);
        Response<CreateResponse> response = new Response<>(true, createResponse, null);
        return ResponseEntity.ok(response);
    }

}
