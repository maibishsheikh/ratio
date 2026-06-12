// sessionStore.js
// Tracks the current session's ephemeral data (not persisted across reloads).

import { create } from 'zustand';

export const useSessionStore = create((set, get) => ({
  // Session timing
  sessionStartTime: Date.now(),
  lastActivityTime: Date.now(),

  // Current session stats
  questionsAnswered: 0,
  correctThisSession: 0,
  xpEarnedThisSession: 0,
  coinsEarnedThisSession: 0,

  // Current streak (resets on wrong answer)
  currentStreak: 0,
  maxStreakThisSession: 0,

  // Phase timing
  phaseStartTime: null,

  // Actions
  recordCorrect: () =>
    set((state) => {
      const newStreak = state.currentStreak + 1;
      return {
        questionsAnswered: state.questionsAnswered + 1,
        correctThisSession: state.correctThisSession + 1,
        currentStreak: newStreak,
        maxStreakThisSession: Math.max(state.maxStreakThisSession, newStreak),
        lastActivityTime: Date.now(),
      };
    }),

  recordWrong: () =>
    set((state) => ({
      questionsAnswered: state.questionsAnswered + 1,
      currentStreak: 0,
      lastActivityTime: Date.now(),
    })),

  addSessionXP: (amount) =>
    set((state) => ({ xpEarnedThisSession: state.xpEarnedThisSession + amount })),

  addSessionCoins: (amount) =>
    set((state) => ({ coinsEarnedThisSession: state.coinsEarnedThisSession + amount })),

  startPhase: () => set({ phaseStartTime: Date.now() }),

  getPhaseDuration: () => {
    const start = get().phaseStartTime;
    return start ? Date.now() - start : 0;
  },

  getSessionDuration: () => Date.now() - get().sessionStartTime,

  getAccuracy: () => {
    const { questionsAnswered, correctThisSession } = get();
    if (questionsAnswered === 0) return 0;
    return Math.round((correctThisSession / questionsAnswered) * 100);
  },

  resetSession: () =>
    set({
      sessionStartTime: Date.now(),
      lastActivityTime: Date.now(),
      questionsAnswered: 0,
      correctThisSession: 0,
      xpEarnedThisSession: 0,
      coinsEarnedThisSession: 0,
      currentStreak: 0,
      maxStreakThisSession: 0,
      phaseStartTime: null,
    }),
}));
