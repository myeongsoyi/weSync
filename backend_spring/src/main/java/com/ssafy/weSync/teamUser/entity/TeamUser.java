package com.ssafy.weSync.teamUser.entity;

import com.ssafy.weSync.feedback.entity.FeedBack;
import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.notice.entity.Notice;
import com.ssafy.weSync.position.entity.Position;
import com.ssafy.weSync.record.entity.Record;
import com.ssafy.weSync.team.entity.Team;
import com.ssafy.weSync.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@SQLDelete(sql = "UPDATE team_user SET is_deleted = true WHERE team_user_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "team_user")
public class TeamUser extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_user_id")
    private Long teamUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    @OneToMany(mappedBy = "teamUser")
    private List<Record> records;

    @OneToMany(mappedBy = "teamUser")
    private List<Notice> notices;

    @OneToMany(mappedBy = "teamUser")
    private List<FeedBack> feedBacks;

    @Column(name = "is_banned", nullable = false)
    private Boolean isBanned;
}
