'use client';

// import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';
import { Table, Tag, Button, message } from 'antd';
import { useSingleAudioStore } from '@/store/singleAudioStore';
import {
  CommentOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTeamRecordsMy } from '@/services/team/workspace';
import { RecordMy } from '@/types/record';

export default function PrivateListRecord() {
  const [success, setSuccess] = useState<RecordMy['success']>(true);
  const [records, setRecords] = useState<RecordMy['data']>([]);
  const [error, setError] = useState<RecordMy['error']>(null);
  const { teamId } = useParams();

  // const { currentId, playing, togglePlayPause, setCurrentTrack } =
  //   useSingleAudioStore((state) => ({
  //     currentId: state.currentId,
  //     playing: state.playing,
  //     togglePlayPause: state.togglePlayPause,
  //     setCurrentTrack: state.setCurrentTrack,
  //   }));
  const { currentId, playing, togglePlayPause, setCurrentTrack } =
    useSingleAudioStore();

  function togglePlay(song: RecordMy['data'][number]) {
    if (currentId !== song.recordId) {
      setCurrentTrack(song.recordUrl, song.recordId);
    } else {
      togglePlayPause();
    }
  }

  useEffect(() => {
    const fetchRecords = async () => {
      const response = await getTeamRecordsMy(teamId as string);
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
  }, []);

  const { Column } = Table;
  // const { Column, ColumnGroup } = Table;
  // console.log(records);

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
          dataIndex="song"
          key="song"
          render={(song) => (
            <div className="flex">
              <Button
                onClick={() => togglePlay(song)}
                className="m-auto"
                type="text"
                icon={
                  currentId === song.id && playing ? (
                    <PauseCircleOutlined style={{ fontSize: 28 }} />
                  ) : (
                    <PlayCircleOutlined style={{ fontSize: 28 }} />
                  )
                }
                style={{ height: '36px', width: '36px' }}
              />
              <Button
                className="m-auto"
                type="text"
                icon={<CommentOutlined style={{ fontSize: 28 }} />}
                style={{ height: '36px', width: '36px' }}
              />
            </div>
          )}
        />
        <Column
          title="포지션"
          dataIndex="position"
          key="포지션"
          sorter={(
            a: { position: { name: string } },
            b: { position: { name: string } },
          ) => a.position.name.localeCompare(b.position.name)}
          filters={positionFilters}
          onFilter={(value, record) => record.position.name === value}
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
          dataIndex="runTime"
          key="runTime"
          sorter={(a: { runTime: number }, b: { runTime: number }) =>
            a.runTime - b.runTime
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
          dataIndex="dateTime"
          key="dateTime"
          render={(dateTime) => (
            <>
              <Tag color="blue">{dateTime.date}</Tag>
              <Tag color="green">{dateTime.time}</Tag>
            </>
          )}
        />
      </Table>
    </>
  );
}
