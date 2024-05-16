package com.ssafy.weSync.user.entity;

import com.ssafy.weSync.global.entity.BaseTime;
import com.ssafy.weSync.team.entity.TeamUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE user SET is_deleted = true WHERE user_id=?")
@Where(clause = "is_deleted = false")
@Table(name = "user")
public class User extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "kakao_id")
    private Long kakaoId;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(name = "is_active")
    private Boolean isActive;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TeamUser> teamUsers;
}