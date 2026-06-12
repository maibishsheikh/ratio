// events.js
// Typed analytics event constants for PostHog ingestion.
// All events fire via useAnalytics.track().

export const EVENTS = {
  // Phase lifecycle
  PHASE_STARTED:    'phase_started',
  PHASE_COMPLETED:  'phase_completed',

  // Question interaction
  QUESTION_ANSWERED: 'question_answered',

  // Simulations
  SIMULATION_INTERACTION: 'simulation_interaction',
  SIMULATION_DISCOVERY:   'simulation_discovery',

  // Boss battle
  BOSS_BATTLE_RESULT: 'boss_battle_result',

  // Audio
  AUDIO_SKIPPED: 'audio_skipped',

  // Worksheets
  WORKSHEET_DOWNLOADED: 'worksheet_downloaded',

  // Gamification
  BADGE_EARNED:  'badge_earned',
  LEVEL_UP:      'level_up',
  STREAK_BONUS:  'streak_bonus',
};

/**
 * Schema for each event (for documentation purposes).
 * Properties listed are expected when calling track(eventName, properties).
 */
export const EVENT_SCHEMAS = {
  [EVENTS.PHASE_STARTED]:           { phase: 'string', world: 'number', session_id: 'string', timestamp: 'number' },
  [EVENTS.PHASE_COMPLETED]:         { phase: 'string', world: 'number', duration_ms: 'number', xp_earned: 'number' },
  [EVENTS.QUESTION_ANSWERED]:       { concept_tag: 'string', is_correct: 'boolean', attempt_number: 'number', time_taken_ms: 'number', difficulty: 'number' },
  [EVENTS.SIMULATION_INTERACTION]:  { sim_id: 'string', action_type: 'string', value: 'any' },
  [EVENTS.SIMULATION_DISCOVERY]:    { sim_id: 'string', concept_tag: 'string', interactions_before: 'number' },
  [EVENTS.BOSS_BATTLE_RESULT]:      { world: 'number', won: 'boolean', score: 'number', time_ms: 'number' },
  [EVENTS.AUDIO_SKIPPED]:           { narration_id: 'string', skip_time_ms: 'number' },
  [EVENTS.WORKSHEET_DOWNLOADED]:    { type: 'string', world: 'number', student_id: 'string' },
};
