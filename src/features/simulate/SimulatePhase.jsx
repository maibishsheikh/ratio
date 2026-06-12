import { useState, useCallback } from 'react';
import QuestionRenderer from '../play/QuestionRenderer';
import { randInt, pick, buildOptions, numDistractors } from '../../utils/ratioQuestionBank';

const ROUNDS_PER_STATION = 3;

// ── Small, gentle generators for the Simulate phase ──
function genSimRatio() {
  const g = pick([2, 3, 4]);
  let sa = randInt(1, 5), sb = randInt(1, 5);
  while (sb === sa) sb = randInt(1, 5);
  const a = sa * g, b = sb * g;
  const correct = `${sa}:${sb}`;
  const candidates = [`${a}:${b}`, `${sb}:${sa}`, `${sa + 1}:${sb}`].filter(c => c !== correct);
  return {
    topic: 'Ratios', visual: 'ratio_bar',
    barA: a, barB: b, barLabelA: `${a}`, barLabelB: `${b}`, barMissing: 'none',
    questionText: `Simplify the ratio ${a} : ${b} to its simplest form.`,
    explanation: `${g} divides evenly into both numbers. ${a}:${b} = ${sa}:${sb}.`,
    options: buildOptions(correct, candidates),
    correctAnswer: correct,
  };
}

function genSimRate() {
  const speed = pick([10, 20, 30, 40, 50]);
  const time = randInt(1, 3);
  const distance = speed * time;
  const correct = `${speed} km/h`;
  return {
    topic: 'Rates', visual: 'sentence',
    questionText: `A car 🚗 travels ${distance} km in ${time} hour${time === 1 ? '' : 's'}.\nWhat is its speed?`,
    explanation: `Speed = Distance ÷ Time = ${distance} ÷ ${time} = ${speed} km/h.`,
    options: buildOptions(correct, numDistractors(speed, 3, 15).map(v => `${v} km/h`)),
    correctAnswer: correct,
  };
}

function genSimProportion() {
  let a = randInt(1, 5), b = randInt(1, 5);
  while (b === a) b = randInt(1, 5);
  const k = randInt(2, 3);
  let c = a * k, d = b * k;
  const isTrue = Math.random() > 0.5;
  if (!isTrue) {
    d = d + (Math.random() > 0.5 ? 1 : -1);
    if (d <= 0) d = b * k + 1;
  }
  const equal = a * d === b * c;
  return {
    topic: 'Proportions', visual: 'proportion', propA: a, propB: b, propC: c, propD: d,
    questionText: `Is this a true proportion?\n\n${a} : ${b}   =   ${c} : ${d}`,
    explanation: `${a}×${d} = ${a * d} and ${b}×${c} = ${b * c}. ${equal ? 'They are equal — it IS a proportion! ✅' : 'They are different — NOT a proportion. ❌'}`,
    options: ['True', 'False'],
    correctAnswer: equal ? 'True' : 'False',
  };
}

const STATIONS = [
  { id: 0, icon: '🔴', title: 'Ratio Builder',     subtitle: 'Build & simplify ratios',     generate: genSimRatio },
  { id: 1, icon: '🚗', title: 'Rate Detective',     subtitle: 'Crack the speed code',        generate: genSimRate },
  { id: 2, icon: '⚖️', title: 'Proportion Checker', subtitle: 'Cross-multiply to verify',    generate: genSimProportion },
];

function SimStation({ icon, title, subtitle, generate, onNext, isLast }) {
  const [round, setRound]       = useState(0);
  const [question, setQuestion] = useState(() => generate());
  const [result, setResult]     = useState(null); // { correct, explanation }

  const handleAnswer = useCallback((isCorrect) => {
    setResult({ correct: isCorrect, explanation: question.explanation });
  }, [question]);

  const handleNext = useCallback(() => {
    if (round + 1 < ROUNDS_PER_STATION) {
      setRound(r => r + 1);
      setQuestion(generate());
      setResult(null);
    } else {
      onNext();
    }
  }, [round, generate, onNext]);

  return (
    <div>
      <div className="station-header">
        <h2>{icon} {title}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>{subtitle}</p>
      </div>

      <QuestionRenderer question={question} onAnswer={handleAnswer} disabled={result !== null} />

      {result && (
        <div style={{
          marginTop: 16, padding: '14px 18px', borderRadius: 14,
          background: result.correct ? 'rgba(76,175,80,0.15)' : 'rgba(239,83,80,0.1)',
          border: `1px solid ${result.correct ? 'rgba(76,175,80,0.4)' : 'rgba(239,83,80,0.3)'}`,
          animation: 'slideUp 0.3s ease',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 6, fontSize: '1rem',
            color: result.correct ? 'var(--green-light)' : 'var(--red-light)',
          }}>
            {result.correct ? '🎉 Correct!' : '💡 Not quite!'}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            {result.explanation}
          </p>
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button className="btn btn-primary btn-sm" onClick={handleNext}>
              {round + 1 < ROUNDS_PER_STATION
                ? 'Try Another →'
                : isLast ? "🎉 Let's Play!" : 'Next Station →'}
            </button>
          </div>
        </div>
      )}

      <div className="station-round-label">Round {round + 1} / {ROUNDS_PER_STATION}</div>
    </div>
  );
}

export default function SimulatePhase({ onComplete }) {
  const [station, setStation] = useState(0);

  const next = useCallback(() => {
    if (station < STATIONS.length - 1) setStation(s => s + 1);
    else onComplete();
  }, [station, onComplete]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Practice with instant feedback before you Play!</p>
      </div>

      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ maxWidth: 700, width: '100%', animation: 'slideUp 0.4s ease' }}>
        <SimStation
          key={station}
          icon={STATIONS[station].icon}
          title={STATIONS[station].title}
          subtitle={STATIONS[station].subtitle}
          generate={STATIONS[station].generate}
          onNext={next}
          isLast={station === STATIONS.length - 1}
        />
      </div>
    </div>
  );
}
