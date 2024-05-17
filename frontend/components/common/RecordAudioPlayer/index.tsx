'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRecordAudioStore } from '@/store/recordAudioStore';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Button } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import Recorder from '@/components/team/record/recorder';

interface ITrack {
  id: number;
  url: string;
  name: string;
  playing: boolean;
  volume: number;
}

export default function MultiAudioPlayer() {
  const [longestTrack, setLongestTrack] = useState<ITrack>();
  const [volume, setVolume] = useState<number>(0.3);
  const [count, setCount] = useState<boolean>(false);

  const {
    tracks,
    isPlaying,
    isRecording,
    setIsRecording,
    setTracks,
    toggleTrack,
    setIsPlaying,
  } = useRecordAudioStore();

  const playersRef = useRef<{ [key: number]: HTMLAudioElement }>({});

  useEffect(() => {
    setTracks([
      // { id: number; url: string; name: string; playing: boolean; volume: number; }
      {
        id: 1,
        name: 'track1',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        playing: false,
        volume: 0.3,
      },
      {
        id: 2,
        name: 'track2',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        playing: false,
        volume: 0.3,
      },
    ]);
  }, [count]);

  useEffect(() => {
    let maxDuration = 0;
    let newLongestTrack: ITrack | undefined = longestTrack;

    // 오디오 객체 관리
    Object.keys(playersRef.current).forEach((key) => {
      const id = parseInt(key);
      // if (!tracks.find((track) => track.id === id)) {
      //   playersRef.current[id].pause();
      //   playersRef.current[id].src = '';
      //   delete playersRef.current[id];
      // }
      playersRef.current[id].pause();
      playersRef.current[id].src = '';
      delete playersRef.current[id];
    });

    tracks.forEach((track) => {
      const audio = new Audio(track.url);
      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration > maxDuration) {
          maxDuration = audio.duration;
          newLongestTrack = track;
          setLongestTrack(newLongestTrack);
        }
      });
      if (!playersRef.current[track.id]) {
        audio.load();
        // console.log(volume);
        audio.volume = volume;
        audio.currentTime = 0;
        playersRef.current[track.id] = audio;
      }
    });
  }, [tracks]);

  const handlePlayPause = (isPlaying: boolean) => {
    setIsPlaying(isPlaying);
    setIsRecording(isPlaying);
    Object.values(playersRef.current).forEach((audio) => {
      if (
        isPlaying &&
        tracks.find((track) => track.url === audio.src.split('3000').pop()) &&
        longestTrack?.url !== audio.src.split('3000').pop()
      ) {
        // console.log('play', audio.src.split('3000').pop(), longestTrack?.url);
        audio.play();
      } else {
        // console.log('pause');
        audio.pause();
      }
    });
  };

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);
    Object.values(playersRef.current).forEach((audio) => {
      audio.volume = volume;
    });
  };

  const handleSeek = (time: number) => {
    if (isRecording) return;

    Object.values(playersRef.current).forEach((audio) => {
      audio.currentTime = time;
      if (longestTrack?.url !== audio.src.split('3000').pop()) {
        if (isPlaying) {
          audio.play();
        } else {
          audio.pause();
        }
      }
    });
  };

  const headerTracks = (
    <>
      {tracks.length === 0 ? (
        <Button onClick={() => setCount(!count)}>Reset</Button>
      ) : (
        <>
          {tracks.map((track) => (
            <Button
              key={track.id}
              onClick={() => toggleTrack(track.id, track.url, track.name)}
              disabled={isPlaying}
              style={{ marginRight: '8px' }}
            >
              <span>{track.name}</span>
              <DeleteTwoTone
                twoToneColor={'#FF1616'}
                style={{ opacity: isPlaying ? 0.4 : 1 }}
              />
            </Button>
          ))}
        </>
      )}
    </>
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '14vh',
        minHeight: '100px',
        backgroundColor: 'white',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'fit-content',
          minHeight: '100px',
          zIndex: 1000,
        }}
      >
        <Recorder />
        <AudioPlayer
          header={headerTracks}
          style={{ height: '100%', display: 'block' }}
        />
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'fit-content',
          minHeight: '100px',
          zIndex: 2000,
        }}
      >
        {tracks.map((track) => (
          <AudioPlayer
            key={track.id}
            src={track.url}
            autoPlay={false}
            preload="auto"
            onPlay={() => handlePlayPause(true)}
            onPause={() => handlePlayPause(false)}
            volume={volume}
            onVolumeChange={(e) =>
              handleVolumeChange((e.target as HTMLAudioElement).volume)
            }
            onSeeked={(e) =>
              handleSeek((e.target as HTMLAudioElement).currentTime)
            }
            header={headerTracks}
            style={
              track.id === longestTrack?.id
                ? { height: '100%', display: 'block' }
                : { height: '100%', display: 'none' }
            }
          />
        ))}
      </div>
    </div>
  );
}
