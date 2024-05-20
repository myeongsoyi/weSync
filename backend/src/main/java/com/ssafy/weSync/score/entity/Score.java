package com.ssafy.weSync.score.entity;

import com.ssafy.weSync.global.entity.Accompaniment;
import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.position.entity.Position;
import com.ssafy.weSync.team.entity.Team;
import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
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

    @JoinColumn(name = "part_num", nullable = false)
    private int partNum;

    @Column(name = "title")
    private String title;

    @Column(name = "score_url", nullable = false)
    private String scoreUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToMany(mappedBy = "score")
    private List<Record> records;

    @OneToMany(mappedBy = "score")
    private List<Accompaniment> accompaniments;

}
