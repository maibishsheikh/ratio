// useKeyboard.js
import { useEffect } from 'react';

/**
 * Listens for a specific keyboard key and fires a callback.
 * @param {string|string[]} key Key(s) to listen for (e.g. 'Enter', ['ArrowLeft','ArrowRight'])
 * @param {Function} callback Function to call when key is pressed
 * @param {Object} options Options: { disabled }
 */
export function useKeyboard(key, callback, { disabled = false } = {}) {
  useEffect(() => {
    if (disabled) return;

    const keys = Array.isArray(key) ? key : [key];

    const handler = (e) => {
      if (keys.includes(e.key)) {
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, disabled]);
}
