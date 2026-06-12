import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Coins, Zap } from 'lucide-react';

/**
 * FeedbackOverlay
 * Full-screen animated feedback for correct / wrong answers.
 * 
 * Props:
 *   type: 'correct' | 'wrong' | null
 *   xpEarned: number (shown only on correct)
 *   coinsEarned: number (shown only on correct)
 *   onDismiss: () => void (auto-called after animation)
 */
export default function FeedbackOverlay({ type, xpEarned = 0, coinsEarned = 0, onDismiss }) {
  // Auto-dismiss after 1.2 seconds
  useEffect(() => {
    if (!type) return;
    const t = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 1200);
    return () => clearTimeout(t);
  }, [type]);

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          key={type}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`fixed inset-0 z-40 flex items-center justify-center pointer-events-none`}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Background flash */}
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 ${type === 'correct' ? 'bg-green-400' : 'bg-red-400'}`}
          />

          {/* Central icon burst */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.2, 1], opacity: [0, 1, 1] }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'backOut' }}
            className={`relative z-10 flex flex-col items-center gap-3 ${
              type === 'correct' ? 'text-green-300' : 'text-red-300'
            }`}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl ${
              type === 'correct' ? 'bg-green-100 border-4 border-green-400' : 'bg-red-100 border-4 border-red-400'
            }`}>
              {type === 'correct'
                ? <CheckCircle2 className="w-14 h-14 text-green-300" />
                : <XCircle className="w-14 h-14 text-red-500" />
              }
            </div>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-extrabold text-2xl font-display"
            >
              {type === 'correct' ? '🎉 Correct!' : '❌ Not quite!'}
            </motion.p>

            {/* Reward pop on correct */}
            {type === 'correct' && (xpEarned > 0 || coinsEarned > 0) && (
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
              >
                {xpEarned > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-1.5 shadow-md border border-green-500/40">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-extrabold text-primary text-sm">+{xpEarned} XP</span>
                  </div>
                )}
                {coinsEarned > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-1.5 shadow-md border border-amber-500/40">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="font-extrabold text-amber-300 text-sm">+{coinsEarned} Coins</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Coin burst particles (correct only) */}
          {type === 'correct' && [...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: 0,
                scale: 0.3,
              }}
              transition={{ duration: 0.8, delay: i * 0.04, ease: 'easeOut' }}
              className="absolute w-6 h-6 rounded-full bg-amber-400 border-2 border-amber-500 text-xs flex items-center justify-center font-bold text-amber-200 pointer-events-none z-10"
              style={{ left: '50%', top: '50%' }}
            >
              🪙
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
