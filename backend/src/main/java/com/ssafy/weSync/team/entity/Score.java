package com.ssafy.weSync.team.entity;

import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.record.entity.Record;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@SQLDelete(sql = "UPDATE score SET is_deleted = true WHERE score_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "score")
public class Score extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "score_id")
    private Long scoreId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    @JoinColumn(name = "part_num")
    @NotNull
    private int partNum;

    @Column(name = "title")
    @NotNull
    private String title;

    @Column(name = "score_url")
    @NotNull
    private String scoreUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToMany(mappedBy = "score")
    private List<Record> records;
}
