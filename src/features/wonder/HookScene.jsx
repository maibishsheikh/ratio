// HookScene.jsx
// The opening hook scene card shown in the Wonder phase.

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Zap, HelpCircle } from 'lucide-react';

/**
 * HookScene
 * Props:
 *   worldMeta    {Object} { bg, accent, accentLight, icon, emojis, worldLabel }
 *   title        {string}
 *   text         {string}
 *   onNext       {fn}
 */
export default function HookScene({ worldMeta, title, text, onNext }) {
  const { bg, accent, accentLight, icon, emojis, worldLabel } = worldMeta;

  return (
    <motion.div
      key="hook"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col gap-4"
    >
      {/* Hero panel */}
      <div className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-br ${bg} text-white p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl`}>
        {/* Floating bg emojis */}
        {emojis.map((em, i) => (
          <motion.span
            key={i}
            className="absolute text-4xl opacity-20 select-none pointer-events-none"
            style={{ right: `${5 + i * 22}%`, top: `${10 + i * 18}%` }}
            animate={{ y: [0, -10, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
          >
            {em}
          </motion.span>
        ))}

        {/* Phase badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/20 backdrop-blur text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
            Phase 1: Wonder — {worldLabel}
          </span>
        </div>

        {/* World icon */}
        <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-3xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-7xl md:text-8xl shadow-xl mt-6 md:mt-0">
          {icon}
        </div>

        <div className="flex-1 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-3 leading-tight drop-shadow-lg">
            {title}
          </h1>
          <p className="text-white/85 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
            {text}
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className="flex items-center gap-2 btn btn-primary"
            style={{ color: accent }}
          >
            <Sparkles className="w-5 h-5" />
            Let&apos;s Solve It!
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Curiosity teaser */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 rounded-2xl shadow-sm border border-white/10 p-5 flex items-center gap-4"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentLight, color: accent }}
        >
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">Quick Challenge Awaits!</p>
          <p className="text-white/50 text-xs mt-0.5">Answer a curiosity question to unlock the adventure. No penalty — this is just exploration!</p>
        </div>
        <div className="flex items-center gap-1 ml-auto flex-shrink-0 text-xs font-bold" style={{ color: accent }}>
          <Zap className="w-3.5 h-3.5" />
          +20 XP
        </div>
      </motion.div>
    </motion.div>
  );
}
