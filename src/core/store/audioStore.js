/**
 * audioStore.js
 * Minimal audio state — actual audio engine lives in src/utils/audio.js
 * This store is retained for compatibility; main audio state is in uiStore.
 */
import { create } from 'zustand';

export const useAudioStore = create((set) => ({
  isPlaying:       false,
  currentSegment:  null,
  subtitleText:    '',

  setPlaying:      (v) => set({ isPlaying: v }),
  setSegment:      (s) => set({ currentSegment: s }),
  setSubtitleText: (t) => set({ subtitleText: t }),
}));
