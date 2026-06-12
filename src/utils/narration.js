/**
 * Narration scripts — text MUST exactly match an audioMap key.
 * Dynamic template-literal strings cannot be pre-generated, so any
 * function that previously produced them now returns a static equivalent
 * or an empty array (silent). No ElevenLabs calls are ever made.
 */

import { say, ask, cheer, emphasize, think, celebrate, instruct } from './audio.js';

export { say, ask, cheer, emphasize, think, celebrate, instruct };

// ── Intro ────────────────────────────────────────────────────────────────────
export function introNarration() {
  return [
    celebrate("Welcome to Measurement: Length in Centimetres and Metres!"),
    say("Today we'll learn how to measure, compare, and work with lengths."),
    cheer("Are you ready to become a Measuring Champion? Let's start!"),
  ];
}

// ── Wonder ───────────────────────────────────────────────────────────────────
// Wonder questions are random and dynamic — no pre-generated MP3s exist.
// Return empty so the phase is silent rather than triggering an API call.
export function wonderNarration(_questionText, _subtext) {
  return [];
}

// ── Story ────────────────────────────────────────────────────────────────────
export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0: return [
      say("Emma found a ruler on her desk. What is this for? she asked Roo."),
      say("This ruler helps us measure length! Each small mark is 1 centimetre."),
      emphasize("Each mark on a ruler equals 1 centimetre!"),
      cheer("A ruler is our measuring superpower!"),
    ];
    case 1: return [
      say("Oliver placed his pencil on the ruler. It reaches all the way to 15!"),
      say("That means your pencil is 15 centimetres long — or 15 cm! said Roo."),
      emphasize("Always start from zero! Read the number at the end — that is the length!"),
    ];
    case 2: return [
      say("Roo, how long is the classroom door? asked Emma."),
      say("It is too long for centimetres! We use metres for long things."),
      emphasize("100 centimetres make 1 metre — and we write it as 1 m!"),
      cheer("Big things need big units!"),
    ];
    case 3: return [
      say("Now we can measure anything with centimetres and metres!"),
      celebrate("You are now Measuring Champions! Let us practise!"),
    ];
    default: return [];
  }
}

// ── Simulate ──────────────────────────────────────────────────────────────────
export function simulateStation1Intro() {
  return [instruct("This object starts at zero. Where does it end? Tap the number on the ruler!")];
}

export function simulateStation2Intro() {
  return [ask("Which is the shortest? Tap the bars from shortest to longest!")];
}

export function simulateStation3Intro() {
  return [instruct("Fill in the blank! Use the number pad.")];
}

// Dynamic length value — no matching MP3. Return empty (silent).
export function simulateCorrectNarration(_length, _unit) {
  return [];
}

export function simulateOrderCorrectNarration() {
  return [cheer("You ordered them from shortest to longest! Well done!")];
}

export function simulateSentenceCorrectNarration() {
  return [celebrate("Correct! You completed the length sentence!")];
}

// ── Play ──────────────────────────────────────────────────────────────────────
// Question texts and world names are dynamic — no pre-generated MP3s.
// Return empty so Play phase is silent rather than triggering API calls.
export function playReadQuestion(_questionText) {
  return [];
}

export function playWorldIntro(_worldName) {
  return [];
}

export function playWorldComplete(_worldName, _score, _total) {
  return [];
}

export function playCorrectNarration() {
  return [cheer("Correct! Great work!")];
}

export function playWrongNarration() {
  return [say("Not quite — let's look at the explanation.")];
}

// ── Reflect ───────────────────────────────────────────────────────────────────
export function reflectIntroNarration() {
  return [ask("What did you learn about measurement today?")];
}

export function reflectConfidenceNarration() {
  return [ask("How confident do you feel about measuring with centimetres and metres?")];
}

export function reflectCompleteNarration() {
  return [
    celebrate("Amazing work! You are a Measuring Champion!"),
    say("You have learned to measure with centimetres and metres."),
  ];
}
