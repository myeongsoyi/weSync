// store/multiAudioStore.ts
import {create} from 'zustand';

interface TrackState {
  tracks: Array<{
    id: number;
    url: string;
    name: string;
    playing: boolean;
    volume: number;
  }>;
  isPlaying: boolean;
  isRecording: boolean;
  isPlayable: boolean;
  scoreIndex: number;
  currentTime: number;
  toggleTrack: (id: number, url: string, name: string) => void;
  togglePlayPauseOne: (id: number) => void;
  setVolume: (id: number, volume: number) => void;
  playAll: () => void;
  pauseAll: () => void;
  setVolumeAll: (volume: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsPlayable: (isPlayable: boolean) => void;
  setTracks: (tracks: Array<{
    id: number;
    url: string;
    name: string;
    playing: boolean;
    volume: number;
  }>) => void;
  setScoreIndex: (index: number) => void;
  setCurrentTime: (time : number) => void;
}

export const useRecordAudioStore = create<TrackState>((set, get) => ({
  tracks: [],
  isPlaying: false,
  isRecording: false,
  isPlayable: false,
  scoreIndex: 0,
  currentTime: 0,
  toggleTrack: (id: number, url: string, name: string) => {
    // tracks에 id가 있는지 확인하고 있으면 제거하고 없으면 추가
    const newTracks = get().tracks.some(track => track.id === id)
      ? get().tracks.filter(track => track.id !== id)
      : [...get().tracks, { id, url, name, playing: false, volume: 0.3 }];
    set({ tracks: newTracks });
  },
  togglePlayPauseOne: (id: number,) => {
    const newTracks = get().tracks.map(track =>
      track.id === id ? { ...track, playing: !track.playing } : track
    );
    set({ tracks: newTracks });
  },
  setVolume: (id, volume) => {
    const newTracks = get().tracks.map(track =>
      track.id === id ? { ...track, volume: volume } : track
    );
    set({ tracks: newTracks });
  },
  playAll: () => {
    const newTracks = get().tracks.map(track => ({ ...track, playing: true }));
    set({ tracks: newTracks });
  },
  pauseAll: () => {
    const newTracks = get().tracks.map(track => ({ ...track, playing: false }));
    set({ tracks: newTracks });
  },
  setVolumeAll: volume => {
    const newTracks = get().tracks.map(track => ({ ...track, volume }));
    set({ tracks: newTracks });
  },
  setIsPlaying: isPlaying => {
    set({ isPlaying });
  },
  setIsRecording: isRecording => {
    set({ isRecording });
  },
  setIsPlayable: isPlayable => {
    set({ isPlayable });
  },
  setScoreIndex: index => {
    set({ scoreIndex: index });
  },
  setCurrentTime: time => {
    set({ currentTime: time });
  },
  setTracks: tracks => {
    set({ tracks: tracks });
  },
}));
