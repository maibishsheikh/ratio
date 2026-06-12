// coinBurst.js
// Returns Framer Motion animation props for a coin burst particle effect.

/**
 * Generates props for coin burst particles.
 * @param {number} count Number of coins to burst
 * @returns {Array} Array of animation prop objects
 */
export function getCoinBurstParticles(count = 12) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const rad = (angle * Math.PI) / 180;
    const distance = 80 + Math.random() * 120;
    const x = Math.cos(rad) * distance;
    const y = Math.sin(rad) * distance;

    return {
      initial: { x: 0, y: 0, opacity: 1, scale: 1 },
      animate: {
        x,
        y,
        opacity: 0,
        scale: 0.2,
        transition: { duration: 0.7 + Math.random() * 0.3, ease: 'easeOut', delay: i * 0.02 },
      },
    };
  });
}

export const coinFlipVariant = {
  initial: { rotateY: 0 },
  animate: {
    rotateY: [0, 180, 360],
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};
