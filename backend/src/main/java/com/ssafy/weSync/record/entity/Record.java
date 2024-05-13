package com.ssafy.weSync.record.entity;

import com.ssafy.weSync.team.entity.Score;
import com.ssafy.weSync.team.entity.TeamUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@SQLDelete(sql = "UPDATE record SET is_deleted = true WHERE record_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "record")
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long record_id;

    @Column(name = "title")
    @NotNull
    private String title;

    @Column(name = "record_url")
    @NotNull
    private String url;

    @Column(name = "status")
    @NotNull
    private Status status;

    @Column(name = "start_at")
    private Long startAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "score_id")
    private Score score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_user_id")
    private TeamUser teamUser;
}
