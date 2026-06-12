import { useState, useCallback } from 'react';

const REFLECT_QUESTIONS = [
  {
    emoji: '⚖️',
    question: 'A bag has 3 red beads and 5 blue beads. What is the ratio of red to blue?',
    options: [
      { text: '3 : 5', emoji: '✅', correct: true  },
      { text: '5 : 3', emoji: '🔁', correct: false },
      { text: '3 : 8', emoji: '🤔', correct: false },
      { text: '8 : 3', emoji: '❌', correct: false },
    ],
    explain: 'Ratio of red to blue = 3 : 5. Always match the order the question asks!',
  },
  {
    emoji: '🚗',
    question: 'A car travels 90 km in 3 hours. What is its speed?',
    options: [
      { text: '30 km/h', emoji: '✅', correct: true  },
      { text: '270 km/h', emoji: '🚀', correct: false },
      { text: '87 km/h', emoji: '🤔', correct: false },
      { text: '93 km/h', emoji: '❌', correct: false },
    ],
    explain: 'Speed = Distance ÷ Time = 90 ÷ 3 = 30 km/h.',
  },
  {
    emoji: '🍎',
    question: 'If 4 apples cost $2, how much do 12 apples cost?',
    options: [
      { text: '$6',  emoji: '✅', correct: true  },
      { text: '$8',  emoji: '🤔', correct: false },
      { text: '$24', emoji: '❌', correct: false },
      { text: '$4',  emoji: '🤔', correct: false },
    ],
    explain: '4 apples → $2. Scale ×3: 12 apples → $6. That\'s proportion!',
  },
  {
    emoji: '🔢',
    question: 'The ratio 4 : 6 in its simplest form is…',
    options: [
      { text: '2 : 3', emoji: '✅', correct: true  },
      { text: '4 : 6', emoji: '🤔', correct: false },
      { text: '1 : 2', emoji: '❌', correct: false },
      { text: '3 : 2', emoji: '🔁', correct: false },
    ],
    explain: 'Divide both by their GCD (2): 4÷2 = 2, 6÷2 = 3 → 2 : 3.',
  },
  {
    emoji: '🏗️',
    question: 'Are 2 : 5 and 6 : 15 in proportion?',
    options: [
      { text: 'Yes! 2×15 = 5×6', emoji: '✅', correct: true  },
      { text: 'No, they\'re different', emoji: '❌', correct: false },
      { text: 'Only if simplified', emoji: '🤔', correct: false },
      { text: 'Can\'t tell',         emoji: '😕', correct: false },
    ],
    explain: 'Cross multiply: 2×15 = 30 and 5×6 = 30. Equal products → proportion! ✓',
  },
];

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#ffc107','#4caf50','#8b5cf6','#ef5350','#3b82f6'][i % 5],
    delay: Math.random() * 0.8,
    dur: 2 + Math.random() * 1.5,
    size: 6 + Math.random() * 8,
  }));
  return (
    <div className="confetti-container" aria-hidden>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece"
          style={{ left:`${p.x}%`, background:p.color, width:p.size, height:p.size*1.4,
            animationDelay:`${p.delay}s`, animationDuration:`${p.dur}s` }} />
      ))}
    </div>
  );
}

