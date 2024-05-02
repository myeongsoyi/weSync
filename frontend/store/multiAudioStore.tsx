// store/multiAudioStore.ts
import {create} from 'zustand';

interface TrackState {
  tracks: Array<{
    id: number;
    url: string;
    playing: boolean;
    volume: number;
  }>;
  togglePlayPause: (id: number) => void;
  setVolume: (id: number, volume: number) => void;
  addTrack: (id: number, url: string) => void;
  removeTrack: (id: number) => void;
}

export const useMultiAudioStore = create<TrackState>((set, get) => ({
  tracks: [],
  togglePlayPause: (id) => {
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
  addTrack: (id, url) => {
    const newTrack = { id, url, playing: false, volume: 0.5 };
    set(state => ({ tracks: [...state.tracks, newTrack] }));
  },
  removeTrack: (id) => {
    const newTracks = get().tracks.filter(track => track.id !== id);
    set({ tracks: newTracks });
  }
}));
