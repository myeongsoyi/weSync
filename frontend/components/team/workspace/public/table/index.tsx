'use client';

// import React, { useEffect } from 'react';
import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Checkbox } from 'antd';
import { useSingleAudioStore } from '@/store/singleAudioStore';
import { useMultiAudioStore } from '@/store/multiAudioStore';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import CommentModal from '../../comment';
import { useParams } from 'next/navigation';
import { getTeamRecordsAll } from '@/services/team/workspace';
import { RecordAll } from '@/types/record';


export default function PublicListRecord() {
  const [success, setSuccess] = useState<RecordAll['success']>(true);
  const [records, setRecords] = useState<RecordAll['data']>([]);
  const [error, setError] = useState<RecordAll['error']>(null);
  const { teamId } = useParams();

  useEffect(() => {
    const fetchRecords = async () => {
      const response = await getTeamRecordsAll(teamId as string);
      console.log(response);
      if (response.success) {
        setSuccess(response.success);
        setRecords(response.data);
        setError(response.error);
      } else {
        setSuccess(response.success);
        setError(response.error);
      }
    };
    fetchRecords();
  }, [teamId]);

  const { tracks, toggleTrack, isPlaying } = useMultiAudioStore();
  const { currentId, playing, togglePlayPause, setCurrentTrack, stopTrack } =
    useSingleAudioStore();

  const { Column } = Table;

  function togglePlay(song: RecordAll['data'][number]) {
    setCurrentTrack('', 0);
    if (currentId !== song.recordId) {
      setCurrentTrack(song.recordUrl, song.recordId);
    } else {
      togglePlayPause();
    }
  }
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [selectedSongTitle, setSelectedSongTitle] = useState<string>('');

  const handleOpenCommentModal = (songId: number, songName: string) => {
    setSelectedSongId(songId);
    setSelectedSongTitle(songName);
    setCommentModalVisible(true);
  };

  // useEffect(() => {
  //   console.log(tracks);
  // }, [tracks]);

  // 포지션 필터링 임시 함수
  const positionFilters = Array.from(
    new Set(records?.map((record) => record.positionName)),
  ).map((position) => ({
    text: position,
    value: position,
  }));

  if (!success) {
    return (
      <div>
        <h2>에러 발생</h2>
        <h3>{error?.errorMessage}</h3>
      </div>
    );
  } else if (records === null) {
    return (
      <div>
        <h2>데이터가 없습니다.</h2>
      </div>
    );
  }

  return (
    <>
<Table dataSource={records} pagination={false} rowKey="id">
  <Column
    title=""
    dataIndex="recordId"
    key="recordId"
    render={(recordId, record:  RecordAll['data'][number]) => (  // record 매개변수 추가
      <div className="flex items-center">
        <Checkbox
          onChange={() => [
            toggleTrack(recordId, record.recordUrl, record.title),
            stopTrack(),
          ]}
          checked={tracks.some((t) => t.id === recordId)}
          style={{ marginRight: '8px' }}
          disabled={isPlaying}
        />
        <Button
          onClick={() => togglePlay(record)}
          className="m-auto"
          type="text"
          icon={
            currentId === recordId && playing ? (
              <PauseCircleOutlined style={{ fontSize: 28 }} />
            ) : (
              <PlayCircleOutlined style={{ fontSize: 28 }} />
            )
          }
          style={{ height: '36px', width: '36px' }}
        />
        <Button
          onClick={() => handleOpenCommentModal(recordId, record.title)}
          className="m-auto"
          type="text"
          icon={<CommentOutlined style={{ fontSize: 28 }} />}
          style={{ height: '36px', width: '36px' }}
        />
      </div>
    )}
        />
        <Column
          title="이름"
          dataIndex="nickname"
          key="이름"
          sorter={(a: { nickname: string }, b: { nickname: string }) =>
            a.nickname.localeCompare(b.nickname)
          }
          render={(singer) => <p className="whitespace-nowrap">{singer}</p>}
        />
        <Column
          title="포지션"
          dataIndex="positionName"
          key="포지션"
          sorter={(
            a: { positionName: string },
            b: { positionName: string },
          ) => a.positionName.localeCompare(b.positionName)}
          filters={positionFilters}
          onFilter={(value, record) => record.positionName === value}
          render={(position) => (
            <>
              <Tag
                style={{
                  border: `1px solid ${position.color}`,
                  color: `${position.color}`,
                  margin: '4px 0',
                }}
              >
                {position.name}
              </Tag>
            </>
          )}
        />
        <Column title="제목" dataIndex="title" key="title" />
        <Column
          title="길이"
          dataIndex="startAt"
          key="startAt"
          sorter={(a: { startAt: number, endAt: number }, b: { startAt: number, endAt: number }) =>
            (a.endAt - a.startAt) - (b.endAt - b.startAt)
          }
          render={(runTime) => {
            const minutes = Math.floor(runTime / 60);
            const seconds = runTime % 60;
            if (runTime >= 60) {
              return (
                <Tag color="red">
                  {minutes}분 {seconds}초
                </Tag>
              );
            }
            return <Tag color="red">{runTime}초</Tag>;
          }}
        />
        <Column
          title="일시"
          dataIndex="createAt"
          key="createAt"
          render={(createAt) => (
            // 향후 포매팅 예정
            <>
              <Tag color="blue">{createAt}</Tag>
              <Tag color="green">{createAt}</Tag>
            </>
          )}
        />
      </Table>
      {selectedSongId !== null && (
        <CommentModal
          open={commentModalVisible}
          onClose={() => {
            setCommentModalVisible(false);
            setSelectedSongId(null);
            setSelectedSongTitle('');
          }}
          songId={selectedSongId}
          songTitle={selectedSongTitle} // 제목을 전달
          teamId={teamId as string}
        />
      )}

      {/* <FixedAudioPlayer />
      {tracks.length > 0 && <MultiAudioPlayer />} */}
    </>
  );
}
