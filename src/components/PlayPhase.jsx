import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import QuestionRenderer from './QuestionRenderer.jsx';
import { generateSessionQuestions } from '../utils/questionBank.js';
import { narrate, sounds, stopAll } from '../utils/audio.js';
import { playReadQuestion, playWorldIntro, playWorldComplete } from '../utils/narration.js';

const WORLDS = [
  { id: 0, name: 'Ruler Valley',       icon: '📏', color: '#8b5cf6' },
  { id: 1, name: 'Garden Path',        icon: '🌿', color: '#4caf50' },
  { id: 2, name: 'Crayon Kingdom',     icon: '🖍️', color: '#ff7043' },
  { id: 3, name: 'Ribbon River',       icon: '🎀', color: '#e91e63' },
  { id: 4, name: 'Animal Trail',       icon: '🐛', color: '#ff9800' },
  { id: 5, name: 'Metre Mountain',     icon: '⛰️', color: '#03a9f4' },
  { id: 6, name: 'Market Lane',        icon: '🏪', color: '#00bcd4' },
  { id: 7, name: 'Adventure Park',     icon: '🎢', color: '#673ab7' },
  { id: 8, name: 'Racing Track',       icon: '🏃', color: '#f44336' },
  { id: 9, name: 'Measurement Palace', icon: '🏰', color: '#ffc107' },
];

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

function calcXP(attempt, streak) {
  const base = attempt === 1 ? 10 : 5;
  return base + (streak >= 5 ? 5 : 0);
}

function StarsRow({ count, size = '1.3rem' }) {
  return (
    <div className="stars-row" style={{ fontSize: size }}>
      {[1,2,3].map(i => <span key={i}>{i <= count ? '⭐' : '☆'}</span>)}
    </div>
  );
}

function XPPopup({ xp, x, y }) {
  return (
    <div
      className="xp-popup"
      style={{ left: x, top: y }}
      aria-live="polite"
    >
      +{xp} XP ✨
    </div>
  );
}