export default function ReflectPhase({ stats, onRestart, onGoHome }) {
  const [qIdx, setQIdx]       = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked]   = useState(null);
  const [done, setDone]       = useState(false);

  const q = REFLECT_QUESTIONS[qIdx];
  const correctCount = answers.filter(Boolean).length;

  const handlePick = useCallback((opt, i) => {
    if (picked !== null) return;
    setPicked(i);
    const wasCorrect = opt.correct;
    setTimeout(() => {
      const newAnswers = [...answers, wasCorrect];
      setAnswers(newAnswers);
      setPicked(null);
      if (qIdx + 1 < REFLECT_QUESTIONS.length) {
        setQIdx(n => n + 1);
      } else {
        setDone(true);
      }
    }, 1600);
  }, [picked, answers, qIdx]);

  /* ── Certificate ── */
  if (done) {
    const totalScore = stats ? `${stats.score}/${stats.total ?? (stats.worldResults ? Object.values(stats.worldResults).reduce((a,r)=>a+r.total,0) : 105)}` : '—';
    const xp = stats?.xp ?? 0;
    const reflectScore = `${correctCount}/${REFLECT_QUESTIONS.length}`;
    const pct = Math.round((correctCount / REFLECT_QUESTIONS.length) * 100);
    const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;

    return (
      <>
        {stars >= 2 && <Confetti />}
        <div className="reflect-phase">
          <div className="certificate-card">
            <div className="cert-badge">🏆</div>
            <h2 className="cert-title">
              {pct >= 80 ? 'Ratio Master!' : pct >= 60 ? 'Well Done!' : 'Keep Practising!'}
            </h2>
            <p className="cert-subtitle">
              {pct >= 80
                ? 'You have mastered Ratios, Rates & Proportions!'
                : pct >= 60
                ? 'Good effort — you\'re getting there!'
                : 'Ratios take practice — you\'ve got this!'}
            </p>

            {/* Stars */}
            <div style={{ display:'flex', justifyContent:'center', gap:10, margin:'8px 0 16px', fontSize:'2rem' }}>
              {[1,2,3].map(s => (
                <span key={s} style={{ opacity: s <= stars ? 1 : 0.2,
                  animation: s <= stars ? `bounceIn 0.4s ease ${s*0.15}s both` : 'none' }}>⭐</span>
              ))}
            </div>

            {/* Stats */}
            <div className="cert-stats">
              <div className="cert-stat">
                <div className="cert-stat-value" style={{ color:'var(--gold)' }}>{xp}</div>
                <div className="cert-stat-label">XP Earned</div>
              </div>
              <div className="cert-stat">
                <div className="cert-stat-value" style={{ color:'var(--green)' }}>{totalScore}</div>
                <div className="cert-stat-label">Play Score</div>
              </div>
              <div className="cert-stat">
                <div className="cert-stat-value" style={{ color:'var(--purple-light)' }}>{reflectScore}</div>
                <div className="cert-stat-label">Reflect</div>
              </div>
            </div>

            {/* Key lessons */}
            <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:16, padding:'16px 20px', margin:'16px 0', textAlign:'left' }}>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.95rem',
                color:'var(--gold)', marginBottom:10 }}>📚 What You Learned:</p>
              {[
                '⚖️ Ratios compare two quantities (e.g. 3 : 5)',
                '🚗 Rates compare different units (e.g. 60 km/h)',
                '📐 Proportions are equal ratios (cross-multiply to check)',
                '✂️ Simplify ratios by dividing by the GCD',
              ].map((lesson, i) => (
                <p key={i} style={{ fontSize:'0.9rem', color:'var(--text-secondary)',
                  padding:'6px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  fontFamily:'var(--font-body)', lineHeight:1.5 }}>
                  {lesson}
                </p>
              ))}
            </div>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
              <button className="btn btn-outline btn-sm" onClick={onGoHome}>🏠 Home</button>
              <button className="btn btn-primary" onClick={onRestart}>🔄 Play Again</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Questions ── */
  const pct = Math.round((qIdx / REFLECT_QUESTIONS.length) * 100);

  return (
    <div className="reflect-phase">
      <div className="reflect-header">
        <div className="reflect-label">📓 Reflect — What Did You Learn?</div>
        <div className="reflect-sublabel">Question {qIdx + 1} of {REFLECT_QUESTIONS.length}</div>
      </div>

      {/* Progress */}
      <div style={{ width:'100%', maxWidth:560, marginBottom:20 }}>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width:`${pct}%` }} />
        </div>
        <div className="reflect-progress">
          {REFLECT_QUESTIONS.map((_, i) => (
            <div key={i} className={`reflect-dot ${i === qIdx ? 'active' : i < qIdx ? 'done' : ''}`} />
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="reflect-card" style={{ animation:'slideUp 0.35s ease' }}>
        {/* Mascot */}
        <div className="mascot-container" style={{ marginBottom:16 }}>
          <div className="mascot">🧮</div>
          <div className="speech-bubble" style={{ fontSize:'0.9rem' }}>
            Let's see what you remember! 🧠
          </div>
        </div>

        {/* Question */}
        <span style={{ fontSize:'2.5rem', display:'block', marginBottom:12 }}>{q.emoji}</span>
        <h3 className="reflect-card-title" style={{ fontSize:'1.4rem' }}>{q.question}</h3>

        {/* Options */}
        <div className="reflect-options">
          {q.options.map((opt, i) => {
            let cls = 'reflect-option';
            if (picked !== null) {
              if (opt.correct)  cls += ' correct';
              else if (i === picked) cls += ' wrong';
              else cls += ' wrong';
            }
            return (
              <button key={i} className={cls}
                onClick={() => handlePick(opt, i)}
                disabled={picked !== null}>
                <span className="reflect-option-emoji">{opt.emoji}</span>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem' }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {picked !== null && (
          <div style={{
            marginTop:12, padding:'14px 18px',
            background: q.options[picked].correct ? 'rgba(76,175,80,0.15)' : 'rgba(239,83,80,0.1)',
            border: `1px solid ${q.options[picked].correct ? 'rgba(76,175,80,0.4)' : 'rgba(239,83,80,0.3)'}`,
            borderRadius:14, animation:'slideUp 0.3s ease',
          }}>
            <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem',
              color: q.options[picked].correct ? 'var(--green-light)' : 'var(--red-light)',
              marginBottom:6 }}>
              {q.options[picked].correct ? '🎉 Correct!' : '😢 Not quite!'}
            </p>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', lineHeight:1.6 }}>
              {q.explain}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
