'use client';

// import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';
import { Table, Tag, Button, Tooltip, message } from 'antd';
import { useSingleAudioStore } from '@/store/singleAudioStore';
import {
  CloseCircleOutlined,
  CommentOutlined,
  DownloadOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTeamRecordsMy } from '@/services/team/workspace';
import { RecordMy } from '@/types/record';
import CommentModal from '../../comment';
import Swal from 'sweetalert2';
import { deleteRecord, putChangeRecordPublic } from '@/services/team/record';

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

  function togglePlay(recordId: number, recordUrl: string) {
    if (currentId !== recordId) {
      setCurrentTrack(recordUrl, recordId);
    } else {
      togglePlayPause();
    }
  }

  const fetchRecords = async () => {
    const response = await getTeamRecordsMy(teamId as string);
    if (response.success) {
      setSuccess(response.success);
      setRecords(response.data);
      setError(response.error);
    } else {
      setSuccess(response.success);
      setError(response.error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const { Column } = Table;

  // 포지션 필터링 임시 함수
  // const positionFilters = Array.from(
  //   new Set(records?.map((record) => record.positionName || ''))
  // ).map((position) => ({
  //   text: position || '미정',
  //   value: position,
  // }));

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [selectedSongTitle, setSelectedSongTitle] = useState<string>('');

  const handleOpenCommentModal = (songId: number, songName: string) => {
    setSelectedSongId(songId);
    setSelectedSongTitle(songName);
    setCommentModalVisible(true);
  };

  const handlePublic = async (recordId: number, isPublic: boolean) => {
    Swal.fire({
      title: isPublic ? '공유를 취소합니다.' : '공유를 시작합니다.',
      text: isPublic
        ? '다른 사용자가 이 녹음을 볼 수 없습니다.'
        : '다른 사용자가 이 녹음을 볼 수 있습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await putChangeRecordPublic(recordId);
          if (response.success) {
            const msg = isPublic
              ? '공유가 취소되었습니다.'
              : '공유가 시작되었습니다.';
            message.success(msg);
            fetchRecords();
          } else {
            message.error(response.error?.errorMessage);
          }
        } catch (err) {
          message.error('공유 상태 변경에 실패했습니다.');
        }
      }
    });
  };

  const handleDelete = async (recordId: number, title: string | null) => {
    Swal.fire({
      title: '이 녹음을 삭제합니다.',
      text: title ?? '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'grey',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteRecord(recordId);
          if (response.success) {
            message.success('녹음이 삭제되었습니다.');
            fetchRecords();
          } else {
            // message.error(response.error?.errorMessage);
            message.error('녹음 삭제에 실패했습니다.');
          }
        } catch (err) {
          message.error('녹음 삭제에 실패했습니다.');
        }
      }
    });
  };

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
      <Table dataSource={records} pagination={false} rowKey="recordId">
        <Column
          title=""
          dataIndex="recordId"
          key="recordId"
          render={(recordId, record: RecordMy['data'][number]) => (
            <div className="flex">
              <Button
                onClick={() => togglePlay(recordId, record.recordUrl)}
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
          title="포지션"
          dataIndex="positionName"
          key="포지션"
          // sorter={(a: { positionName: RecordMy['data'][number]['positionName'] }, b: { positionName: RecordMy['data'][number]['positionName'] }) =>
          //   (a.positionName || '').localeCompare(b.positionName || '')
          // }
          // filters={positionFilters}
          // onFilter={(value, record) => (record.positionName || '') === value}
          render={(positionName, record: RecordMy['data'][number]) => (
            <>
              <Tag
                style={{
                  border: `1px solid #${record?.colorCode}`,
                  color: `#${record?.colorCode}`,
                  margin: '4px 0',
                }}
              >
                {positionName || '미정'}
              </Tag>
            </>
          )}
        />
        <Column title="제목" dataIndex="title" key="title" />
        <Column
          title="일시"
          dataIndex="createdAt"
          key="createdAt"
          render={(createdAt) => {
            const date = new Date(createdAt);
            const formattedDate = date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: 'Asia/Seoul',
            });
            const formattedTime = date.toLocaleTimeString('ko-KR', {
              hour: 'numeric',
              minute: '2-digit',
              // second: '2-digit',
              timeZone: 'Asia/Seoul',
            });
            return (
              <>
                <Tag color="blue">{formattedDate}</Tag>
                <br />
                <Tag color="green">{formattedTime}</Tag>
              </>
            );
          }}
        />
        <Column
        title="비고"
        dataIndex="public"
        key="public"
        render={(isPublic, record: RecordMy['data'][number]) => {
          return (
            <div className="flex">
              <Tooltip
                placement="top"
                title={isPublic ? '공유 취소' : '공유하기'}
                arrow={true}
              >
                <Button
                  type="text"
                  onClick={() => handlePublic(record.recordId, isPublic)}
                >
                  {isPublic ? (
                    <DownloadOutlined
                      style={{
                        color: 'green',
                        fontSize: '1.2rem',
                        margin: 'auto',
                      }}
                    />
                  ) : (
                    <UploadOutlined
                      style={{ color: 'blue', fontSize: '1.2rem' }}
                    />
                  )}
                </Button>
              </Tooltip>
              <Tooltip placement="top" title={'삭제'} arrow={true}>
                <Button
                  type="text"
                  onClick={() => handleDelete(record.recordId, record.title)}
                >
                  <CloseCircleOutlined
                    style={{ color: 'red', fontSize: '1.2rem' }}
                  />
                </Button>
              </Tooltip>
            </div>
          );
        }}
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
    </>
  );
}
