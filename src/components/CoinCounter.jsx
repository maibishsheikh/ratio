// CoinCounter.jsx
// Displays the player's current coin balance with an animated count-up.

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../core/store/progressStore';

/**
 * CoinCounter
 * Props:
 *   size    {string} 'sm' | 'md' | 'lg' (default 'md')
 *   showLabel {boolean} Show "Coins" label (default false)
 */
export default function CoinCounter({ size = 'md', showLabel = false }) {
  const { coins } = useProgressStore();
  const prevCoins = useRef(coins);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (coins !== prevCoins.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      prevCoins.current = coins;
      return () => clearTimeout(t);
    }
  }, [coins]);

  const sizeClasses = {
    sm: 'text-xs gap-1 px-2 py-1',
    md: 'text-sm gap-1.5 px-2.5 py-1.5',
    lg: 'text-base gap-2 px-3 py-2',
  }[size];

  const emojiSize = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }[size];

  return (
    <motion.div
      className={`flex items-center ${sizeClasses} rounded-full font-bold transition-colors ${
        flash ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-900/30 text-amber-300'
      } border border-amber-100`}
      animate={flash ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className={emojiSize}>🪙</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={coins}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
        >
          {coins}
        </motion.span>
      </AnimatePresence>
      {showLabel && <span className="text-amber-500 font-semibold">Coins</span>}
    </motion.div>
  );
}
