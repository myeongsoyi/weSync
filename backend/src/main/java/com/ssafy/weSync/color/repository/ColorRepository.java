package com.ssafy.weSync.color.repository;

import com.ssafy.weSync.color.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {
    List<Color> findAllByOrderByColorIdAsc();
    Optional<Color> findByColorId(Long colorId);
}