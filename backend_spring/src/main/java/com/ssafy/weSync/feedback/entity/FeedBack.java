package com.ssafy.weSync.feedback.entity;

import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.teamUser.entity.TeamUser;
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
@SQLDelete(sql = "UPDATE feedback SET is_deleted = true WHERE feedback_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "feedback")
public class FeedBack extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedBackId;

    @Column(name = "content", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id")
    private Record record;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_user_id")
    private TeamUser teamUser;

    public void updateContent(String content) {
        this.content = content;
    }

}
