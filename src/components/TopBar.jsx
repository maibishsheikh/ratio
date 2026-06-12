import React from 'react';
import { useProgressStore } from '../core/store/progressStore';
import { useUiStore } from '../core/store/uiStore';
import { Volume2, VolumeX, Settings } from 'lucide-react';

export default function TopBar() {
  const { xp, level, coins, gems } = useProgressStore();
  const { soundMuted, toggleMute }  = useUiStore();

  return (
    <div className="sticky top-0 z-[100] bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-lg font-extrabold font-display text-primary tracking-tight">Ratio<span className="text-secondary">Craft</span></span>
          <span className="hidden sm:inline-flex items-center text-[9px] font-extrabold uppercase tracking-widest text-primary/60 bg-primary/8 px-2 py-0.5 rounded-full border border-primary/15">Grade 6</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          {[
            { icon: '⚡', value: xp, label: 'XP', color: 'text-primary' },
            { icon: '🪙', value: coins, label: '', color: 'text-amber-300' },
            { icon: '💎', value: gems, label: '', color: 'text-violet-600' },
          ].map(({ icon, value, label, color }) => (
            <div key={icon} className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
              <span className="text-[13px]">{icon}</span>
              <span className={`text-xs font-extrabold ${color}`}>{value}{label}</span>
            </div>
          ))}

          {/* Level badge */}
          <div className="flex items-center gap-1 bg-primary text-white rounded-full px-2.5 py-1">
            <span className="text-[9px] font-extrabold uppercase tracking-widest opacity-70">Lv</span>
            <span className="text-xs font-extrabold">{level}</span>
          </div>

          {/* Sound toggle */}
          <button onClick={toggleMute}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all text-white/40 hover:text-primary"
            aria-label={soundMuted ? 'Unmute' : 'Mute'}>
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
