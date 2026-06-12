import React, { useState, useEffect, useMemo } from 'react';
import { narrate } from '../utils/audio.js';
import { wonderNarration }  from '../utils/narration.js';

const WONDER_QUESTIONS = [
  {
    question: 'How long is your pencil? Can you guess without measuring?',
    subtext:  'What if a special tool could tell us the EXACT length?',
  },
  {
    question: 'A classroom door is MUCH longer than a pencil. How do we measure both?',
    subtext:  'Sometimes centimetres are too small — we need something bigger!',
  },
  {
    question: 'If you stretched a ribbon from your desk to the door, how long would it be?',
    subtext:  'Measuring helps us compare things we cannot easily move!',
  },
  {
    question: 'How do builders know exactly how tall to make a wall?',
    subtext:  'Measuring is the secret to making things the right size!',
  },
  {
    question: 'Can you guess the length of your shoe? Is it closer to 15 cm or 25 cm?',
    subtext:  'Estimating is an important skill — let us learn to measure precisely!',
  },
];

const PARTICLES = ['📏','📐','cm','m','?','📌','🔍','⬤','→'];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const chosen = useMemo(
    () => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)],
    []
  );

  useEffect(() => {
    if (!audioEnabled) return;
    const { cancel } = narrate(
      wonderNarration(chosen.question, chosen.subtext),
      audioEnabled
    );
    return cancel;
  }, [audioEnabled, chosen]);

  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      symbol:   PARTICLES[i % PARTICLES.length],
      top:      Math.random() * 90,
      left:     Math.random() * 90,
      delay:    Math.random() * 5,
      duration: 4 + Math.random() * 4,
    })),
    []
  );

  return (
    <div className="wonder-phase">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {particles.map(p => (
          <div
            key={p.id}
            className="wonder-particle"
            style={{
              top:               `${p.top}%`,
              left:              `${p.left}%`,
              animationDelay:    `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {p.symbol}
          </div>
        ))}
      </div>

      <div className="mascot-container">
        <div className="mascot" role="img" aria-label="Roo the Robot mascot">🤖</div>
        <div className="speech-bubble">
          Hmm, I wonder… 🤔
        </div>
      </div>

      <div className="wonder-qmark" aria-hidden="true">📏</div>

      <div className="wonder-question-card">
        <p
          className="wonder-question-text"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {chosen.question}
        </p>
        <p className="wonder-subtext">{chosen.subtext}</p>

        <button
          className="btn-wonder"
          onClick={onComplete}
          aria-label="Let's Discover — move to Story phase"
        >
          Let's Discover! 🔍
        </button>
      </div>
    </div>
  );
}
