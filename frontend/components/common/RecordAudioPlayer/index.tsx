'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRecordAudioStore } from '@/store/recordAudioStore';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Recorder from '@/components/team/record/recorder';

interface ITrack {
  id: number;
  url: string;
  name: string;
  playing: boolean;
  volume: number;
}

export default function RecordAudioPlayer() {
  const [longestTrack, setLongestTrack] = useState<ITrack>();
  const [volume, setVolume] = useState<number>(0.5);

  const {
    tracks,
    isPlaying,
    // isRecording,
    // toggleTrack,
    setIsPlaying,
    setCurrentTime,
  } = useRecordAudioStore();

  const playersRef = useRef<{ [key: number]: HTMLAudioElement }>({});

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
        audio.volume = volume;
        audio.currentTime = 0;
        playersRef.current[track.id] = audio;
      }
    });
  }, [tracks]);

  const handlePlayPause = (isPlaying: boolean) => {
    setIsPlaying(isPlaying);
    Object.values(playersRef.current).forEach((audio) => {
      if (
        isPlaying &&
        tracks.find((track) => track.url === audio.src) &&
        longestTrack?.url !== audio.src
      ) {
        audio.play();
      } else {
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
    Object.values(playersRef.current).forEach((audio) => {
      audio.currentTime = time;
      if (longestTrack?.url !== audio.src) {
        if (isPlaying) {
          audio.play();
        } else {
          audio.pause();
        }
      }
    });
  };

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
          // header={headerTracks}
          style={{ height: '100%', display: 'block', minHeight: '100px' }}
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
            // header={headerTracks}
            style={
              track.id === longestTrack?.id
                ? { height: '100%', display: 'block', minHeight: '100px' }
                : { height: '100%', display: 'none' }
            }
            onListen={(e) =>
              setCurrentTime((e.target as HTMLAudioElement).currentTime)
            }
          />
        ))}
      </div>
    </div>
  );
}
