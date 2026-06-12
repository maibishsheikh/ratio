import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CONCEPTS_PER_WORLD = {
  1: ['RATIO_DEFINITION','RATIO_SIMPLIFY','EQUIVALENT_RATIO'],
  2: ['UNIT_RATE','RATE_COMPARISON','PROPORTION_CHECK'],
  3: ['PERCENT_OF','PERCENT_CHANGE','PROFIT_LOSS_DISCOUNT','SIMPLE_INTEREST'],
};

export const getConceptsForWorld = (worldId) => CONCEPTS_PER_WORLD[worldId] || [];

const LEVEL_THRESHOLDS = [0,200,500,900,1400,2000,2700,3500,4400,5400];

const getLevel = (xp) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

const initialState = {
  currentWorldId:   1,
  currentPhase:     'wonder',
  completedPhases:  { 1: [], 2: [], 3: [] },
  xp:               0,
  level:            1,
  coins:            0,
  gems:             0,
  stars:            { 1: 0, 2: 0, 3: 0 },
  badges:           [],
  mastery:          {},
  stats: {
    world1Completed:  false,
    world2Completed:  false,
    world3Completed:  false,
    allWorldsComplete:false,
    bossesWithoutFail: 0,
    speedwayTopScore:  false,
    timedChallengeMax: 0,
    maxDailyStreak:    0,
    currentStreak:     0,
    lastLoginDate:     null,
    totalQuestionsAnswered: 0,
    totalCorrect:      0,
  },
};

export const useProgressStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Navigation ────────────────────────────────────────────
      setPhase: (phase) => set({ currentPhase: phase }),
      setWorld: (worldId) => set({ currentWorldId: worldId, currentPhase: 'wonder' }),

      // ── Phase completion ─────────────────────────────────────
      completePhase: (worldId, phase) => set((state) => {
        const worldPhases = state.completedPhases[worldId] || [];
        if (worldPhases.includes(phase)) return state;
        const updated = { ...state.completedPhases, [worldId]: [...worldPhases, phase] };
        const allPhaseDone = ['wonder','story','simulate','play','reflect'].every(p => updated[worldId]?.includes(p));

        const statsPatch = {};
        if (allPhaseDone) {
          statsPatch[`world${worldId}Completed`] = true;
          if (worldId === 3) statsPatch.allWorldsComplete = true;
        }

        return {
          completedPhases: updated,
          stats: { ...state.stats, ...statsPatch },
        };
      }),

      // ── Economy ──────────────────────────────────────────────
      addXP: (amount) => set((state) => {
        const newXP = Math.max(0, state.xp + amount);
        return { xp: newXP, level: getLevel(newXP) };
      }),

      addCoins: (amount) => set((state) => ({
        coins: Math.max(0, state.coins + amount),
      })),

      addGems: (amount) => set((state) => ({
        gems: Math.max(0, state.gems + amount),
      })),

      setStars: (worldId, stars) => set((state) => ({
        stars: { ...state.stars, [worldId]: Math.max(state.stars[worldId] || 0, stars) },
      })),

      // ── Badges ───────────────────────────────────────────────
      unlockBadge: (badgeId) => set((state) => ({
        badges: state.badges.includes(badgeId) ? state.badges : [...state.badges, badgeId],
      })),

      // ── Mastery ──────────────────────────────────────────────
      updateMastery: (conceptTag, delta) => set((state) => ({
        mastery: {
          ...state.mastery,
          [conceptTag]: Math.min(100, Math.max(0, (state.mastery[conceptTag] || 0) + delta)),
        },
      })),

      setMastery: (conceptTag, value) => set((state) => ({
        mastery: { ...state.mastery, [conceptTag]: Math.min(100, Math.max(0, value)) },
      })),

      // ── Stats ────────────────────────────────────────────────
      recordAnswer: (correct) => set((state) => ({
        stats: {
          ...state.stats,
          totalQuestionsAnswered: state.stats.totalQuestionsAnswered + 1,
          totalCorrect: state.stats.totalCorrect + (correct ? 1 : 0),
        },
      })),

      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const last  = state.stats.lastLoginDate;
        const isConsecutive = last && (new Date(today) - new Date(last)) / 86400000 <= 1;
        const newStreak = isConsecutive ? state.stats.currentStreak + 1 : 1;
        return {
          stats: {
            ...state.stats,
            currentStreak:  newStreak,
            maxDailyStreak: Math.max(state.stats.maxDailyStreak, newStreak),
            lastLoginDate:  today,
          },
        };
      }),

      // ── Reset ────────────────────────────────────────────────
      resetProgress: () => set({ ...initialState }),
      resetWorld: (worldId) => set((state) => ({
        currentWorldId: worldId,
        currentPhase: 'wonder',
        completedPhases: { ...state.completedPhases, [worldId]: [] },
      })),
    }),
    { name: 'ratiocraft-progress-v2', version: 1 }
  )
);

// Expose getter for non-hook contexts
useProgressStore.getConceptsForWorld = getConceptsForWorld;
