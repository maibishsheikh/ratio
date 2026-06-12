// useGamification.js
// Convenience hook that wraps XP, badges, and streak logic.

import { useProgressStore } from '../store/progressStore';
import { XP_EVENTS, getLevel } from './xpEngine';
import { checkBadges } from './badgeEngine';

export function useGamification() {
  const {
    xp, level, coins, gems, badges, stats, dailyStreak,
    addXP, addCoins, addGems, unlockBadge, updateStats,
  } = useProgressStore();

  /**
   * Awards XP for a specific event type, applying streak bonuses where relevant.
   * @param {string} eventKey Key from XP_EVENTS
   * @param {number} overrideAmount Optional manual override
   */
  const awardXP = (eventKey, overrideAmount = null) => {
    const amount = overrideAmount ?? XP_EVENTS[eventKey] ?? 0;
    if (amount > 0) addXP(amount);
    return amount;
  };

  /**
   * Checks and awards any newly earned badges based on current stats.
   * @returns {Array} Array of newly awarded badge IDs
   */
  const grantNewBadges = () => {
    const newBadges = checkBadges(stats, badges);
    newBadges.forEach((id) => unlockBadge(id));
    return newBadges;
  };

  /**
   * Records a streak bonus if a milestone is hit.
   * @param {number} streakCount Current correct-answer streak
   */
  const checkStreakBonus = (streakCount) => {
    if (streakCount === 10) {
      addXP(XP_EVENTS.STREAK_BONUS_10);
      addCoins(10);
    } else if (streakCount === 5) {
      addXP(XP_EVENTS.STREAK_BONUS_5);
      addCoins(5);
    }
  };

  return {
    xp,
    level,
    coins,
    gems,
    badges,
    stats,
    dailyStreak,
    awardXP,
    addCoins,
    addGems,
    grantNewBadges,
    checkStreakBonus,
    currentLevel: getLevel(xp),
  };
}
