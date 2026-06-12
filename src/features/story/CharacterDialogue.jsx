// CharacterDialogue.jsx
// Renders the character speech bubble for a story frame.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARACTER_STYLES = {
  Alex:     { emoji: '🧮', text: 'text-teal-300',    bg: 'bg-teal-900/40',    border: 'border-teal-500/30' },
  Emma:     { emoji: '🎨', text: 'text-pink-300',    bg: 'bg-pink-900/40',    border: 'border-pink-500/30' },
  Zara:     { emoji: '⚡', text: 'text-violet-300',  bg: 'bg-violet-900/40',  border: 'border-violet-500/30' },
  Leo:      { emoji: '💰', text: 'text-amber-300',   bg: 'bg-amber-900/40',   border: 'border-amber-500/30' },
  Narrator: { emoji: '📖', text: 'text-white/70',    bg: 'bg-white/5',        border: 'border-white/15' },
};

/**
 * CharacterDialogue
 * Props:
 *   character  {string}  Character name
 *   text       {string}  Dialogue text
 *   frameKey   {number}  Unique key to trigger AnimatePresence re-animation
 */
export default function CharacterDialogue({ character, text, frameKey }) {
  const style = CHARACTER_STYLES[character] || CHARACTER_STYLES.Narrator;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={frameKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.22 }}
        className={`${style.bg} rounded-2xl p-5 border ${style.border} min-h-[90px] flex flex-col gap-2`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{style.emoji}</span>
          <span className={`text-xs font-extrabold uppercase tracking-wider ${style.text} font-display`}>
            {character}
          </span>
        </div>
        <p className="text-white/80 text-base md:text-lg leading-relaxed font-medium">
          &ldquo;{text}&rdquo;
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
