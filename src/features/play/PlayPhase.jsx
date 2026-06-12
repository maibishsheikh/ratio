import { useState, useCallback } from 'react';
import { generateSessionQuestions, WORLDS } from '../../utils/ratioQuestionBank';
import QuestionRenderer from './QuestionRenderer';

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  if (pct >= 0.3) return 1;
  return 0;
}

export default function PlayPhase({ onComplete }) {
  const [currentWorld, setCurrentWorld]   = useState(-1);
  const [worldQuestions, setWorldQuestions] = useState([]);
  const [worldResults, setWorldResults]   = useState({});
  const [qIndex, setQIndex]   = useState(0);
  const [score, setScore]     = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak]   = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives]     = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [worldComplete, setWorldComplete] = useState(false);

  const q = worldQuestions[qIndex];

  const finishWorld = useCallback(() => {
    const stars = calcStars(score, worldQuestions.length);
    setWorldResults(prev => ({ ...prev, [currentWorld]: { score, total: worldQuestions.length, stars } }));
    setWorldComplete(true);
  }, [currentWorld, score, worldQuestions.length]);

  const advance = useCallback(() => {
    setFeedback(null); setAnswered(false);
    if (qIndex + 1 < worldQuestions.length && lives > 0) {
      setQIndex(i => i + 1);
    } else {
      finishWorld();
    }
  }, [qIndex, worldQuestions.length, lives, finishWorld]);

  const handleAnswer = useCallback((isCorrect) => {
    setAnswered(true);
    if (isCorrect) {
      const ns = streak + 1;
      const xp = ns >= 5 ? 15 : 10;
      setScore(s => s + 1); setStreak(ns);
      setMaxStreak(ms => Math.max(ms, ns)); setTotalXP(x => x + xp);
      setXpPopup(`+${xp} XP ⭐`);
      setTimeout(() => setXpPopup(null), 1400);
      setFeedback({
        type: 'correct',
        message: ns >= 5 ? `🔥 ${ns} Streak!` : '🎉 Correct!',
        sub: q?.explanation || '',
      });
      setTimeout(advance, 1800);
    } else {
      setStreak(0); setLives(l => l - 1);
      setFeedback({ type: 'wrong', message: '😢 Not quite!', sub: q?.explanation || '' });
      if (lives - 1 <= 0) setTimeout(finishWorld, 2000);
      else setTimeout(advance, 2200);
    }
  }, [streak, q, advance, lives, finishWorld]);

  const startWorld = useCallback((id) => {
    // Generate a fresh, randomized 100-question session and pick this world's slice
    const session = generateSessionQuestions();
    const filtered = session.filter(item => item.world === id);
    setWorldQuestions(filtered);
    setCurrentWorld(id); setQIndex(0); setScore(0); setLives(3);
    setStreak(0); setWorldComplete(false); setFeedback(null); setAnswered(false);
  }, []);

  const backToMap = useCallback(() => {
    setCurrentWorld(-1); setWorldComplete(false); setFeedback(null);
  }, []);

  const handleAllComplete = useCallback(() => {
    const totalScore = Object.values(worldResults).reduce((a, r) => a + r.score, 0);
    onComplete({ score: totalScore, xp: totalXP, maxStreak, worldResults });
  }, [worldResults, totalXP, maxStreak, onComplete]);

  /* ── World Map ── */
  if (currentWorld < 0) {
    const allDone = WORLDS.every((_, i) => worldResults[i]);
    return (
      <div className="play-phase">
        <div className="play-header">
          <h2 className="play-title">🎮 Choose Your World!</h2>
          <p className="play-subtitle">Beat each world to unlock the next. Earn stars and XP!</p>
          {totalXP > 0 && <div className="play-xp-badge">⭐ {totalXP} XP earned</div>}
        </div>

        <div className="world-map">
          {WORLDS.map((w, i) => {
            const unlocked  = i === 0 || worldResults[i - 1];
            const completed = worldResults[i];
            return (
              <div
                key={w.id}
                className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => unlocked && startWorld(i)}
                style={{ '--world-color': w.color }}
              >
                <div className="world-icon-big">{w.icon}</div>
                <div className="world-info">
                  <div className="world-name">{w.name}</div>
                  <div className="world-desc">{w.desc}</div>
                  {completed && (
                    <div className="world-stars">
                      {[1,2,3].map(s => (
                        <span key={s} style={{ opacity: s <= completed.stars ? 1 : 0.2, fontSize: '1.1rem' }}>⭐</span>
                      ))}
                      <span className="world-score-txt">{completed.score}/{completed.total}</span>
                    </div>
                  )}
                </div>
                {!unlocked ? (
                  <div className="world-lock-icon">🔒</div>
                ) : !completed ? (
                  <div className="world-play-btn" style={{ background: w.color }}>▶ PLAY</div>
                ) : (
                  <div className="world-play-btn" style={{ background: 'var(--green)' }}>↺ REDO</div>
                )}
              </div>
            );
          })}
        </div>

        {allDone && (
          <button
            className="btn btn-green btn-lg"
            onClick={handleAllComplete}
            style={{ marginTop: 28, animation: 'bounceIn 0.5s ease' }}
          >
            🏆 Complete Challenge!
          </button>
        )}
      </div>
    );
  }

  /* ── World Complete ── */
  if (worldComplete) {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    const isLast = currentWorld === WORLDS.length - 1;
    return (
      <div className="play-phase">
        <div className="world-complete-card">
          <div className="world-complete-icon">{w.icon}</div>
          <h2 className="world-complete-title">{w.name} Complete!</h2>
          <div className="world-complete-score">{score}/{worldQuestions.length}</div>
          <div className="world-complete-stars">
            {[1,2,3].map(s => (
              <span key={s} className={`world-star ${s <= stars ? 'earned' : ''}`}
                style={{ animationDelay: `${s * 0.2}s` }}>⭐</span>
            ))}
          </div>
          <div className="world-complete-xp">⭐ {totalXP} XP earned</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={backToMap}>← World Map</button>
            {isLast ? (
              <button className="btn btn-green" onClick={handleAllComplete}>🏆 Finish!</button>
            ) : (
              <button className="btn btn-primary" onClick={() => {
                setWorldResults(prev => ({ ...prev, [currentWorld]: { score, total: worldQuestions.length, stars } }));
                startWorld(currentWorld + 1);
              }}>Next World →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Question View ── */
  if (!q) return null;
  const w = WORLDS[currentWorld];
  const pct = Math.round((qIndex / worldQuestions.length) * 100);

  return (
    <div className="play-phase">
      <div className="play-world-badge" style={{ background: w.color }}>
        {w.icon} {w.name}
      </div>

      {/* HUD */}
      <div className="hud" style={{ maxWidth: 700 }}>
        <div className="hud-item">⭐ {totalXP} XP</div>
        <div className="hearts">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
        <div className={`hud-item ${streak >= 5 ? 'streak-fire' : ''}`}>🔥 {streak}×</div>
      </div>

      {/* Progress */}
      <div style={{ width: '100%', maxWidth: 700, marginBottom: 14 }}>
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>Question {qIndex + 1} / {worldQuestions.length}</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Question card — scrollable if content overflows on small screens */}
      <div className="question-card" style={{
        animation: 'slideUp 0.3s ease',
        overflowY: 'auto',
        maxHeight: 'calc(100dvh - 230px)',
      }}>
        <QuestionRenderer question={q} onAnswer={handleAnswer} disabled={answered} />
      </div>

      {/* XP popup */}
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}

      {/* Feedback overlay */}
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">
              {feedback.type === 'correct' ? '🎉' : '😢'}
            </div>
            <div className="feedback-message">{feedback.message}</div>
            <div className="feedback-sub">{feedback.sub}</div>
          </div>
        </div>
      )}
    </div>
  );
}
