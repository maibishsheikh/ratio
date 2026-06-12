// pageTransitions.js
// Framer Motion animation variants used across the app.

export const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -24, transition: { duration: 0.25 } },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

export const bounceIn = {
  initial: { scale: 0.3, opacity: 0 },
  animate: { scale: [0.3, 1.15, 0.95, 1], opacity: 1, transition: { duration: 0.5, ease: 'backOut' } },
};

export const shakeVariant = {
  animate: { x: [-8, 8, -8, 8, -4, 4, 0], transition: { duration: 0.4 } },
};

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
