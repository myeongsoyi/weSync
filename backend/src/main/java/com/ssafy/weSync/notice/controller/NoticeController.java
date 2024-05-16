    package com.ssafy.weSync.notice.controller;

    import com.ssafy.weSync.global.ApiResponse.AccessTokenValidationAspect;
    import com.ssafy.weSync.global.ApiResponse.Response;
    import com.ssafy.weSync.notice.dto.request.CreateRequest;
    import com.ssafy.weSync.notice.dto.request.UpdateRequest;
    import com.ssafy.weSync.notice.dto.response.CreateResponse;
    import com.ssafy.weSync.notice.dto.response.FixUpdateResponse;
    import com.ssafy.weSync.notice.dto.response.GetAllResponse;
    import com.ssafy.weSync.notice.dto.response.ContentUpdateResponse;
    import com.ssafy.weSync.notice.service.NoticeService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RequiredArgsConstructor
    @RestController
    @RequestMapping("/api/notices")
    public class NoticeController {

        private final AccessTokenValidationAspect accessTokenValidationAspect;

        private final NoticeService noticeService;

        @PostMapping("/{teamId}/{teamUserId}")
        public ResponseEntity<Response<CreateResponse>> createNotice(@RequestBody CreateRequest createRequset,
                                                                     @PathVariable Long teamId,
                                                                     @PathVariable Long teamUserId) {
            Long userId = accessTokenValidationAspect.getUserId();
            CreateResponse createResponse = noticeService.createNotice(createRequset, teamId, userId);
            Response<CreateResponse> response = new Response<>(true, createResponse, null);
            return ResponseEntity.ok(response);
        }

        @GetMapping("/{teamId}")
        public ResponseEntity<Response<List<GetAllResponse>>> getAllNotices(@PathVariable Long teamId){
            List<GetAllResponse> getAllResponses = noticeService.getAllNotices(teamId);
            Response<List<GetAllResponse>> response = new Response<>(true, getAllResponses, null);
            return ResponseEntity.ok(response);
        }

        @PutMapping("/fix/{noticeId}/{teamUserId}")
        public ResponseEntity<Response<FixUpdateResponse>> updateNotice(@PathVariable Long noticeId, @PathVariable Long teamUserId) {
            Long userId = accessTokenValidationAspect.getUserId();
            FixUpdateResponse fixUpdateResponse = noticeService.updateNotice(noticeId, userId);
            Response<FixUpdateResponse> response = new Response<>(true, fixUpdateResponse, null);
            return ResponseEntity.ok(response);
        }

        @PutMapping("/content/{noticeId}/{teamUserId}")
        public ResponseEntity<Response<ContentUpdateResponse>> updateNotice(@RequestBody UpdateRequest updateRequest,
                                              @PathVariable Long noticeId,
                                              @PathVariable Long teamUserId) {
            Long userId = accessTokenValidationAspect.getUserId();
            ContentUpdateResponse contentUpdateResponse = noticeService.updateNotice(updateRequest, noticeId, userId);
            Response<ContentUpdateResponse> response = new Response<>(true, contentUpdateResponse, null);
            return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{noticeId}/{teamUserId}")
        public ResponseEntity<?> deleteNotice(@PathVariable Long noticeId, @PathVariable Long teamUserId) {
            Long userId = accessTokenValidationAspect.getUserId();
            noticeService.deleteNotice(noticeId, userId);
            Response<?> response = new Response(true, null, null);
            return ResponseEntity.ok(response);
        }
    }
