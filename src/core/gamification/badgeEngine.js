// badgeEngine.js
// Badge condition definitions and checking logic.

export const BADGE_CONDITIONS = {
  RATIO_ROOKIE:     (stats) => stats.world1Completed,
  RATE_RACER:       (stats) => stats.speedwayTopScore,
  PROPORTION_PRO:   (stats) => stats.bossesWithoutFail >= 3,
  PERCENT_MAESTRO:  (stats) => stats.timedChallengeMax >= 100,
  MARKET_CHAMPION:  (stats) => stats.allWorldsComplete,
  STREAK_LEGEND:    (stats) => stats.maxDailyStreak >= 7,
  SPEED_DEMON:      (stats) => stats.speedDemonAchieved,
};

export const BADGE_META = {
  RATIO_ROOKIE:     { label: 'Ratio Rookie',       emoji: '🧮', desc: 'Complete World 1', color: 'from-teal-400 to-teal-600' },
  RATE_RACER:       { label: 'Rate Racer',          emoji: '🏎️', desc: 'Top score at Rate Speedway', color: 'from-violet-400 to-violet-600' },
  PROPORTION_PRO:   { label: 'Proportion Pro',      emoji: '⚖️', desc: 'Pass all 3 Boss Battles without failing', color: 'from-blue-400 to-blue-600' },
  PERCENT_MAESTRO:  { label: 'Percentage Maestro',  emoji: '💯', desc: '100% on a Timed Challenge', color: 'from-amber-400 to-amber-600' },
  MARKET_CHAMPION:  { label: 'Market Champion',     emoji: '🏆', desc: 'Complete all 3 Worlds', color: 'from-yellow-400 to-orange-500' },
  STREAK_LEGEND:    { label: 'Streak Legend',        emoji: '🔥', desc: 'Achieve a 7-day learning streak', color: 'from-red-400 to-orange-500' },
  SPEED_DEMON:      { label: 'Speed Demon',          emoji: '⚡', desc: 'Complete a Timed Challenge in under 3 minutes with 90%+ accuracy', color: 'from-cyan-400 to-blue-600' },
};

/**
 * Checks which new badges the player has earned.
 * @param {Object} stats Current player stats
 * @param {Array} earnedBadges Array of already-earned badge IDs
 * @returns {Array} Array of newly earned badge IDs
 */
export const checkBadges = (stats, earnedBadges = []) => {
  return Object.entries(BADGE_CONDITIONS)
    .filter(([id, check]) => !earnedBadges.includes(id) && check(stats))
    .map(([id]) => id);
};
