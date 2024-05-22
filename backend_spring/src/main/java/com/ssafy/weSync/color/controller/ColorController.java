package com.ssafy.weSync.color.controller;

import com.ssafy.weSync.color.service.ColorService;
import com.ssafy.weSync.color.dto.ColorDto;
import com.ssafy.weSync.global.ApiResponse.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team")
public class ColorController {

    @Autowired
    private ColorService colorService;

    //색상 조회
    @GetMapping("/color")
    public ResponseEntity<Response<List<ColorDto>>> getColorList() {
        return colorService.getColorList();
    }

}