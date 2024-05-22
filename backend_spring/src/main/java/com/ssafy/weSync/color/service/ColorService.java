package com.ssafy.weSync.color.service;

import com.ssafy.weSync.color.entity.Color;
import com.ssafy.weSync.global.ApiResponse.*;
import com.ssafy.weSync.color.dto.ColorDto;
import com.ssafy.weSync.color.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ColorService {

    private final ColorRepository colorRepository;

    //색상 조회
    public ResponseEntity<Response<List<ColorDto>>> getColorList(){
        List<ColorDto> colorData = new ArrayList<>();
        List<Color> colorList = colorRepository.findAllByOrderByColorIdAsc();
        for(Color color : colorList){
            ColorDto colorDto = new ColorDto();
            colorDto.setColorId(color.getColorId());
            colorDto.setColorName(color.getColorName());
            colorDto.setColorCode(color.getColorCode());
            colorData.add(colorDto);
        }

        //응답
        return ResponseFactory.success(colorData);
    }

}