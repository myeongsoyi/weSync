package com.ssafy.weSync.color.entity;

import com.ssafy.weSync.global.entity.BaseTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE color SET is_deleted = true WHERE color_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "color")
public class Color extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "color_id")
    private Long colorId;

    @Column(name = "color_name", nullable = false)
    private String colorName;

    @Column(name = "color_code", nullable = false)
    private String colorCode;
}