// ─── World Map ────────────────────────────────────────────────────────────────
function WorldMap({ worldResults, onSelectWorld }) {
  return (
    <div>
      <div className="play-map-header">
        <h2 className="section-heading">🎮 IntelliPlay™</h2>
        <p className="section-subheading">Choose a world to practise!</p>
      </div>
      <div className="world-map">
        {WORLDS.map((w, i) => {
          const result    = worldResults[w.id];
          const isFirst   = i === 0;
          const prevDone  = i === 0 || !!worldResults[WORLDS[i - 1].id];
          const available = isFirst || prevDone;
          const completed = !!result;
          const stars     = result ? calcStars(result.score, result.total) : 0;

          let cls = 'world-card';
          if (available && !completed) cls += ' available';
          if (available && completed)  cls += ' available completed';
          if (!available)              cls += ' locked';

          return (
            <div
              key={w.id}
              className={cls}
              onClick={() => available && onSelectWorld(w.id)}
              style={{ borderColor: completed ? w.color + '66' : undefined }}
              role={available ? 'button' : undefined}
              aria-label={`${w.name}${!available ? ' — locked' : ''}${completed ? ` — ${stars} stars` : ''}`}
              tabIndex={available ? 0 : -1}
              onKeyDown={e => e.key === 'Enter' && available && onSelectWorld(w.id)}
            >
              <div className="world-card-icon">{w.icon}</div>
              <div className="world-card-name">{w.name}</div>
              {!available && <div style={{ fontSize: '0.8rem', marginTop: 4 }}>🔒</div>}
              {completed && <StarsRow count={stars} size="0.85rem" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── World Intro ──────────────────────────────────────────────────────────────
function WorldIntro({ world, onStart, audioEnabled }) {
  useEffect(() => {
    if (!audioEnabled) return;
    const { cancel } = narrate(playWorldIntro(world.name), audioEnabled);
    return cancel;
  }, [world, audioEnabled]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div className="world-intro-card">
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>{world.icon}</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700,
          color: world.color, marginBottom: 8,
        }}>
          {world.name}
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
          color: 'var(--text-secondary)', marginBottom: 24,
        }}>
          10 questions — score at least 6/10 to unlock the next world!
        </p>
        <button className="btn btn-gold btn-lg" onClick={onStart}>
          Start World! 🚀
        </button>
      </div>
    </div>
  );
}

// ─── In-World Question Screen ─────────────────────────────────────────────────
function WorldPlay({ world, questions, onWorldComplete, audioEnabled }) {
  const [qIndex,    setQIndex]    = useState(0);
  const [score,     setScore]     = useState(0);
  const [lives,     setLives]     = useState(3);
  const [streak,    setStreak]    = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP,   setTotalXP]   = useState(0);
  const [answered,  setAnswered]  = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [attempts,  setAttempts]  = useState(0);
  const [showHint,  setShowHint]  = useState(false);
  const [feedback,  setFeedback]  = useState(null); // { correct, explanation, xp }
  const [xpPopup,   setXpPopup]   = useState(null);
  const popupTimeout               = useRef(null);

  const q = questions[qIndex];
  const isCorrect = selected !== null && String(selected) === String(q?.answer);

  // Read question on mount / advance
  useEffect(() => {
    if (!audioEnabled || !q) return;
    const { cancel } = narrate(playReadQuestion(q.questionText), audioEnabled);
    return cancel;
  }, [qIndex, audioEnabled]);

  const handleAnswer = useCallback((option) => {
    if (answered) return;
    sounds.click(audioEnabled);
    const correct = String(option) === String(q.answer);
    const attempt = attempts + 1;
    setSelected(option);
    setAnswered(true);
    setAttempts(attempt);

    if (correct) {
      sounds.correct(audioEnabled);
      const newStreak = streak + 1;
      const xp        = calcXP(attempt, newStreak);
      setScore(s => s + 1);
      setStreak(newStreak);
      setMaxStreak(ms => Math.max(ms, newStreak));
      setTotalXP(xp_ => xp_ + xp);
      setFeedback({ correct: true, explanation: q.explanation, xp });
      setXpPopup({ xp, key: Date.now() });
      popupTimeout.current = setTimeout(() => setXpPopup(null), 1600);
    } else {
      sounds.wrong(audioEnabled);
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({ correct: false, explanation: q.explanation, xp: 0 });
      if (attempt === 1) setShowHint(true);
    }
  }, [answered, attempts, q, streak, lives]);

  const handleNextQuestion = () => {
    setAnswered(false);
    setSelected(null);
    setAttempts(0);
    setShowHint(false);
    setFeedback(null);

    if (qIndex + 1 >= questions.length) {
      // World complete
      onWorldComplete({ score, total: questions.length, maxStreak, totalXP });
    } else {
      setQIndex(qi => qi + 1);
    }
  };

  useEffect(() => () => { clearTimeout(popupTimeout.current); }, []);

  if (!q) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* HUD */}
      <div className="hud">
        <div className="hud-item">
          <span>{world.icon}</span>
          <span className="hud-value" style={{ color: world.color }}>{world.name}</span>
        </div>
        <div className="hud-item">
          <span>🔥</span>
          <span className="hud-value">{streak}</span>
        </div>
        <div className="hud-item">
          <span>⭐</span>
          <span className="hud-value">{score}</span>
          <span className="hud-label">/{qIndex + 1}</span>
        </div>
        <div className="hud-item">
          <span>✨</span>
          <span className="hud-value">{totalXP}</span>
          <span className="hud-label">XP</span>
        </div>
        <div className="hearts">
          {[1,2,3].map(i => (
            <span key={i} className={`heart${i > lives ? ' lost' : ''}`}>❤️</span>
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="question-card">
        <div className="question-counter">
          Question {qIndex + 1} of {questions.length}
        </div>
        <p className="question-text">{q.questionText}</p>

        <QuestionRenderer
          q={q}
          onAnswer={handleAnswer}
          answered={answered}
          selectedOption={selected}
          showHint={showHint}
        />

        {!answered && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button
              className="hint-toggle-btn"
              onClick={() => setShowHint(h => !h)}
            >
              {showHint ? 'Hide' : 'Show'} Hint 💡
            </button>
          </div>
        )}
      </div>

      {/* XP popup */}
      {xpPopup && (
        <XPPopup
          key={xpPopup.key}
          xp={xpPopup.xp}
          x="50%"
          y="30%"
        />
      )}

      {/* Feedback overlay */}
      {feedback && (
        <div className="feedback-overlay" onClick={handleNextQuestion}>
          <div
            className="feedback-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="feedback-emoji">
              {feedback.correct ? '🎉' : '🤔'}
            </div>
            <div className={`feedback-title ${feedback.correct ? 'correct-text' : 'wrong-text'}`}>
              {feedback.correct ? 'Correct!' : 'Not quite!'}
            </div>
            {feedback.xp > 0 && (
              <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 6 }}>
                +{feedback.xp} XP ✨
              </div>
            )}
            <p className="feedback-explanation">{feedback.explanation}</p>
            <button className="btn btn-primary" onClick={handleNextQuestion}>
              {qIndex + 1 < questions.length ? 'Next Question →' : 'Finish World! 🏆'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── World Complete Overlay ───────────────────────────────────────────────────
function WorldComplete({ world, score, total, onContinue, audioEnabled }) {
  const stars = calcStars(score, total);
  const unlocked = score >= 6;

  useEffect(() => {
    sounds.badge(audioEnabled);
    if (!audioEnabled) return;
    const { cancel } = narrate(playWorldComplete(world.name, score, total), audioEnabled);
    return cancel;
  }, []);

  return (
    <div className="world-complete-overlay">
      <div className="world-complete-card">
        <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>{world.icon}</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 700,
          color: world.color, marginBottom: 8,
        }}>
          {world.name} Complete!
        </h2>
        <StarsRow count={stars} size="2rem" />
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700,
          color: 'var(--gold)', margin: '14px 0',
        }}>
          {score} / {total}
        </p>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          color: unlocked ? 'var(--green)' : 'var(--coral)', marginBottom: 20,
        }}>
          {unlocked ? '🔓 Next world unlocked!' : '⭐ Score 6+ to unlock the next world!'}
        </p>
        <button className="btn btn-gold btn-lg" onClick={onContinue}>
          Back to World Map 🗺️
        </button>
      </div>
    </div>
  );
}

