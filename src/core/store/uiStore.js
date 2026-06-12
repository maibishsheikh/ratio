import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set, get) => ({
      soundMuted:     false,
      subtitlesOn:    true,
      dyslexiaMode:   false,
      reducedMotion:  false,
      theme:          'default',

      toggleMute:       () => set((s) => ({ soundMuted: !s.soundMuted })),
      toggleSubtitles:  () => set((s) => ({ subtitlesOn: !s.subtitlesOn })),
      toggleDyslexia:   () => set((s) => ({ dyslexiaMode: !s.dyslexiaMode })),
      toggleMotion:     () => set((s) => ({ reducedMotion: !s.reducedMotion })),
      setTheme:         (theme) => set({ theme }),
    }),
    { name: 'ratiocraft-ui-v2' }
  )
);
