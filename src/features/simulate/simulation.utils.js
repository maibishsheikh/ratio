// simulation.utils.js
// Shared utility functions used by simulation components.

/**
 * Calculates GCD using Euclidean algorithm.
 */
export function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

/**
 * Simplifies a ratio a:b using GCD.
 * @returns {[number, number]}
 */
export function simplifyRatio(a, b) {
  const g = gcd(Math.abs(a), Math.abs(b));
  return [a / g, b / g];
}

/**
 * Checks if two ratios a/b and c/d are proportional using cross-multiplication.
 * @returns {boolean}
 */
export function isProportional(a, b, c, d) {
  return Math.abs(a * d - b * c) < 0.001;
}

/**
 * Calculates tilt angle for proportion scale (degrees).
 * Positive = right-heavy, Negative = left-heavy.
 * @param {number} leftRatio
 * @param {number} rightRatio
 * @param {number} maxTilt Max tilt in degrees (default 22)
 */
export function calcScaleTilt(leftRatio, rightRatio, maxTilt = 22) {
  const diff = rightRatio - leftRatio;
  return Math.max(-maxTilt, Math.min(maxTilt, diff * 40));
}

/**
 * Returns N equivalent ratio pairs for a given base ratio [a, b].
 * @param {number} a
 * @param {number} b
 * @param {number} count Number of pairs to return (default 5)
 * @returns {Array<{a:number, b:number}>}
 */
export function getEquivalentRatios(a, b, count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    a: a * (i + 1),
    b: b * (i + 1),
  }));
}

/**
 * Calculates simple interest.
 * I = (P × R × T) / 100
 */
export function calcSimpleInterest(P, R, T) {
  return (P * R * T) / 100;
}

/**
 * Generates year-by-year coin pile heights for the Time Machine animation.
 * @param {number} P Principal
 * @param {number} R Rate
 * @param {number} T Time (years)
 * @returns {number[]} Array of amount values per year
 */
export function getYearFrames(P, R, T) {
  return Array.from({ length: T }, (_, i) => P + calcSimpleInterest(P, R, i + 1));
}

/**
 * Returns a random integer in [min, max] inclusive.
 */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simulation state machine states — matches the TRD spec.
 */
export const SIM_STATES = {
  INTRO:     'INTRO',
  EXPLORE:   'EXPLORE',
  GUIDED:    'GUIDED',
  CHALLENGE: 'CHALLENGE',
  COMPLETE:  'COMPLETE',
};