// ─── Main PlayPhase ───────────────────────────────────────────────────────────
export default function PlayPhase({ onComplete, audioEnabled }) {
  const questions     = useMemo(() => generateSessionQuestions(), []);
  const [view,        setView]         = useState('map'); // 'map' | 'intro' | 'play' | 'complete'
  const [curWorldId,  setCurWorldId]   = useState(null);
  const [worldResults,setWorldResults] = useState({});
  const [lastResult,  setLastResult]   = useState(null);

  const worldQs = (wid) => questions.filter(q => q.world === wid);

  const totalStats = useMemo(() => {
    const allResults = Object.values(worldResults);
    return {
      score:       allResults.reduce((s, r) => s + r.score, 0),
      total:       allResults.reduce((s, r) => s + r.total, 0),
      xp:          allResults.reduce((s, r) => s + (r.totalXP || 0), 0),
      maxStreak:   Math.max(0, ...allResults.map(r => r.maxStreak || 0)),
      worldResults,
    };
  }, [worldResults]);

  const handleSelectWorld = (wid) => {
    setCurWorldId(wid);
    setView('intro');
    stopAll();
  };

  const handleStartWorld = () => setView('play');

  const handleWorldComplete = (result) => {
    const updatedResults = { ...worldResults, [curWorldId]: { ...result } };
    setWorldResults(updatedResults);
    setLastResult(result);
    setView('complete');
  };

  const handleContinue = () => {
    setView('map');
    // If all 10 worlds done, offer to finish
  };

  const handleFinish = () => {
    onComplete({
      score:       totalStats.score,
      totalAnswered: totalStats.total,
      xp:          totalStats.xp,
      maxStreak:   totalStats.maxStreak,
      worldResults,
    });
  };

  const world = curWorldId !== null ? WORLDS[curWorldId] : null;
  const allDone = Object.keys(worldResults).length >= WORLDS.length;

  return (
    <div className="play-phase">
      {view === 'map' && (
        <>
          <WorldMap worldResults={worldResults} onSelectWorld={handleSelectWorld} />
          {allDone && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 12 }}>
                🏆 All worlds complete! Ready to reflect?
              </p>
              <button className="btn btn-gold btn-lg" onClick={handleFinish}>
                Go to Reflect 📓
              </button>
            </div>
          )}
          {!allDone && Object.keys(worldResults).length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button className="btn btn-outline btn-sm" onClick={handleFinish}>
                Skip to Reflect →
              </button>
            </div>
          )}
        </>
      )}

      {view === 'intro' && world && (
        <WorldIntro world={world} onStart={handleStartWorld} audioEnabled={audioEnabled} />
      )}

      {view === 'play' && world && (
        <WorldPlay
          world={world}
          questions={worldQs(curWorldId)}
          onWorldComplete={handleWorldComplete}
          audioEnabled={audioEnabled}
        />
      )}

      {view === 'complete' && world && lastResult && (
        <WorldComplete
          world={world}
          score={lastResult.score}
          total={lastResult.total}
          onContinue={handleContinue}
          audioEnabled={audioEnabled}
        />
      )}
    </div>
  );
}
