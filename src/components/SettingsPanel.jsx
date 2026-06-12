import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '../core/store/uiStore';
import {
  Settings, X, Volume2, VolumeX, Type, Zap, ZapOff,
  Subtitles, Eye, Moon
} from 'lucide-react';

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const {
    soundMuted, toggleSoundMuted,
    theme, toggleTheme,
    reducedMotion, toggleReducedMotion,
    subtitlesEnabled, toggleSubtitlesEnabled,
    deuteranopia, toggleDeuteranopia,
  } = useUiStore();

  const toggles = [
    {
      id: 'sound',
      label: 'Narration Audio',
      description: soundMuted ? 'Audio is muted — using subtitles only' : 'Audio narration is playing',
      icon: soundMuted ? VolumeX : Volume2,
      active: !soundMuted,
      toggle: toggleSoundMuted,
      activeColor: 'bg-primary text-white',
      inactiveColor: 'bg-white/10 text-white/40',
    },
    {
      id: 'subtitles',
      label: 'Subtitles',
      description: subtitlesEnabled ? 'Subtitles are shown during narration' : 'Subtitles are hidden',
      icon: Subtitles,
      active: subtitlesEnabled,
      toggle: toggleSubtitlesEnabled,
      activeColor: 'bg-primary text-white',
      inactiveColor: 'bg-white/10 text-white/40',
    },
    {
      id: 'dyslexia',
      label: 'Dyslexia Font',
      description: theme === 'dyslexia' ? 'OpenDyslexic font is active' : 'Standard Inter/Nunito fonts',
      icon: Type,
      active: theme === 'dyslexia',
      toggle: toggleTheme,
      activeColor: 'bg-secondary text-white',
      inactiveColor: 'bg-white/10 text-white/40',
    },
    {
      id: 'motion',
      label: 'Reduced Motion',
      description: reducedMotion ? 'Animations are minimised' : 'Full animations enabled',
      icon: reducedMotion ? ZapOff : Zap,
      active: reducedMotion,
      toggle: toggleReducedMotion,
      activeColor: 'bg-amber-900/300 text-white',
      inactiveColor: 'bg-white/10 text-white/40',
    },
    {
      id: 'deuteranopia',
      label: 'Colour Blind Mode',
      description: deuteranopia ? 'Deuteranopia palette active' : 'Standard colour palette',
      icon: Eye,
      active: deuteranopia,
      toggle: toggleDeuteranopia,
      activeColor: 'bg-violet-600 text-white',
      inactiveColor: 'bg-white/10 text-white/40',
    },
  ];

  return (
    <>
      {/* Settings Trigger Button */}
      <button
        id="settings-btn"
        aria-label="Open accessibility settings"
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-lg text-white/40 hover:text-primary hover:bg-primary/10 transition-all"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 z-50 h-full w-80 bg-white/5 shadow-2xl flex flex-col overflow-y-auto"
              role="dialog"
              aria-label="Accessibility Settings"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-primary/5">
                <div>
                  <h2 className="font-extrabold text-white font-display text-lg">Settings</h2>
                  <p className="text-xs text-white/50">Accessibility & preferences</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close settings"
                  className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3 p-5 flex-1">
                {toggles.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/50 hover:bg-white/5 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${item.active ? item.activeColor : item.inactiveColor} transition-colors`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{item.label}</p>
                          <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      {/* Toggle switch */}
                      <button
                        id={`settings-toggle-${item.id}`}
                        onClick={item.toggle}
                        aria-pressed={item.active}
                        aria-label={`Toggle ${item.label}`}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                          item.active ? 'bg-primary' : 'bg-white/15'
                        }`}
                      >
                        <motion.span
                          layout
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white/5 shadow-md"
                          animate={{ left: item.active ? '1.375rem' : '0.125rem' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-white/10">
                <p className="text-xs text-white/40 text-center">
                  RatioCraft v1.0 — Intellia SG<br />
                  WCAG 2.1 AA Compliant
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
