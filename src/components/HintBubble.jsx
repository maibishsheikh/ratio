// HintBubble.jsx
// Animated hint bubble that slides in when shown.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

/**
 * HintBubble
 * Props:
 *   visible   {boolean}
 *   text      {string}
 *   onClose   {fn}       Optional close handler
 *   coinCost  {number}   If >0, shows coin cost badge (for IndependentPractice)
 */
export default function HintBubble({ visible = false, text = '', onClose, coinCost = 0 }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-3 bg-amber-900/30 border border-amber-500/40 rounded-xl p-4 mt-2">
            <div className="w-7 h-7 rounded-lg bg-amber-900/40 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-amber-300" />
            </div>
            <div className="flex-1">
              {coinCost > 0 && (
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  Hint ({coinCost} coins)
                </span>
              )}
              <p className="text-amber-200 text-sm font-medium leading-relaxed">{text}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-amber-400 hover:text-amber-300 transition-colors flex-shrink-0"
                aria-label="Dismiss hint"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
