<<<<<<< HEAD
import { useState, useCallback, useEffect } from 'react';
import IntroScreen   from './components/IntroScreen';
import WonderPhase   from './features/wonder/WonderPhase';
import StoryPhase    from './features/story/StoryPhase';
import SimulatePhase from './features/simulate/SimulatePhase';
import PlayPhase     from './features/play/PlayPhase';
import ReflectPhase  from './features/reflect/ReflectPhase';
import { stopAudio } from './utils/audio';
=======
import React, { useState, useCallback, useEffect, useRef } from 'react';
import FloatingNumbers   from './components/FloatingNumbers.jsx';
import IntroScreen       from './components/IntroScreen.jsx';
import WonderPhase       from './components/WonderPhase.jsx';
import StoryPhase        from './components/StoryPhase.jsx';
import SimulatePhase     from './components/SimulatePhase.jsx';
import PlayPhase         from './components/PlayPhase.jsx';
import ReflectPhase      from './components/ReflectPhase.jsx';
import { stopAll }       from './utils/audio.js';
>>>>>>> 11f492bac12f91cd2477a7cb0e822dbbf07e5823

const STORAGE_KEY = 'intellia_measurement_length_v1';

<<<<<<< HEAD
/* ── Journey Bar — clickable, stops audio on switch ── */
const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder',   phase: 'wonder'   },
  { icon: '📖', label: 'Story',    phase: 'story'    },
  { icon: '🧪', label: 'Simulate', phase: 'simulate' },
  { icon: '🎮', label: 'Play',     phase: 'play'     },
  { icon: '📓', label: 'Reflect',  phase: 'reflect'  },
=======
const PHASES = [
  { id: 'wonder',   label: 'Wonder',   icon: '🔍' },
  { id: 'story',    label: 'Story',    icon: '📖' },
  { id: 'simulate', label: 'Simulate', icon: '🧪' },
  { id: 'play',     label: 'Play',     icon: '🎮' },
  { id: 'reflect',  label: 'Reflect',  icon: '📓' },
>>>>>>> 11f492bac12f91cd2477a7cb0e822dbbf07e5823
];

const PHASE_ORDER = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
function phaseIndex(id) { return PHASE_ORDER.indexOf(id); }

