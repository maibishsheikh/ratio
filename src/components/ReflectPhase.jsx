import React, { useState, useEffect, useCallback } from 'react';
import { narrate, sounds } from '../utils/audio.js';
import {
  reflectIntroNarration,
  reflectConfidenceNarration,
  reflectCompleteNarration,
} from '../utils/narration.js';

const REFLECT_QUESTIONS = [
  {
    q: "Emma measures her pencil and gets 15. What does this mean?",
    options: [
      { text: "The pencil is 15 centimetres long", emoji: "📏", correct: true  },
      { text: "The pencil is 15 metres long",      emoji: "❌", correct: false },
      { text: "The pencil weighs 15 grams",        emoji: "❓", correct: false },
    ],
  },
  {
    q: "How many centimetres are in 1 metre?",
    options: [
      { text: "100 centimetres", emoji: "✅", correct: true  },
      { text: "10 centimetres",  emoji: "❌", correct: false },
      { text: "50 centimetres",  emoji: "❓", correct: false },
    ],
  },
  {
    q: "Oliver wants to measure a swimming pool. Which unit should he use?",
    options: [
      { text: "Metres — it is a very long distance",        emoji: "🌊", correct: true  },
      { text: "Centimetres — always better for measuring",  emoji: "❌", correct: false },
      { text: "It does not matter which unit",              emoji: "❓", correct: false },
    ],
  },
];

const CONFIDENCE_LEVELS = [
  { emoji: '😊', label: "I can measure and compare — I'm a Measuring Champion!", color: '#4caf50' },
  { emoji: '🙂', label: 'I understand cm and m but need more practice!',          color: '#ff9800' },
  { emoji: '😐', label: "I'm still learning — I'll try again!",                   color: '#42a5f5' },
];

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const COLORS = ['#ffc107','#4caf50','#ff7043','#3f51b5','#e91e63','#00bcd4'];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left:     Math.random() * 100,
    color:    COLORS[i % COLORS.length],
    delay:    Math.random() * 2.5,
    duration: 2.5 + Math.random() * 2,
    size:     7 + Math.random() * 8,
    round:    Math.random() > 0.5,
  }));

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          aria-hidden="true"
          style={{
            left:              `${p.left}%`,
            top:               '-20px',
            width:             p.size,
            height:            p.size,
            background:        p.color,
            borderRadius:      p.round ? '50%' : '2px',
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </>
  );
}

