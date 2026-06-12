// StoryFrame.jsx
// Individual story frame — the world scene panel + floating decorations.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

const WORLD_SCENES = {
  1: {
    bgGradient: 'from-orange-900 via-red-800 to-amber-900',
    accentColor: '#F97316',
    label: 'Spice Bazaar',
    decorItems: ['🌶️', '🧄', '🫙', '⚗️', '🌿', '🪔'],
  },
  2: {
    bgGradient: 'from-indigo-900 via-purple-900 to-blue-900',
    accentColor: '#7C3AED',
    label: 'Speed Speedway',
    decorItems: ['🏎️', '⚡', '🏁', '🔧', '💨', '🔥'],
  },
  3: {
    bgGradient: 'from-yellow-900 via-amber-800 to-orange-900',
    accentColor: '#F59E0B',
    label: 'Gold Exchange',
    decorItems: ['💰', '🪙', '🏦', '📊', '💎', '🔐'],
  },
};

const CHARACTER_STYLES = {
  Alex:     { bg: 'from-teal-400 to-teal-600',   avatar: '👦🏻' },
  Emma:     { bg: 'from-pink-400 to-pink-600',    avatar: '👧🏼' },
  Zara:     { bg: 'from-violet-400 to-violet-600', avatar: '👧🏽' },
  Leo:      { bg: 'from-amber-400 to-amber-600',  avatar: '👦🏾' },
  Narrator: { bg: 'from-gray-400 to-gray-600',    avatar: '🎙️' },
};

/**
 * StoryFrame
 * Renders the world background panel for a story script frame.
 *
 * Props:
 *   worldId        {number}
 *   character      {string}
 *   frameIndex     {number}
 *   totalFrames    {number}
 *   progress       {number} 0–100
 */
export default function StoryFrame({ worldId, character, frameIndex, totalFrames, progress }) {
  const scene = WORLD_SCENES[worldId] || WORLD_SCENES[1];
  const charStyle = CHARACTER_STYLES[character] || CHARACTER_STYLES.Narrator;

  return (
    <div className={`relative w-full h-64 md:h-80 bg-gradient-to-br ${scene.bgGradient} overflow-hidden`}>
      {/* Floating decor */}
      {scene.decorItems.map((item, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl select-none pointer-events-none opacity-30"
          style={{ left: `${8 + (i * 15) % 88}%`, top: `${10 + (i * 20) % 70}%` }}
          animate={{ y: [0, -8, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        >
          {item}
        </motion.span>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Phase label */}
      <div className="absolute top-4 left-4">
        <div
          className="flex items-center gap-2 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20"
          style={{ background: `${scene.accentColor}CC` }}
        >
          <Volume2 className="w-3 h-3 animate-pulse" />
          Phase 2: Story — {scene.label}
        </div>
      </div>

      {/* Frame counter */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
        {frameIndex + 1} / {totalFrames}
      </div>

      {/* Character avatar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={character}
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, scale: 0.9 }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-5 left-5 flex items-center gap-3"
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${charStyle.bg} flex items-center justify-center text-2xl shadow-lg border-2 border-white/30 flex-shrink-0`}>
            {charStyle.avatar}
          </div>
          <div>
            <span className="block text-white/60 text-[10px] font-bold uppercase tracking-widest">Character</span>
            <span className="block font-extrabold text-lg text-white font-display drop-shadow-md">{character}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full"
          style={{ background: scene.accentColor }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