<<<<<<< HEAD
function JourneyBar({ phase, onPhaseClick }) {
  const phaseIndex = PHASE_ORDER.indexOf(phase);
  return (
    <div className="journey-bar">
      {JOURNEY_ITEMS.map((item, i) => {
        const stepPhaseIndex = i + 1; // wonder=1, story=2, …
        const isActive    = phaseIndex === stepPhaseIndex;
        const isCompleted = phaseIndex > stepPhaseIndex;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => onPhaseClick(item.phase)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              title={`Go to ${item.label}`}
            >
              <div className="journey-step-dot">{isCompleted ? '✓' : item.icon}</div>
              <div className="journey-step-label">{item.label}</div>
            </button>
            {i < JOURNEY_ITEMS.length - 1 && (
              <div className={`journey-connector ${phaseIndex > stepPhaseIndex ? 'filled' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── App — always starts at 'intro', phase is local state ── */
=======
>>>>>>> 11f492bac12f91cd2477a7cb0e822dbbf07e5823
export default function App() {
  // ── Always start at intro — never auto-resume ─────────────────
  const [phase, setPhase]               = useState('intro');
  const [completedPhases, setCompleted] = useState(new Set());
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStats, setPlayStats]       = useState(null);
  const containerRef                    = useRef(null);

<<<<<<< HEAD
  const toggleAudio = useCallback(() => setAudio(v => !v), []);

  const goHome = useCallback(() => {
    stopAudio();
    setPhase('intro');
    setPlayStats(null);
  }, []);

  // Navigate to any phase, always stop current audio first
  const handlePhaseClick = useCallback((targetPhase) => {
    stopAudio();
    setPhase(targetPhase);
=======
  // Clear any stale localStorage on mount so a page refresh always
  // returns the user to the Intro screen.
  useEffect(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
>>>>>>> 11f492bac12f91cd2477a7cb0e822dbbf07e5823
  }, []);

  // Scroll to top whenever phase changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase]);

  // ── Navigation helper ─────────────────────────────────────────
  const goTo = useCallback((nextPhase, fromPhase) => {
    stopAll();
    setCompleted(prev => {
      const next = new Set(prev);
      if (fromPhase && fromPhase !== 'intro') next.add(fromPhase);
      return next;
    });
    setPhase(nextPhase);
  }, []);

  // ── Phase transition handlers ─────────────────────────────────
  const handleStart            = useCallback(() => goTo('wonder',   'intro'),    [goTo]);
  const handleWonderComplete   = useCallback(() => goTo('story',    'wonder'),   [goTo]);
  const handleStoryComplete    = useCallback(() => goTo('simulate', 'story'),    [goTo]);
  const handleSimulateComplete = useCallback(() => goTo('play',     'simulate'), [goTo]);

  const handlePlayComplete = useCallback((stats) => {
    setPlayStats(stats);
    goTo('reflect', 'play');
  }, [goTo]);

  const handleRestart = useCallback(() => {
    stopAll();
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    setPhase('intro');
    setCompleted(new Set());
    setPlayStats(null);
  }, []);

  // ── Journey bar: allow clicking back to any completed phase ───
  const handleJourneyClick = useCallback((phaseId) => {
    if (completedPhases.has(phaseId) || phase === phaseId) {
      stopAll();
      setPhase(phaseId);
    }
  }, [completedPhases, phase]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => { if (prev) stopAll(); return !prev; });
  }, []);

  // ── Journey bar ───────────────────────────────────────────────
  function renderJourneyBar() {
    if (phase === 'intro') return null;
    return (
      <nav className="journey-bar" aria-label="Learning journey">
        {PHASES.map((p, i) => {
          const isActive    = phase === p.id;
          const isCompleted = completedPhases.has(p.id);
          const cls = [
            'journey-step',
            isActive    ? 'active'    : '',
            isCompleted ? 'completed' : '',
          ].filter(Boolean).join(' ');

          return (
            <React.Fragment key={p.id}>
              {i > 0 && (
                <div
                  className={`journey-connector${
                    isCompleted || phaseIndex(phase) > i ? ' done' : ''
                  }`}
                />
              )}
              <button
                className={cls}
                onClick={() => handleJourneyClick(p.id)}
                aria-label={`${p.label}${isCompleted ? ' (completed)' : ''}${isActive ? ' (current)' : ''}`}
                aria-current={isActive ? 'step' : undefined}
                tabIndex={isCompleted || isActive ? 0 : -1}
              >
                <span className="step-icon">{p.icon}</span>
                <span className="step-label">{p.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    );
  }

  // ── Phase renderer ────────────────────────────────────────────
  function renderPhase() {
    switch (phase) {
      case 'intro':
        return <IntroScreen onStart={handleStart} />;
      case 'wonder':
        return <WonderPhase onComplete={handleWonderComplete} audioEnabled={audioEnabled} />;
      case 'story':
        return <StoryPhase onComplete={handleStoryComplete} audioEnabled={audioEnabled} />;
      case 'simulate':
        return <SimulatePhase onComplete={handleSimulateComplete} audioEnabled={audioEnabled} />;
      case 'play':
        return <PlayPhase onComplete={handlePlayComplete} audioEnabled={audioEnabled} />;
      case 'reflect':
        return <ReflectPhase onRestart={handleRestart} playStats={playStats} audioEnabled={audioEnabled} />;
      default:
        return <IntroScreen onStart={handleStart} />;
    }
  }

  return (
    <div className="app-container">
      <FloatingNumbers />

      {renderJourneyBar()}

      {phase !== 'intro' && (
        <button
          className="audio-toggle-btn"
          onClick={toggleAudio}
          aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
          title={audioEnabled ? 'Mute audio' : 'Enable audio'}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      )}

<<<<<<< HEAD
        {/* Home button */}
        {showJourney && (
          <button className="home-btn" onClick={goHome}>🏠 Home</button>
        )}

        {/* Journey bar — clickable */}
        {showJourney && <JourneyBar phase={phase} onPhaseClick={handlePhaseClick} />}

        {/* Phase content */}
        {phase === 'intro' && (
          <IntroScreen
            onStart={() => { stopAudio(); setPhase('wonder'); }}
            audioEnabled={audioEnabled}
            onToggleAudio={toggleAudio}
          />
        )}
        {phase === 'wonder' && (
          <WonderPhase
            onComplete={() => { stopAudio(); setPhase('story'); }}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'story' && (
          <StoryPhase
            onComplete={() => { stopAudio(); setPhase('simulate'); }}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'simulate' && (
          <SimulatePhase
            onComplete={() => { stopAudio(); setPhase('play'); }}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'play' && (
          <PlayPhase
            onComplete={(stats) => { stopAudio(); setPlayStats(stats); setPhase('reflect'); }}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'reflect' && (
          <ReflectPhase
            stats={playStats}
            onRestart={() => { stopAudio(); setPhase('wonder'); }}
            onGoHome={goHome}
            audioEnabled={audioEnabled}
          />
        )}
      </div>
    </>
=======
      <main className="phase-container" ref={containerRef}>
        {renderPhase()}
      </main>
    </div>
>>>>>>> 11f492bac12f91cd2477a7cb0e822dbbf07e5823
  );
}
