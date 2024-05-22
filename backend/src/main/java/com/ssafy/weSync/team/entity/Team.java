package com.ssafy.weSync.team.entity;

import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.invitation.entity.Invitation;
import com.ssafy.weSync.notice.entity.Notice;
import com.ssafy.weSync.position.entity.Position;
import com.ssafy.weSync.score.entity.Score;
import com.ssafy.weSync.teamUser.entity.TeamUser;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE team SET is_deleted = true WHERE team_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "team")
public class Team extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long teamId;

    //팀명
    @Column(name = "team_name", nullable = false)
    private String teamName;

    //곡명
    @Column(name = "song_name")
    private String songName;

    //프로필이미지
    @Column(name = "profile_url")
    private String profileUrl;

    //완료여부
    @Column(name = "is_finished", nullable = false)
    private Boolean isFinished;

    //팀리더id
    @Column(name = "team_leader_id", nullable = false)
    private Long teamLeaderId;

    //팀원
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    @Column(name = "team_users")
    private List<TeamUser> teamUsers;

    //악보
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    @Column(name = "score")
    private List<Score> scores;

    //포지션
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    @Column(name = "position")
    private List<Position> positions;

    //초대
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    @Column(name = "invitation")
    private List<Invitation> invitations;

    //공지
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<Notice> notices;
}