// xpEngine.js
// XP event definitions and level calculation.

export const XP_EVENTS = {
  QUESTION_CORRECT_FIRST:   10,
  QUESTION_CORRECT_RETRY:    5,
  PHASE_COMPLETE:           50,
  SIMULATION_COMPLETE:      30,
  BOSS_DEFEAT:             100,
  STREAK_BONUS_5:           20,  // 5-question streak
  STREAK_BONUS_10:          50,  // 10-question streak
  WORKSHEET_DOWNLOAD:       15,
  WORLD_COMPLETE:          200,
  DAILY_LOGIN:              10,
};

// Level N requires N * 200 total XP
export const getLevel = (xp) => Math.floor(xp / 200) + 1;

// XP needed to reach next level
export const getXPToNextLevel = (xp) => {
  const currentLevel = getLevel(xp);
  return currentLevel * 200 - xp;
};

// XP progress within the current level (0 to 200)
export const getXPInLevel = (xp) => xp % 200;

// XP progress as a percentage within current level
export const getLevelProgress = (xp) => (getXPInLevel(xp) / 200) * 100;
