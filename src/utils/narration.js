/**
 * narration.js
 * Maps application phases to their narration scripts.
 * Uses semantic helpers (say, ask, cheer, emphasize, think, celebrate) to wrap
 * text into styled narration segments matched to ElevenLabs voice settings.
 *
 * CRITICAL: Text here must match 1:1 with audioMap.js keys AND with on-screen
 * UI text to maintain synchronisation for young learners.
 */

// ─── Semantic helpers ──────────────────────────────────────────────────────
export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'encouragement' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });

// ─── ElevenLabs voice settings per style ──────────────────────────────────
export const VOICE_SETTINGS = {
  statement:    { stability: 0.65, similarity_boost: 0.80, style: 0.3 },
  question:     { stability: 0.55, similarity_boost: 0.75, style: 0.5 },
  encouragement:{ stability: 0.50, similarity_boost: 0.85, style: 0.6 },
  emphasis:     { stability: 0.75, similarity_boost: 0.90, style: 0.2 },
  thinking:     { stability: 0.70, similarity_boost: 0.78, style: 0.4 },
  celebration:  { stability: 0.45, similarity_boost: 0.85, style: 0.8 },
};

export const VOICE_ID    = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
export const VOICE_MODEL = 'eleven_multilingual_v2';

// ─── WONDER PHASE ──────────────────────────────────────────────────────────
// worldId 1 → ratio / proportion questions (Mia's juice, apples, students, recipe)
// worldId 2 → rate / speed question (car travelling 60 km/h)
export function wonderHookNarration(worldId) {
  return {
    1: [
      cheer("Hmm, I wonder! Look at this question carefully. Two quantities are being compared in a special way. Can you spot the pattern? Think it through — then click Let's Discover!"),
    ],
    2: [
      cheer("Ooh, a speed challenge! A car travels a certain distance in a set time. When we compare distance to time, we get a rate. Can you work out how far it goes at the same speed?"),
    ],
  }[worldId] ?? [];
}

// ─── STORY PHASE ──────────────────────────────────────────────────────────
// One narration per slide, matched exactly to StoryPhase STORY_SLIDES[0..4]
export const storyNarrations = {
  1: [
    // Slide 0 — The Spice Bazaar
    say("Welcome to the Spice Bazaar! Alex mixes 2 bags of pepper with 3 bags of salt every morning. Today, a huge order arrives needing 6 bags of pepper. How much salt keeps the same flavour? This is exactly what ratios help us solve!"),
    // Slide 1 — What is a Ratio?
    say("A ratio compares two quantities of the same type. Alex's blend is 2 colon 3 — for every 2 bags of pepper, there are 3 bags of salt. The ratio stays exactly the same even when the amounts get bigger or smaller!"),
    // Slide 2 — Rates at the Speedway
    say("Now meet rates! Emma's car travels 120 kilometres in 2 hours. A rate compares two different units — distance and time. We write it as 60 kilometres per hour. Whenever you see the word per, you are looking at a rate!"),
    // Slide 3 — Proportion Palace
    say("When two ratios are equal, they form a proportion! If 5 pens cost 3 dollars, then 10 pens cost 6 dollars — the ratio stays the same. We verify using cross-multiplication: multiply diagonally, and if both products match, it is a proportion!"),
    // Slide 4 — You're Ready!
    celebrate("Fantastic work! You have learned three powerful ideas. Ratios compare same-type quantities like 2 colon 3. Rates compare different units like 60 kilometres per hour. And proportions are two equal ratios. You are ready to practise — let's go!"),
  ],
};

// ─── SIMULATE PHASE ───────────────────────────────────────────────────────
// One intro narration per station, matched to SimulatePhase STATIONS[0..2]
const SIMULATION_STATION_NARRATIONS = [
  // Station 0 — Ratio Builder
  [say("Station one — the Ratio Builder! Simplify each ratio to its lowest terms. Find the number that divides evenly into both parts — that is your scale factor. Let's go!")],
  // Station 1 — Rate Detective
  [say("Station two — Rate Detective! You have a distance and a time. Divide the distance by the time to find the speed in kilometres per hour. Crack the code!")],
  // Station 2 — Proportion Checker
  [say("Final station — the Proportion Checker! Two ratios are shown. Use cross-multiplication to decide if they are equal. If both diagonal products match, it is a true proportion!")],
];

export function simulationStationNarration(stationIndex) {
  return SIMULATION_STATION_NARRATIONS[stationIndex] ?? [];
}

// ─── PLAY PHASE ───────────────────────────────────────────────────────────
export const CORRECT_NARRATIONS = [
  cheer("Excellent answer! You've got it!"),
  cheer("Brilliant reasoning! Keep going!"),
  cheer("That's exactly right! Well done!"),
];

export const WRONG_NARRATIONS = [
  think("Not quite, but good try! Read the question again and think it through."),
  think("Almost there! Check your working carefully and try again."),
];

export function bossBattleNarration() {
  return [
    emphasize("The Boss Battle begins! Answer five questions correctly to defeat the Market Boss and claim your trophy!"),
  ];
}

export function bossWinNarration() {
  return [celebrate("You defeated the Boss! The Golden Scale Trophy is yours!")];
}
