// XPBar.jsx
// Displays the player's XP level and progress within the current level.

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useProgressStore } from '../core/store/progressStore';

/**
 * XPBar
 * Props:
 *   compact {boolean} - Show compact single-line version (default false)
 */
export default function XPBar({ compact = false }) {
  const { xp, level } = useProgressStore();
  const xpInLevel = xp % 200;
  const pct = (xpInLevel / 200) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">
          <Zap className="w-3 h-3" />
          <span>Lv {level}</span>
        </div>
        <div className="w-20 bg-white/10 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
          <Zap className="w-4 h-4" />
          Level {level}
        </div>
        <span className="text-xs text-white/40 font-semibold">{xpInLevel} / 200 XP</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
