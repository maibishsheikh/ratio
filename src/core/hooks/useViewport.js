// useViewport.js
import { useState, useEffect } from 'react';

/**
 * Returns the current viewport width and convenience breakpoint booleans.
 */
export function useViewport() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    width,
    isMobile:     width < 768,
    isTablet:     width >= 768 && width < 1024,
    isChromebook: width >= 1024 && width < 1280,
    isDesktop:    width >= 1280,
  };
}
