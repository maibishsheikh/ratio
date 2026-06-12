// CharacterSprite.jsx
// Renders a character avatar with optional speech indicator.

import React from 'react';
import { motion } from 'framer-motion';

const CHARACTER_DATA = {
  Alex:     { emoji: '🧮', avatar: '👦🏻', bg: 'from-teal-400 to-teal-600',   ring: 'ring-teal-300' },
  Emma:     { emoji: '🎨', avatar: '👧🏼', bg: 'from-pink-400 to-pink-600',    ring: 'ring-pink-300' },
  Zara:     { emoji: '⚡', avatar: '👧🏽', bg: 'from-violet-400 to-violet-600', ring: 'ring-violet-300' },
  Leo:      { emoji: '💰', avatar: '👦🏾', bg: 'from-amber-400 to-amber-600',  ring: 'ring-amber-300' },
  Narrator: { emoji: '📖', avatar: '🎙️', bg: 'from-gray-400 to-gray-600',    ring: 'ring-gray-300' },
};

/**
 * CharacterSprite
 * Props:
 *   name      {string}  Character name
 *   size      {string}  'sm' | 'md' | 'lg'
 *   speaking  {boolean} Animate mouth/pulse when speaking
 *   showName  {boolean} Show name label below
 */
export default function CharacterSprite({ name = 'Alex', size = 'md', speaking = false, showName = false }) {
  const char = CHARACTER_DATA[name] || CHARACTER_DATA.Alex;

  const sizePx = { sm: 'w-10 h-10 text-xl', md: 'w-14 h-14 text-3xl', lg: 'w-20 h-20 text-5xl' }[size];
  const nameSz = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' }[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className={`${sizePx} rounded-2xl bg-gradient-to-br ${char.bg} flex items-center justify-center shadow-lg border-2 border-white/30 flex-shrink-0 ${speaking ? `ring-2 ${char.ring}` : ''}`}
        animate={speaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={speaking ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {char.avatar}
      </motion.div>
      {showName && (
        <span className={`${nameSz} font-bold text-white/70`}>{name}</span>
      )}
    </div>
  );
}
