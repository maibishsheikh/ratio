import { useState, useCallback, useEffect } from 'react';
import IntroScreen   from './components/IntroScreen';
import WonderPhase   from './features/wonder/WonderPhase';
import StoryPhase    from './features/story/StoryPhase';
import SimulatePhase from './features/simulate/SimulatePhase';
import PlayPhase     from './features/play/PlayPhase';
import ReflectPhase  from './features/reflect/ReflectPhase';

/* ── Floating background numbers ── */
const FLOAT_ITEMS = [
  '2:3','1:4','75%','½','⅓','×','÷','=','3:1','50%','¼','⅔',
  '5:2','1/3','0.5','%','÷2','×3','4:1',
];
function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {FLOAT_ITEMS.map((item, i) => (
        <div key={i} className="floating-number" style={{
          left: `${(i * 83 + 7) % 100}%`,
          animationDelay: `${i * 1.1}s`,
          animationDuration: `${18 + (i % 5) * 4}s`,
        }}>{item}</div>
      ))}
    </div>
  );
}

/* ── Journey Bar ── */
const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Play' },
  { icon: '📓', label: 'Reflect' },
];
const PHASE_ORDER = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];

function JourneyBar({ phase }) {
  const phaseIndex = PHASE_ORDER.indexOf(phase);
  return (
    <div className="journey-bar">
      {JOURNEY_ITEMS.map((item, i) => {
        const stepPhaseIndex = i + 1; // wonder=1, story=2, …
        const isActive    = phaseIndex === stepPhaseIndex;
        const isCompleted = phaseIndex > stepPhaseIndex;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="journey-step-dot">{isCompleted ? '✓' : item.icon}</div>
              <div className="journey-step-label">{item.label}</div>
            </div>
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
export default function App() {
  const [phase, setPhase]         = useState('intro');
  const [audioEnabled, setAudio]  = useState(true);
  const [playStats, setPlayStats] = useState(null);

  const toggleAudio = useCallback(() => setAudio(v => !v), []);
  const goHome = useCallback(() => { setPhase('intro'); setPlayStats(null); }, []);

  const showJourney = phase !== 'intro';

  return (
    <>
      <FloatingNumbers />
      <div className="app-container">

        {/* Audio toggle */}
        <button className="audio-toggle-btn" onClick={toggleAudio} title={audioEnabled ? 'Mute' : 'Unmute'}>
          {audioEnabled ? '🔊' : '🔇'}
        </button>

        {/* Home button */}
        {showJourney && (
          <button className="home-btn" onClick={goHome}>🏠 Home</button>
        )}

        {/* Journey bar */}
        {showJourney && <JourneyBar phase={phase} />}

        {/* Phase content */}
        {phase === 'intro' && (
          <IntroScreen
            onStart={() => setPhase('wonder')}
            audioEnabled={audioEnabled}
            onToggleAudio={toggleAudio}
          />
        )}
        {phase === 'wonder' && (
          <WonderPhase
            onComplete={() => setPhase('story')}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'story' && (
          <StoryPhase
            onComplete={() => setPhase('simulate')}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'simulate' && (
          <SimulatePhase
            onComplete={() => setPhase('play')}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'play' && (
          <PlayPhase
            onComplete={(stats) => { setPlayStats(stats); setPhase('reflect'); }}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'reflect' && (
          <ReflectPhase
            stats={playStats}
            onRestart={() => setPhase('wonder')}
            onGoHome={goHome}
            audioEnabled={audioEnabled}
          />
        )}
      </div>
    </>
  );
}
