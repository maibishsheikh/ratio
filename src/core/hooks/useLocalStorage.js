// useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Like useState but persists the value to localStorage.
 * @param {string} key Storage key
 * @param {*} defaultValue Default value if key not found
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors (e.g. private browsing with full storage)
    }
  }, [key, value]);

  return [value, setValue];
}
