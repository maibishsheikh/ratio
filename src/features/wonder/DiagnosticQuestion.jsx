// DiagnosticQuestion.jsx
// Multiple-choice curiosity question shown in the Wonder phase.

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

/**
 * DiagnosticQuestion
 * Props:
 *   worldMeta  {Object} { accent, accentLight }
 *   question   {string} The question text
 *   options    {Array}  Array of { text, correct, explanation }
 *   onAnswer   {fn}     (optionIndex) => void
 */
export default function DiagnosticQuestion({ worldMeta, question, options, onAnswer }) {
  const { accent, accentLight } = worldMeta;

  return (
    <motion.div
      key="diagnostic"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full bg-white/5 rounded-2xl shadow-xl border border-white/10 overflow-hidden"
    >
      {/* Top accent strip */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${accent}, ${accent}88)` }} />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: accentLight, color: accent }}
          >
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span
              className="block text-[10px] font-extrabold uppercase tracking-widest"
              style={{ color: accent }}
            >
              Curiosity Challenge
            </span>
            <h2 className="font-extrabold text-white font-display text-lg leading-tight">{question}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(idx)}
              className="p-4 text-left border-2 border-white/10 hover:border-white/15 rounded-xl hover:bg-white/5 font-medium text-white/80 transition-all shadow-sm flex items-start gap-3 group"
            >
              <span
                className="font-extrabold w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm group-hover:scale-110 transition-transform"
                style={{ background: accentLight, color: accent }}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="mt-0.5">{option.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
