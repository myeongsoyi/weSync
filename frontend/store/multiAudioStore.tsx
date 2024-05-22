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
  toggleTrack: (id: number, url: string, name: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useMultiAudioStore = create<TrackState>((set, get) => ({
  tracks: [],
  isPlaying: false,
  toggleTrack: (id: number, url: string, name: string) => {
    // tracks에 id가 있는지 확인하고 있으면 제거하고 없으면 추가
    const newTracks = get().tracks.some(track => track.id === id)
      ? get().tracks.filter(track => track.id !== id)
      : [...get().tracks, { id, url, name, playing: false, volume: 0.5 }];
    set({ tracks: newTracks });
  },
  setIsPlaying: isPlaying => {
    set({ isPlaying });
  },
}));
