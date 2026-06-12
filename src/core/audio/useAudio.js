/**
 * useAudio.js — React hook wrapping the core audio engine (src/utils/audio.js)
 * Respects the global soundMuted UI store state.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useUiStore } from '../store/uiStore';
import { narrate, preloadNarration, stopAudio, setMuted } from '../../utils/audio';

export function useAudio() {
  const soundMuted = useUiStore((s) => s.soundMuted);
  const cancelRef  = useRef(null);

  useEffect(() => { setMuted(soundMuted); }, [soundMuted]);

  useEffect(() => {
    return () => {
      if (cancelRef.current) cancelRef.current();
      stopAudio();
    };
  }, []);

  const playNarration = useCallback((segments, onStart, onComplete) => {
    if (cancelRef.current) { cancelRef.current(); cancelRef.current = null; }
    if (!segments || segments.length === 0) { if (onComplete) onComplete(); return; }
    cancelRef.current = narrate(segments, onStart, () => {
      cancelRef.current = null;
      if (onComplete) onComplete();
    });
  }, []);

  const playSingleText = useCallback((text, style = 'statement', onComplete) => {
    playNarration([{ text, style }], null, onComplete);
  }, [playNarration]);

  const stop = useCallback(() => {
    if (cancelRef.current) { cancelRef.current(); cancelRef.current = null; }
    stopAudio();
  }, []);

  const preload = useCallback((segments) => {
    preloadNarration(segments);
  }, []);

  return { playNarration, playSingleText, stop, preload };
}
