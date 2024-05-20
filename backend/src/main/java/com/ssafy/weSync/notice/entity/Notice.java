package com.ssafy.weSync.notice.entity;

import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.lang.NonNull;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@SQLDelete(sql = "UPDATE notice SET is_deleted = true WHERE notice_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "notice")
public class Notice extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "is_fixed", nullable = false)
    private boolean isFixed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_user_id")
    private TeamUser teamUser;

    public void updateIsFixed() {
        if (this.isFixed == true) {
            this.isFixed = false;
        } else {
            this.isFixed = true;
        }
    }

    public void updateContent(String content){
        this.content = content;
    }
}
