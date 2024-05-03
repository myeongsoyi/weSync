// store/audioStore.ts
import { create } from 'zustand';

interface AudioState {
  currentTrackUrl: string;
  playing: boolean;
  currentId: number | null;
  setCurrentTrack: (url: string, id: number) => void;
  stopTrack: () => void;
  togglePlayPause: () => void;
}

export const useSingleAudioStore = create<AudioState>((set) => ({
  currentTrackUrl: '',
  playing: false,
  currentId: null,
  setCurrentTrack: (url, id) =>
    set({ currentTrackUrl: url, currentId: id, playing: true }),
  stopTrack: () => set({ currentTrackUrl: '', currentId: null, playing: false }),
  togglePlayPause: () => set((state) => ({ playing: !state.playing })),
}));
