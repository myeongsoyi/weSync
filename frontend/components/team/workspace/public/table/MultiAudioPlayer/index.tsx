'use client';

// import React, { useEffect, useRef, useState } from 'react';
import React, { useEffect, useRef } from 'react';
import { useMultiAudioStore } from '@/store/multiAudioStore';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function MultiAudioPlayer() {
  const { tracks, togglePlayPause, setVolume } = useMultiAudioStore();
  const audioRef = useRef<AudioPlayer>(null);

  return (
    <div>
      {tracks.map(track => (
        <div key={track.id} style={{ marginBottom: '20px' }}>
          <AudioPlayer
            src={track.url}
            autoPlay={track.playing}
            onPlay={() => togglePlayPause(track.id)}
            onPause={() => togglePlayPause(track.id)}
            // onVolumeChange={(e) => setVolume(track.id, e.target.volume)}
            style={{ width: '100%' }}
          />
        </div>
      ))}
    </div>
  );
}
