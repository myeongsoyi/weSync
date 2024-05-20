package com.ssafy.weSync.invitation.entity;

import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.team.entity.Team;
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
@SQLDelete(sql = "UPDATE user SET is_deleted = true WHERE invitation_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "invitation")
public class Invitation extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitation_id")
    private Long invitationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "link", nullable = false)
    private String link;

    @Column(name = "is_valid", nullable = false)
    private Boolean isValid;
}
