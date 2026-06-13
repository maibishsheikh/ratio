/**
 * audio.js — Core Audio Engine
 *
 * Pipeline (per spec):
 * 1. Cache check → audioMap[text] → immediate static asset URL (zero latency)
 * 2. Dynamic generation → ElevenLabs API (via /api/audio/generate proxy) if key present
 * 3. No browser TTS fallback — if unavailable, skip narration silently
 * 4. Preloading — while playing segment i, preemptively fetch segment i+1
 */

import { audioMap } from './audioMap';
import { VOICE_ID, VOICE_MODEL, VOICE_SETTINGS } from './narration';

// ─── Module-level state ───────────────────────────────────────────────────
let _currentAudio = null;           // Active HTMLAudioElement
let _isMuted       = false;
const _elevenLabsCache = new Map(); // text → objectURL (runtime cache)

// ─── Helpers ──────────────────────────────────────────────────────────────
function getApiKey() {
  return (typeof import.meta !== 'undefined' && import.meta.env)
    ? import.meta.env.VITE_ELEVENLABS_API_KEY
    : null;
}

/**
 * Resolve a URL for the given text string.
 * Returns: static asset path, cached objectURL, or null if unavailable.
 */
export async function getAudioUrl(text, style = 'statement') {
  // 1. Static cache (audioMap)
  if (audioMap[text]) {
    // Prepend Vite's BASE_URL so assets resolve under sub-path deployments
    // (e.g. /courses/grade-6-math/…/). BASE_URL always has a trailing slash.
    const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
    return base + audioMap[text].replace(/^\//, '');
  }

  // 2. In-memory runtime cache (previous dynamic generations)
  if (_elevenLabsCache.has(text)) {
    return _elevenLabsCache.get(text);
  }

  // 3. Dynamic ElevenLabs generation
  const apiKey = getApiKey();
  if (!apiKey) {
    return null; // No fallback — skip silently per spec
  }

  try {
    const voiceSettings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
    const response = await fetch(`/api/audio/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        style,
        voiceId: VOICE_ID,
        modelId: VOICE_MODEL,
        voiceSettings,
      }),
    });

    if (!response.ok) return null;

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    _elevenLabsCache.set(text, objectUrl);
    return objectUrl;
  } catch {
    return null; // Silent skip on any error
  }
}

/**
 * Play a single audio segment (HTMLAudioElement based).
 * Respects mute state. Resolves when playback ends or is skipped.
 */
export function speak(url, onEnd) {
  if (!url) {
    // No audio available — resolve immediately so narration chain continues
    if (onEnd) onEnd();
    return;
  }

  if (_currentAudio) {
    _currentAudio.onended = null;   // prevent stale handler from firing
    _currentAudio.onerror = null;
    _currentAudio.pause();
    _currentAudio.src = '';
    _currentAudio = null;
  }

  const audio = new Audio(url);
  audio.muted = _isMuted;
  _currentAudio = audio;

  audio.onended  = () => { _currentAudio = null; if (onEnd) onEnd(); };
  audio.onerror  = () => { _currentAudio = null; if (onEnd) onEnd(); };
  audio.play().catch(() => { _currentAudio = null; if (onEnd) onEnd(); });
}

/**
 * Narrate a sequence of {text, style} segments with eager preloading.
 * While segment i plays, segment i+1 is pre-fetched.
 *
 * @param {Array<{text:string, style:string}>} segments
 * @param {Function} onSegmentStart - called with (index, text) before each segment plays
 * @param {Function} onComplete     - called when all segments finish
 * @returns {Function} cancel — call to stop narration immediately
 */
export function narrate(segments, onSegmentStart, onComplete) {
  if (!segments || segments.length === 0) {
    if (onComplete) onComplete();
    return () => {};
  }

  let cancelled = false;
  let i = 0;

  // Pre-fetch next segment in background
  const prefetch = (idx) => {
    if (idx < segments.length) {
      getAudioUrl(segments[idx].text, segments[idx].style);
    }
  };

  const playNext = async () => {
    if (cancelled || i >= segments.length) {
      if (!cancelled && onComplete) onComplete();
      return;
    }

    const seg = segments[i];
    if (onSegmentStart) onSegmentStart(i, seg.text);

    // Prefetch the one after this
    prefetch(i + 1);

    const url = await getAudioUrl(seg.text, seg.style);

    if (cancelled) return;

    speak(url, () => {
      i++;
      playNext();
    });
  };

  // Start prefetching first segment immediately
  prefetch(0);
  playNext();

  return () => {
    cancelled = true;
    if (_currentAudio) {
      _currentAudio.onended = null;
      _currentAudio.onerror = null;
      _currentAudio.pause();
      _currentAudio.src = '';
      _currentAudio = null;
    }
  };
}

/**
 * Preload a narration sequence without playing (call before a phase transition).
 */
export function preloadNarration(segments) {
  segments?.forEach((seg) => {
    getAudioUrl(seg.text, seg.style);
  });
}

/**
 * Stop all audio immediately.
 */
export function stopAudio() {
  if (_currentAudio) {
    _currentAudio.onended = null;
    _currentAudio.onerror = null;
    _currentAudio.pause();
    _currentAudio.src = '';
    _currentAudio = null;
  }
}

/**
 * Set mute state globally (respects React UI toggle).
 */
export function setMuted(muted) {
  _isMuted = muted;
  if (_currentAudio) _currentAudio.muted = muted;
}

/**
 * Check if audio is currently playing.
 */
export function isAudioPlaying() {
  return _currentAudio !== null && !_currentAudio.paused;
}
