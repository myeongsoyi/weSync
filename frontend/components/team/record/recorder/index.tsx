// 사용하는 라이브러리 및 컴포넌트 import
import { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Dropdown } from 'antd';
import { PauseCircleFilled, PlayCircleFilled, UnorderedListOutlined, UploadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface AudioBlobUrl {
  blob: Blob;
  url: string;
  timestamp: string;
}

export default function RecordAudioController() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordings, setRecordings] = useState<AudioBlobUrl[]>([]);
  const [items, setItems] = useState<MenuProps['items']>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

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
        <div className={styles.record__item}>
          <audio src={recording.url} controls />
          <div className={styles.record__button}>
            <span>{recording.timestamp}</span>
            <Button type='text' onClick={() => uploadAudio(recording.blob)}><UploadOutlined style={{ fontSize: 24, margin: 'auto' }}/></Button>
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
  };

  // mm:ss 포맷으로 시간 변환
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.recorder}>
      <span className={styles.timer}>{isRecording ? formatTime(recordingTime) : '--:--'}</span>
      <Button
        type="text"
        onClick={isRecording ? stopRecording : startRecording}
        style={{ height: 'auto', width: 'auto' }}
      >
        {isRecording ? (
          <PauseCircleFilled style={{ fontSize: 35, color: 'orange' }} />
        ) : (
          <PlayCircleFilled style={{ fontSize: 35, color: 'lightgray' }} />
        )}
      </Button>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="topLeft"
        disabled={recordings.length === 0}
      >
        <Button style={{ display: 'flex', width: 'auto', backgroundColor: 'lightgray', margin: 'auto' }}>
          <UnorderedListOutlined style={{ fontSize: 20, margin: 'auto' }} />
        </Button>
      </Dropdown>
    </div>
  );
}
