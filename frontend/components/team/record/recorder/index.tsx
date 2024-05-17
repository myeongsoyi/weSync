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

  // const { tracks, isPlaying, isRecording, setIsRecording, setTracks, toggleTrack, setIsPlaying } =
  const { isRecording, setIsRecording } =
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
    const newItems = recordings.map((recording, index) => ({
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
              <Button type="text" onClick={() => uploadAudio(recording.blob)}>
                <UploadOutlined
                  style={{ fontSize: 20, fontWeight: 'bold', margin: 'auto' }}
                />
              </Button>
            </Tooltip>
            <Tooltip title="삭제" placement="top">
              <Button type="text" onClick={() => uploadAudio(recording.blob)}>
              <DeleteOutlined
                  style={{ fontSize: 20, fontWeight: 'bold', margin: 'auto', color: 'red' }}
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
    const startTime = Date.now();
    const newTimer = setInterval(() => {
      setRecordingTime(Date.now() - startTime);
    }, 1000);
    setTimer(newTimer);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    if (timer) clearInterval(timer);
    setRecordingTime(0);
  };

  const uploadAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audioFile', blob);
    const response = await fetch('YOUR_SERVER_ENDPOINT', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    // return data;
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
          disabled={recordings.length === 0}
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
