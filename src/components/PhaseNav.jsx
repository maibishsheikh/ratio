import React from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '../core/store/progressStore';
import { stopAudio } from '../utils/audio';
import { Sparkles, BookOpen, Layers, Gamepad2, Star, Check } from 'lucide-react';

const PHASES = [
  { id: 'wonder',   label: 'Wonder',   icon: Sparkles,  emoji: '✨' },
  { id: 'story',    label: 'Story',    icon: BookOpen,  emoji: '📖' },
  { id: 'simulate', label: 'Simulate', icon: Layers,    emoji: '🧪' },
  { id: 'play',     label: 'Play',     icon: Gamepad2,  emoji: '🎮' },
  { id: 'reflect',  label: 'Reflect',  icon: Star,      emoji: '🌟' },
];

const PHASE_ORDER = ['wonder','story','simulate','play','reflect'];

export default function PhaseNav() {
  const { currentPhase, completedPhases, currentWorldId, setPhase } = useProgressStore();
  const currentIdx  = PHASE_ORDER.indexOf(currentPhase);

  const handlePhaseClick = (phaseId) => {
    stopAudio();
    setPhase(phaseId);
  };

  return (
    <div className="sticky top-12 z-[90] bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-2.5">

        {/* World indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          {[1,2,3].map(w => (
            <div key={w} className={`flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full transition-all ${
              w === currentWorldId
                ? 'bg-primary text-white shadow-sm'
                : w < currentWorldId
                ? 'bg-primary/10 text-primary'
                : 'bg-white/10 text-white/40'
            }`}>
              {w < currentWorldId && <Check className="w-2.5 h-2.5" />}
              W{w}
            </div>
          ))}
        </div>

        {/* Phase pills — all clickable */}
        <div className="flex items-center gap-1 md:gap-2">
          {PHASES.map((phase, idx) => {
            const isDone    = completedPhases?.[currentWorldId]?.includes(phase.id) || idx < currentIdx;
            const isActive  = phase.id === currentPhase;
            const Icon      = phase.icon;

            return (
              <React.Fragment key={phase.id}>
                <button
                  onClick={() => handlePhaseClick(phase.id)}
                  className={`relative flex-1 min-w-0 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive ? 'bg-primary/8' : 'hover:bg-white/5'
                  }`}
                  style={{ background: 'none', border: 'none' }}
                  title={`Go to ${phase.label}`}
                >
                  {/* Dot / icon */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'bg-primary text-white shadow-md scale-110'
                    : isDone ? 'bg-green-900/300 text-white'
                    : 'bg-white/10 text-white/40'
                  }`}>
                    {isDone && !isActive
                      ? <Check className="w-3.5 h-3.5" />
                      : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  {/* Label */}
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest hidden sm:block transition-colors ${
                    isActive ? 'text-primary' : isDone ? 'text-green-300' : 'text-white/40'
                  }`}>
                    {phase.label}
                  </span>

                  {/* Active underline */}
                  {isActive && (
                    <motion.div layoutId="activePhaseBar"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                  )}
                </button>

                {/* Connector */}
                {idx < PHASES.length - 1 && (
                  <div className={`h-0.5 flex-shrink-0 w-4 md:w-8 rounded-full transition-colors ${
                    idx < currentIdx ? 'bg-green-400' : 'bg-white/15'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
