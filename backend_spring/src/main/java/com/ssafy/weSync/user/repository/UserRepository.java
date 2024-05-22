package com.ssafy.weSync.user.repository;

import com.ssafy.weSync.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByKakaoIdAndIsActiveTrue(Long kakaoId);
    Optional<User> findByUserId(Long userId);
}
