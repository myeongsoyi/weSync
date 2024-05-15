package com.ssafy.weSync.record.repository;

import com.ssafy.weSync.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {
    /***
     * 내 녹음목록 조회
     * @param userId
     * @return
     */
    @Query("SELECT r FROM Record r JOIN r.score s JOIN s.position p JOIN s.team t JOIN t.teamUsers tu " +
            "JOIN tu.user u join p.color WHERE u.userId = :userId ORDER BY r.createdAt DESC LIMIT 10")
    List<Record> findAllByUserId(@Param("userId") Long userId);

    /***
     * 팀 내 녹음목록 조회
     * @param teamId
     * @return
     */
    @Query("SELECT r FROM Record r JOIN r.score s JOIN s.position p JOIN s.team t JOIN t.teamUsers tu " +
            "JOIN tu.user u join p.color WHERE t.teamId = :teamId AND r.isPublic = true ORDER BY r.createdAt DESC LIMIT 10")
    List<Record> findAllByTeamId(Long teamId);

    /***
     * 팀 내 포지션별 녹음목록 조회
     * @param teamId
     * @param positionId
     * @return
     */
    @Query("SELECT r FROM Record r JOIN r.score s JOIN s.position p JOIN s.team t JOIN t.teamUsers tu " +
            "JOIN tu.user u join p.color WHERE t.teamId = :teamId AND p.positionId = :positionId AND r.isPublic = true " +
            "ORDER BY r.createdAt DESC LIMIT 10")
    List<Record> findAllByTeamIdByPosition(@Param("teamId") Long teamId, @Param("positionId") Long positionId);

    /***
     * 팀 내 나의 녹음목록 조회
     * @param userId
     * @param teamId
     * @return
     */
    @Query("SELECT r FROM Record r JOIN r.score s JOIN s.position p JOIN s.team t JOIN t.teamUsers tu " +
            "JOIN tu.user u join p.color WHERE u.userId = :userId AND t.teamId = :teamId ORDER BY r.createdAt DESC LIMIT 10")
    List<Record> findAllByUserIdByTeamId(@Param("userId") Long userId, @Param("teamId") Long teamId);



}
