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
  scoreIndex: number;
  currentTime: number;
  scoreId: number;
  toggleTrack: (id: number, url: string, name: string) => void;
  setVolume: (id: number, volume: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsRecording: (isRecording: boolean) => void;
  setTracks: (tracks: Array<{
    id: number;
    url: string;
    name: string;
    playing: boolean;
    volume: number;
  }>) => void;
  setScoreIndex: (index: number) => void;
  setCurrentTime: (time : number) => void;
  setScoreId: (id: number) => void;
}

export const useRecordAudioStore = create<TrackState>((set, get) => ({
  tracks: [], 
  isPlaying: false,
  isRecording: false,
  scoreIndex: 0,
  currentTime: 0,
  scoreId: 0,
  toggleTrack: (id: number, url: string, name: string) => {
    // tracks에 id가 있는지 확인하고 있으면 제거하고 없으면 추가
    const newTracks = get().tracks.some(track => track.id === id)
      ? get().tracks.filter(track => track.id !== id)
      : [...get().tracks, { id, url, name, playing: false, volume: 0.5 }];
    // id로 newTracks를 정렬
    newTracks.sort((a, b) => a.id - b.id);
    set({ tracks: newTracks });
  },
  setVolume: (id, volume) => {
    const newTracks = get().tracks.map(track =>
      track.id === id ? { ...track, volume: volume } : track
    );
    set({ tracks: newTracks });
  },
  setIsPlaying: isPlaying => {
    set({ isPlaying });
  },
  setIsRecording: isRecording => {
    set({ isRecording });
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
  setScoreId: id => {
    set({ scoreId: id });
  },
}));
