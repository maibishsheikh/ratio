// useAnalytics.js
// Analytics wrapper hook. In production this sends to PostHog.
// In development it logs to console and optionally to the local API stub.

import { EVENTS } from './events';

const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const IS_DEV = import.meta.env.DEV;

/**
 * Sends an event to the analytics backend.
 * Falls back to console.log in development.
 */
async function sendEvent(eventName, properties = {}) {
  const payload = {
    event: eventName,
    properties: {
      ...properties,
      session_id: SESSION_ID,
      timestamp: Date.now(),
      url: window.location.href,
    },
  };

  if (IS_DEV) {
    console.log('[Analytics]', payload.event, payload.properties);
  }

  // Post to backend analytics stub (fire-and-forget)
  try {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {}); // silently ignore network failures
  } catch {
    // Ignore — analytics must never crash the app
  }
}

/**
 * useAnalytics hook.
 * Returns a `track` function and pre-bound event helpers.
 */
export function useAnalytics() {
  const track = (eventName, properties = {}) => {
    sendEvent(eventName, properties);
  };

  return {
    track,
    trackPhaseStarted:         (phase, world) => track(EVENTS.PHASE_STARTED, { phase, world }),
    trackPhaseCompleted:       (phase, world, duration_ms, xp_earned) => track(EVENTS.PHASE_COMPLETED, { phase, world, duration_ms, xp_earned }),
    trackQuestionAnswered:     (props) => track(EVENTS.QUESTION_ANSWERED, props),
    trackSimInteraction:       (sim_id, action_type, value) => track(EVENTS.SIMULATION_INTERACTION, { sim_id, action_type, value }),
    trackSimDiscovery:         (sim_id, concept_tag, interactions_before) => track(EVENTS.SIMULATION_DISCOVERY, { sim_id, concept_tag, interactions_before }),
    trackBossBattleResult:     (world, won, score, time_ms) => track(EVENTS.BOSS_BATTLE_RESULT, { world, won, score, time_ms }),
    trackAudioSkipped:         (narration_id, skip_time_ms) => track(EVENTS.AUDIO_SKIPPED, { narration_id, skip_time_ms }),
    trackWorksheetDownloaded:  (type, world) => track(EVENTS.WORKSHEET_DOWNLOADED, { type, world }),
    trackBadgeEarned:          (badge_id) => track(EVENTS.BADGE_EARNED, { badge_id }),
    trackLevelUp:              (new_level, total_xp) => track(EVENTS.LEVEL_UP, { new_level, total_xp }),
  };
}
