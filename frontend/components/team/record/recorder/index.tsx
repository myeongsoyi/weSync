'use client';
// 사용하는 라이브러리 및 컴포넌트 import
import { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Dropdown, Tooltip } from 'antd';
import {
  DeleteOutlined,
  PauseCircleFilled,
  UnorderedListOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Image from 'next/image';
import { useRecordAudioStore } from '@/store/recordAudioStore';
import { postSaveRecord } from '@/services/team/record';
import Swal from 'sweetalert2';

interface AudioBlobUrl {
  blob: Blob;
  url: string;
  timestamp: string;
}

export default function RecordAudioController() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordings, setRecordings] = useState<AudioBlobUrl[]>([]);
  const [items, setItems] = useState<MenuProps['items']>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const [startAt, setStartAt] = useState<number>(0);
  const [endAt, setEndAt] = useState<number>(0);

  // const { tracks, isPlaying, isRecording, setIsRecording, setTracks, toggleTrack, setIsPlaying } =
  const { isRecording, setIsRecording, currentTime, scoreId } =
    useRecordAudioStore();

  useEffect(() => {
    async function getMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      let chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp4' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toLocaleString(); // 현재 시간을 로컬 형식으로 저장
        chunks = [];
        setRecordings((prev) => [...prev, { blob, url, timestamp }]);
      };
    }

    getMedia();
  }, []);

  useEffect(() => {
    const newItems =
      recordings.length === 0
        ? [
            {
              key: 1,
              label: <p className='p-1'>아직 녹음이 없습니다.</p>,
            },
          ]
        : recordings.map((recording, index) => ({
            key: index,
            label: (
              <div
                className={styles.record__item}
                onClick={(e) => e.stopPropagation()}
              >
                <audio src={recording.url} controls />
                <div className={styles.record__button}>
                  <span className={styles.record__timestamp}>
                    {recording.timestamp}
                  </span>
                  <Tooltip title="My Space에 업로드" placement="top">
                    <Button
                      type="text"
                      onClick={() =>
                        uploadAudio(recording.blob, recording.timestamp)
                      }
                    >
                      <UploadOutlined
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          margin: 'auto',
                        }}
                      />
                    </Button>
                  </Tooltip>
                  <Tooltip title="삭제" placement="top">
                    <Button
                      type="text"
                      onClick={() => deleteAudio(recording.blob)}
                    >
                      <DeleteOutlined
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          margin: 'auto',
                          color: 'red',
                        }}
                      />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ),
          }));
    setItems(newItems);
  }, [recordings]);

  const startRecording = () => {
    mediaRecorder?.start();
    setIsRecording(true);
    setStartAt(currentTime);
    const startTime = Date.now();
    const newTimer = setInterval(() => {
      setRecordingTime(Date.now() - startTime);
    }, 1000);
    setTimer(newTimer);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    setEndAt(currentTime);
    if (timer) clearInterval(timer);
    setRecordingTime(0);
  };

  const uploadAudio = async (blob: Blob, timestamp: string) => {
    Swal.fire({
      title: '녹음 파일 업로드',
      text: '녹음 파일을 My Space에 업로드하시겠습니까?',
      icon: 'question',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: '업로드',
      cancelButtonText: '취소',
      inputValue: timestamp,
      inputValidator: (value) => {
        if (!value) {
          return '파일 이름을 입력해주세요.';
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const file = new File([blob], `${result.value}.mp4`, {
          type: blob.type,
        });
        const response = await postSaveRecord(
          scoreId,
          result.value,
          startAt,
          endAt,
          file,
        );
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: '녹음 파일 업로드 성공',
            text: '작업이 완료될 때까지 잠시만 기다려주세요.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '녹음 파일 업로드 실패',
            text:
              response.error?.errorMessage ?? '업로드 중 오류가 발생했습니다.',
          });
          console.error(response);
        }
      }
    });
  };

  const deleteAudio = (blob: Blob) => {
    const newRecordings = recordings.filter(
      (recording) => recording.blob !== blob,
    );
    setRecordings(newRecordings);
  };

  // mm:ss 포맷으로 시간 변환
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.recorder}>
        <span className={styles.timer}>
          {isRecording ? formatTime(recordingTime) : '--:--'}
        </span>
        <Button
          type="text"
          onClick={isRecording ? stopRecording : startRecording}
          className={styles.customButton}
        >
          {isRecording ? (
            <div className={styles.buttonIconContainer}>
              <PauseCircleFilled style={{ fontSize: 43, color: '#EBEBED' }} />
            </div>
          ) : (
            <div className={styles.buttonIconContainer}>
              <Image
                alt="녹음정지"
                src={'/svgs/recordbutton.svg'}
                width={800}
                height={800}
                style={{ width: 50, height: 50 }}
              />
            </div>
          )}
        </Button>
        <Dropdown
          overlayClassName={`recordmodal ${styles.dropdownMenu}`}
          menu={{ items }}
          trigger={['click']}
          placement="topLeft"
          // disabled={recordings.length === 0}
        >
          <Button
            style={{
              display: 'flex',
              width: 'auto',
              color: 'white',
              backgroundColor: '#656565',
              // borderColor: '#656565',
              margin: 'auto',
            }}
          >
            <UnorderedListOutlined style={{ fontSize: 20, margin: 'auto' }} />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
