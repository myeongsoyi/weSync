package com.ssafy.weSync.global.entity;

import com.ssafy.weSync.score.entity.Score;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.lang.NonNull;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@SQLDelete(sql = "UPDATE accompaniment  SET is_deleted = true WHERE accompaniment_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "accompaniment")
public class Accompaniment extends BaseTime{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accompaniment_id")
    private Long accompanimentId;

    @Column(name = "accompaniment_url")
    @NonNull
    private String accompanimentUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "score_id")
    private Score score;

}
