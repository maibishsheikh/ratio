/**
 * Static MP3-only Audio Engine — module-level singleton.
 *
 * ALL narration comes exclusively from pre-generated MP3 files listed in
 * audioMap.js. There is NO ElevenLabs API call, NO browser TTS, NO fetch.
 * If a text string has no entry in audioMap the segment is skipped silently.
 *
 * This eliminates the primary source of phase-bleed: async ElevenLabs fetches
 * that outlive their generation and play into the next phase.
 *
 * Bleed prevention — generation counter + _resolveCurrentSpeak:
 * ─────────────────────────────────────────────────────────────
 * stopAll() increments _gen AND immediately resolves the in-flight _speak()
 * promise. Without the resolve, pause() would leave the narrate() loop frozen
 * at `await _speak(...)`, unable to reach the generation check and exit.
 */

import { audioMap } from './audioMap.js';

// ─── Module-level state ───────────────────────────────────────────────────────
let _gen                 = 0;    // increments on every stopAll()
let _currentAudio        = null; // the Audio element currently playing
let _resolveCurrentSpeak = null; // resolve() of the in-flight _speak() promise

// ─── Segment helpers ──────────────────────────────────────────────────────────
export const say       = (t) => ({ text: t, style: 'statement'     });
export const ask       = (t) => ({ text: t, style: 'question'      });
export const cheer     = (t) => ({ text: t, style: 'encouragement' });
export const emphasize = (t) => ({ text: t, style: 'emphasis'      });
export const think     = (t) => ({ text: t, style: 'thinking'      });
export const celebrate = (t) => ({ text: t, style: 'celebration'   });
export const instruct  = (t) => ({ text: t, style: 'instruction'   });

// ─── stopAll ──────────────────────────────────────────────────────────────────
export function stopAll() {
  _gen++;

  if (_currentAudio) {
    _currentAudio.pause();
    try { _currentAudio.src = ''; } catch (_) {}
    _currentAudio = null;
  }

  if (_resolveCurrentSpeak) {
    const resolve        = _resolveCurrentSpeak;
    _resolveCurrentSpeak = null;
    resolve(); // unblocks _speak() → loop advances → gen check fires → loop exits
  }
}

// ─── Resolve a text string to a static MP3 path ───────────────────────────────
// Returns the audioMap path, or null if not found. Never fetches anything.
export function getAudioUrl(text) {
  if (!text) return null;
  return audioMap[text] ?? null;
}

// ─── Play a single static MP3 path ───────────────────────────────────────────
function _speak(url, myGen) {
  return new Promise((resolve) => {
    if (!url || _gen !== myGen) { resolve(); return; }

    if (_currentAudio) {
      _currentAudio.pause();
      try { _currentAudio.src = ''; } catch (_) {}
      _currentAudio = null;
    }

    const audio  = new Audio(url);
    audio.volume = 0.95;
    _currentAudio = audio;

    _resolveCurrentSpeak = resolve;

    const done = () => {
      _resolveCurrentSpeak = null;
      _currentAudio        = null;
      resolve();
    };

    audio.onended = done;
    audio.onerror = done;
    audio.play().catch(done);
  });
}

// ─── Sequential narration (MP3-only, synchronous URL resolution) ──────────────
export function narrate(segments, audioEnabled = true) {
  stopAll();
  const myGen = _gen;

  if (!audioEnabled || !segments?.length) {
    return { cancel: () => {}, promise: Promise.resolve() };
  }

  const promise = (async () => {
    for (let i = 0; i < segments.length; i++) {
      if (_gen !== myGen) break;

      const { text } = segments[i];
      const url = getAudioUrl(text); // synchronous — no await, no fetch, no race

      if (!url) continue; // no MP3 for this text → skip silently

      if (_gen !== myGen) break;

      await _speak(url, myGen);
    }
  })();

  return {
    cancel:  () => stopAll(),
    promise,
  };
}

// ─── Eager preload (no-op — browser will cache on first play) ─────────────────
export function preloadNarration(_segments) {
  // Nothing to do: all assets are static MP3s served by the same origin.
  // The browser caches them automatically after the first request.
}

// ─── UI sound effects (Web Audio API oscillator tones) ───────────────────────
function _tone(freq, dur, type = 'sine', gain = 0.25) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
    setTimeout(() => ctx.close().catch(() => {}), dur * 1000 + 200);
  } catch (_) {}
}

export const sounds = {
  correct: (enabled = true) => {
    if (!enabled) return;
    _tone(523, 0.09);
    setTimeout(() => _tone(659, 0.13), 90);
    setTimeout(() => _tone(784, 0.16), 190);
  },
  wrong:  (enabled = true) => { if (enabled) _tone(220, 0.18, 'sawtooth', 0.18); },
  click:  (enabled = true) => { if (enabled) _tone(880, 0.05, 'sine', 0.12); },
  badge:  (enabled = true) => {
    if (!enabled) return;
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => _tone(f, 0.14), i * 110)
    );
  },
};
