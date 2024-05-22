package com.ssafy.weSync.record.entity;

import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.score.entity.Score;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@SQLDelete(sql = "UPDATE record SET is_deleted = true WHERE record_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "record")
public class Record extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "record_url", nullable = false)
    private String url;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    @Column(name = "start_at")
    private Long startAt;

    @Column(name = "end_at")
    private Long endAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "score_id")
    private Score score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_user_id")
    private TeamUser teamUser;

    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL)
    private List<FeedBack> feedBacks;

    public void updateIsPublic() {
        if (this.isPublic == true) {
            this.isPublic = false;
        } else {
            this.isPublic = true;
        }
    }
}
