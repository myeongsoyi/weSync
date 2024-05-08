'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Dropdown, Space } from 'antd';
import {
  PauseCircleFilled,
  PlayCircleFilled,
  UnorderedListOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface AudioBlobUrl {
  blob: Blob;
  url: string;
  timestamp: string;
}

export default function RecordAudioController() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordings, setRecordings] = useState<AudioBlobUrl[]>([]);
  const [items, setItems] = useState<MenuProps['items']>([]);

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
        const timestamp = new Date().toLocaleString(); // 현재 시간을 ISO 형식으로 저장
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
          <Button type='text' onClick={() => uploadAudio(recording.blob)}><UploadOutlined style={{ fontSize: 18, margin: 'auto' }}/></Button>
          </div>
        </div>
      ),
    }));
    setItems(newItems);
  }, [recordings]);

  const startRecording = () => {
    mediaRecorder?.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  const uploadAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audioFile', blob);

    // 업로드 URL을 'YOUR_SERVER_ENDPOINT'에 맞게 수정하세요.
    const response = await fetch('YOUR_SERVER_ENDPOINT', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className={styles.recorder}>
      <Button
        type="text"
        onClick={isRecording ? stopRecording : startRecording}
        style={{ height: 'auto', width: 'auto' }}
      >
        {isRecording ? (
          <PauseCircleFilled style={{ fontSize: 35, color: 'crimson' }} />
        ) : (
          <PlayCircleFilled style={{ fontSize: 35, color: 'lightgray' }} />
        )}
      </Button>
      {/* <ul>
        {recordings.map((recording, index) => (
          <li key={index}>
            <audio src={recording.url} controls />
            <Button onClick={() => uploadAudio(recording.blob)}>Upload</Button>
            <p>{recording.timestamp}</p>
          </li>
        ))}
      </ul> */}
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="topLeft"
        disabled={recordings.length === 0}
      >
        <Button style={{ display: 'flex', width: 'auto', backgroundColor: 'lightgray' }}>
          <UnorderedListOutlined style={{ fontSize: 20, margin: 'auto' }} />
        </Button>
      </Dropdown>
    </div>
  );
}
