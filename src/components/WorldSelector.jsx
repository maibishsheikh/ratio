// WorldSelector.jsx
// A world selection overlay that lets students choose which world to play.
// Accessible from the PhaseNav brand area.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../core/store/progressStore';
import { Map, Lock, Star, ChevronRight, X } from 'lucide-react';

const WORLDS = [
  {
    id: 1,
    name: 'Spice Bazaar',
    emoji: '🌶️',
    description: 'Ratios · Equivalent Ratios · Simplifying',
    gradient: 'from-orange-500 via-red-500 to-amber-500',
    unlockXP: 0,
  },
  {
    id: 2,
    name: 'Speed Speedway',
    emoji: '🏎️',
    description: 'Unit Rates · Rate Comparison · Proportions',
    gradient: 'from-violet-500 via-purple-500 to-blue-500',
    unlockXP: 200,
  },
  {
    id: 3,
    name: 'Gold Exchange',
    emoji: '💰',
    description: 'Percentages · Profit & Loss · Simple Interest',
    gradient: 'from-amber-500 via-yellow-500 to-orange-500',
    unlockXP: 500,
  },
];

export default function WorldSelector() {
  const [open, setOpen] = useState(false);
  const { currentWorldId, unlockedWorldId, xp, stars, setWorld, setPhase } = useProgressStore();

  const handleSelectWorld = (worldId) => {
    if (worldId > unlockedWorldId) return;
    setWorld(worldId);
    setPhase('wonder');
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-all"
        aria-label="Open world map"
      >
        <Map className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">World Map</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div className="bg-white/5 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white">
                  <div>
                    <h2 className="font-extrabold text-lg font-display">The Great World Market</h2>
                    <p className="text-white/70 text-xs">Choose your adventure</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* World cards */}
                <div className="p-4 flex flex-col gap-3">
                  {WORLDS.map((world) => {
                    const isLocked = world.id > unlockedWorldId;
                    const isCurrent = world.id === currentWorldId;
                    const worldStars = stars[world.id] || 0;

                    return (
                      <motion.button
                        key={world.id}
                        whileHover={!isLocked ? { scale: 1.02 } : {}}
                        whileTap={!isLocked ? { scale: 0.98 } : {}}
                        onClick={() => handleSelectWorld(world.id)}
                        disabled={isLocked}
                        className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all ${
                          isCurrent
                            ? 'border-primary shadow-md ring-2 ring-primary/20'
                            : isLocked
                            ? 'border-white/10 opacity-60 cursor-not-allowed'
                            : 'border-white/10 hover:border-primary/40 hover:shadow-sm cursor-pointer'
                        }`}
                      >
                        <div className={`bg-gradient-to-r ${world.gradient} p-3 flex items-center gap-3`}>
                          <span className="text-3xl drop-shadow-md">{world.emoji}</span>
                          <div className="text-white flex-1">
                            <p className="font-extrabold text-sm font-display">{world.name}</p>
                            <p className="text-white/75 text-xs">{world.description}</p>
                          </div>
                          <div className="flex-shrink-0">
                            {isLocked ? (
                              <Lock className="w-5 h-5 text-white/60" />
                            ) : (
                              <div className="flex gap-0.5">
                                {[1, 2, 3].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                      s <= worldStars ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {isLocked && (
                          <div className="px-4 py-2 bg-white/5 text-xs text-white/40 font-medium flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Requires {world.unlockXP} XP to unlock ({xp}/{world.unlockXP} XP)
                          </div>
                        )}
                        {!isLocked && isCurrent && (
                          <div className="px-4 py-2 bg-primary/5 text-xs text-primary font-bold flex items-center gap-1">
                            ▶ Currently Playing
                          </div>
                        )}
                        {!isLocked && !isCurrent && (
                          <div className="px-4 py-2 bg-white/5 text-xs text-white/50 font-medium flex items-center justify-between">
                            <span>Click to play</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="px-5 py-3 border-t border-white/10 text-center text-xs text-white/40">
                  Complete each world to unlock the next adventure!
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
