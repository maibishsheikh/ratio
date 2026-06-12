import React, { useEffect } from 'react';
import { narrate, preloadNarration } from '../utils/audio.js';
import { introNarration } from '../utils/narration.js';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder',   desc: 'A measurement mystery!' },
  { icon: '📖', label: 'Story',    desc: 'Emma & Oliver measure' },
  { icon: '🧪', label: 'Simulate', desc: 'Use the ruler' },
  { icon: '🎮', label: 'Play',     desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect',  desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart }) {
  useEffect(() => {
    preloadNarration(introNarration());
    const { cancel } = narrate(introNarration(), true);
    return cancel;
  }, []);

  return (
    <div className="intro-screen" role="main">
      <div className="intro-badge">✨ Intellia Global · Grade 2 Maths</div>

      <h1 className="intro-title">
        <span style={{ color: 'var(--coral)' }}>Measurement:</span>{' '}
        <span style={{ color: 'var(--gold)' }}>Length in cm &amp; m</span>
      </h1>

      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-secondary)' }}>
        Lesson 5.1 · Measure in centimetres and metres
      </p>

      <div className="mascot-container">
        <div className="mascot" role="img" aria-label="Roo the Robot mascot">🤖</div>
        <div className="speech-bubble">
          Ready to measure the world? 📏
        </div>
      </div>

      <p className="intro-desc">
        Learn to measure, compare, and solve real-world length problems using centimetres and metres!
      </p>

      <button
        className="intro-start-btn"
        onClick={onStart}
        aria-label="Start Measuring — begin Lesson 5.1"
      >
        Start Measuring! 📏
      </button>

      <div className="intro-journey-map">
        <div className="intro-journey-title">Your Learning Journey</div>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <React.Fragment key={p.label}>
              <div className="intro-journey-step">
                <div className="intro-journey-icon">{p.icon}</div>
                <div className="intro-journey-info">
                  <div className="intro-journey-label">{p.label}</div>
                  <div className="intro-journey-desc">{p.desc}</div>
                </div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && (
                <div className="intro-journey-arrow" aria-hidden="true">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