// ─── Reflect Question step ────────────────────────────────────────────────────
function ReflectQuestion({ q, onCorrect, onWrong, audioEnabled = true }) {
  const [selected, setSelected] = useState(null);

  const handlePick = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (q.options[idx].correct) {
      sounds.correct(audioEnabled);
      setTimeout(onCorrect, 900);
    } else {
      sounds.wrong(audioEnabled);
      setTimeout(onWrong, 900);
    }
  };

  return (
    <div>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600,
        color: 'var(--text-primary)', marginBottom: 20, lineHeight: 1.5,
      }}>
        {q.q}
      </p>
      <div className="reflect-options">
        {q.options.map((opt, i) => {
          let cls = 'reflect-option';
          if (selected === i) cls += opt.correct ? ' correct' : ' wrong';
          if (selected !== null) cls += ' disabled';
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handlePick(i)}
              aria-label={opt.text}
            >
              <span className="reflect-option-emoji">{opt.emoji}</span>
              <span className="reflect-option-text">{opt.text}</span>
              {selected === i && opt.correct && (
                <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: '1.2rem' }}>✅</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Certificate ──────────────────────────────────────────────────────────────
function Certificate({ playStats, onRestart }) {
  const totalStars = playStats
    ? Object.values(playStats.worldResults || {}).reduce((s, r) => {
        const pct = r.score / r.total;
        return s + (pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0);
      }, 0)
    : 0;

  return (
    <>
      <Confetti />
      <div className="certificate-card">
        <div className="certificate-badge">🏆</div>
        <h2 className="certificate-title">Measuring Champion!</h2>
        <p className="certificate-subtitle">
          Measurement: Length in cm &amp; m — Lesson 5.1
        </p>

        <div className="certificate-stats">
          <div className="cert-stat">
            <div className="cert-stat-value">{playStats?.xp ?? 0}</div>
            <div className="cert-stat-label">Total XP ✨</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value">{totalStars} / 30</div>
            <div className="cert-stat-label">Stars ⭐</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value">{playStats?.maxStreak ?? 0}</div>
            <div className="cert-stat-label">Best Streak 🔥</div>
          </div>
          {playStats?.score != null && (
            <div className="cert-stat">
              <div className="cert-stat-value">
                {playStats.score}/{playStats.totalAnswered ?? '?'}
              </div>
              <div className="cert-stat-label">Score 🎯</div>
            </div>
          )}
        </div>

        <div className="cert-worlds-grid">
          {Object.entries(playStats?.worldResults ?? {}).map(([wid, r]) => {
            const WORLDS_MAP = {
              0:'📏',1:'🌿',2:'🖍️',3:'🎀',4:'🐛',5:'⛰️',6:'🏪',7:'🎢',8:'🏃',9:'🏰',
            };
            const stars = r.score / r.total >= 0.9 ? '⭐⭐⭐'
              : r.score / r.total >= 0.7 ? '⭐⭐'
              : r.score / r.total >= 0.5 ? '⭐' : '☆';
            return (
              <div key={wid} className="cert-world-badge">
                {WORLDS_MAP[wid]} {stars}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={onRestart}>
            Try Again 🔄
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main ReflectPhase ────────────────────────────────────────────────────────
export default function ReflectPhase({ onRestart, playStats, audioEnabled }) {
  // Steps: 0-2 = teach-back questions, 3 = confidence, 4 = certificate
  const [step,       setStep]       = useState(0);
  const [correct,    setCorrect]    = useState(0);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    if (!audioEnabled) return;
    const script = step < 3 ? reflectIntroNarration() : reflectConfidenceNarration();
    const { cancel } = narrate(script, audioEnabled);
    return cancel;
  }, [step, audioEnabled]);

  const handleCorrect = () => {
    setCorrect(c => c + 1);
    setTimeout(() => setStep(s => s + 1), 400);
  };

  const handleWrong = () => {
    setTimeout(() => setStep(s => s + 1), 400);
  };

  const handleConfidence = (idx) => {
    setConfidence(idx);
    if (audioEnabled) narrate(reflectCompleteNarration(), audioEnabled);
    setTimeout(() => setStep(4), 600);
  };

  // Teach-back questions (0, 1, 2)
  if (step < 3) {
    return (
      <div className="reflect-phase">
        <div className="reflect-card">
          <div style={{ marginBottom: 16 }}>
            <div className="section-heading">📓 Reflect</div>
            <p className="section-subheading">
              Question {step + 1} of {REFLECT_QUESTIONS.length}
            </p>
            <div className="progress-dots">
              {REFLECT_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`progress-dot${i === step ? ' active' : i < step ? ' completed' : ''}`}
                />
              ))}
            </div>
          </div>
          <ReflectQuestion
            key={step}
            q={REFLECT_QUESTIONS[step]}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            audioEnabled={audioEnabled}
          />
        </div>
      </div>
    );
  }

  // Confidence check (step 3)
  if (step === 3) {
    return (
      <div className="reflect-phase">
        <div className="reflect-card">
          <div className="section-heading">📓 How do you feel?</div>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600,
            color: 'var(--text-secondary)', marginTop: 8, marginBottom: 4,
          }}>
            How confident are you with centimetres and metres?
          </p>
          <div className="confidence-row">
            {CONFIDENCE_LEVELS.map((c, i) => (
              <button
                key={i}
                className={`confidence-btn${confidence === i ? ' selected' : ''}`}
                style={confidence === i ? { borderColor: c.color, background: c.color + '18' } : {}}
                onClick={() => handleConfidence(i)}
                aria-label={c.label}
              >
                <div className="confidence-emoji">{c.emoji}</div>
                <div className="confidence-label">{c.label}</div>
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: 12 }}>
              🏆 Teach-back score: {correct} / {REFLECT_QUESTIONS.length}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Certificate (step 4)
  return (
    <div className="reflect-phase">
      <Certificate playStats={playStats} onRestart={onRestart} />
    </div>
  );
}
