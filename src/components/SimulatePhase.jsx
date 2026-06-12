import React, { useState, useEffect, useCallback } from 'react';
import RulerDiagram from './RulerDiagram.jsx';
import LengthBar    from './LengthBar.jsx';
import BarModel     from './BarModel.jsx';
import { narrate, sounds } from '../utils/audio.js';
import {
  simulateStation1Intro,
  simulateStation2Intro,
  simulateStation3Intro,
  simulateCorrectNarration,
  simulateOrderCorrectNarration,
  simulateSentenceCorrectNarration,
} from '../utils/narration.js';

const STATIONS = [
  { id: 0, title: 'Ruler Tap',         subtitle: 'Measure with cm',   icon: '📏' },
  { id: 1, title: 'Length Comparator', subtitle: 'Compare & Order',   icon: '📊' },
  { id: 2, title: 'Length Sentence',   subtitle: 'Add & Subtract cm', icon: '🔢' },
];

const TOTAL_ROUNDS = 3;

// ─── STATION 1: Ruler Tap ─────────────────────────────────────────────────────
function RulerStation({ onStationDone, audioEnabled }) {
  const [round,      setRound]      = useState(0);
  const [target,     setTarget]     = useState(0);
  const [emoji,      setEmoji]      = useState('✏️');
  const [selected,   setSelected]   = useState(null);
  const [done,       setDone]       = useState(false);

  const EMOJIS = ['✏️', '🖍️', '🌿', '🥢', '🎀'];

  const setupRound = useCallback((r) => {
    const lengths = [8, 10, 12, 14, 15, 17, 18, 20, 22, 24, 25];
    setTarget(lengths[r % lengths.length]);
    setEmoji(EMOJIS[r % EMOJIS.length]);
    setSelected(null);
    setDone(false);
  }, []);

  useEffect(() => { setupRound(0); }, []);

  useEffect(() => {
    if (!audioEnabled) return;
    const { cancel } = narrate(simulateStation1Intro(), audioEnabled);
    return cancel;
  }, [audioEnabled]);

  const handleTap = (cm) => {
    if (done) return;
    setSelected(cm);
    if (cm === target) {
      setDone(true);
      sounds.correct(audioEnabled);
      if (audioEnabled) narrate(simulateCorrectNarration(target), audioEnabled);
    } else {
      sounds.wrong(audioEnabled);
    }
  };

  const handleNext = () => {
    if (round + 1 >= TOTAL_ROUNDS) { onStationDone(); return; }
    const nr = round + 1;
    setRound(nr);
    setupRound(nr);
    if (audioEnabled) narrate(simulateStation1Intro(), audioEnabled);
  };

  return (
    <div>
      <p className="ruler-instruction">
        Find where the <strong>{emoji}</strong> ends on the ruler. Tap that number!
      </p>

      <div className="station-round-dots">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={`station-round-dot${i < round ? ' done' : i === round ? ' active' : ''}`}
          />
        ))}
      </div>

      <RulerDiagram
        length={30}
        markedLength={target}
        selected={done ? target : selected}
        onSelect={!done ? handleTap : undefined}
        emojiChar={emoji}
      />

      {!done ? (
        <p style={{
          textAlign: 'center', color: 'var(--text-secondary)',
          fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginTop: 12,
        }}>
          Tap the number on the ruler where the {emoji} ends!
        </p>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <p style={{
            color: 'var(--green)', fontFamily: 'var(--font-display)',
            fontSize: '1.15rem', fontWeight: 700, marginBottom: 14,
          }}>
            ✅ The {emoji} is <strong>{target} cm</strong> long! Great measuring!
          </p>
          <button className="btn btn-primary" onClick={handleNext}>
            {round + 1 < TOTAL_ROUNDS ? 'Next Round →' : 'Next Station →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── STATION 2: Length Comparator ────────────────────────────────────────────
function ComparatorStation({ onStationDone, audioEnabled }) {
  const [round,     setRound]     = useState(0);
  const [items,     setItems]     = useState([]);
  const [tapOrder,  setTapOrder]  = useState([]);
  const [done,      setDone]      = useState(false);

  const ITEM_POOL = [
    { name: 'Pencil', emoji: '✏️' },
    { name: 'Ribbon', emoji: '🎀' },
    { name: 'Straw',  emoji: '🥤' },
    { name: 'Worm',   emoji: '🪱' },
    { name: 'Stick',  emoji: '🪵' },
    { name: 'Crayon', emoji: '🖍️' },
  ];

  const COLORS = ['#8b5cf6', '#4caf50', '#ff7043'];

  const setupRound = useCallback(() => {
    const shuffled = [...ITEM_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
    let lengths;
    do { lengths = shuffled.map(() => Math.floor(Math.random() * 22) + 5); }
    while (new Set(lengths).size < 3);
    shuffled.forEach((o, i) => { o.length = lengths[i]; o.color = COLORS[i]; });
    setItems(shuffled);
    setTapOrder([]);
    setDone(false);
  }, []);

  useEffect(() => { setupRound(); }, [round]);

  useEffect(() => {
    if (!audioEnabled) return;
    const { cancel } = narrate(simulateStation2Intro(), audioEnabled);
    return cancel;
  }, [audioEnabled, round]);

  const handleTap = (name) => {
    if (done || tapOrder.includes(name)) return;
    const newOrder = [...tapOrder, name];
    setTapOrder(newOrder);
    sounds.click(audioEnabled);
    if (newOrder.length === items.length) {
      const sorted = [...items].sort((a, b) => a.length - b.length).map(i => i.name);
      const correct = JSON.stringify(newOrder) === JSON.stringify(sorted);
      if (correct) {
        setDone(true);
        sounds.correct(audioEnabled);
        if (audioEnabled) narrate(simulateOrderCorrectNarration(), audioEnabled);
      } else {
        sounds.wrong(audioEnabled);
        setTimeout(() => setTapOrder([]), 700);
      }
    }
  };

  const maxLen = items.length ? Math.max(...items.map(i => i.length)) : 30;

  const handleNext = () => {
    if (round + 1 >= TOTAL_ROUNDS) { onStationDone(); return; }
    setRound(r => r + 1);
  };

  return (
    <div>
      <p style={{
        textAlign: 'center', color: 'var(--text-secondary)',
        fontFamily: 'var(--font-display)', fontSize: '0.97rem', marginBottom: 16,
      }}>
        Tap the bars <strong style={{ color: 'var(--gold)' }}>shortest → longest</strong>
      </p>

      <div className="station-round-dots">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={`station-round-dot${i < round ? ' done' : i === round ? ' active' : ''}`}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8, paddingRight: 20 }}>
        {items.map((item, idx) => {
          const tapIdx = tapOrder.indexOf(item.name);
          return (
            <LengthBar
              key={item.name}
              label={`${item.emoji} ${item.name}`}
              length={item.length}
              maxLength={maxLen}
              colorIndex={idx}
              onClick={() => handleTap(item.name)}
              badgeNum={tapIdx >= 0 ? tapIdx + 1 : undefined}
              isSelected={tapOrder.includes(item.name)}
            />
          );
        })}
      </div>

      {done && (
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <p style={{
            color: 'var(--green)', fontFamily: 'var(--font-display)',
            fontSize: '1.1rem', fontWeight: 700, marginBottom: 14,
          }}>
            ✅ Shortest to longest — well done!
          </p>
          <button className="btn btn-primary" onClick={handleNext}>
            {round + 1 < TOTAL_ROUNDS ? 'Next Round →' : 'Next Station →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── STATION 3: Length Sentence ───────────────────────────────────────────────
function SentenceStation({ onStationDone, audioEnabled }) {
  const [round,     setRound]     = useState(0);
  const [a,         setA]         = useState(0);
  const [b,         setB]         = useState(0);
  const [op,        setOp]        = useState('+');
  const [answer,    setAnswer]    = useState(0);
  const [input,     setInput]     = useState('');
  const [correct,   setCorrect]   = useState(false);
  const [showHint,  setShowHint]  = useState(false);

  const setupRound = useCallback((r) => {
    const aVal = Math.floor(Math.random() * 18) + 5;
    const bVal = Math.floor(Math.random() * 12) + 2;
    const useAdd = Math.random() > 0.5 || r % 2 === 0;
    setA(useAdd ? aVal : aVal + bVal);
    setB(bVal);
    setOp(useAdd ? '+' : '-');
    setAnswer(useAdd ? aVal + bVal : aVal);
    setInput('');
    setCorrect(false);
    setShowHint(false);
  }, []);

  useEffect(() => { setupRound(round); }, [round]);

  useEffect(() => {
    if (!audioEnabled) return;
    const { cancel } = narrate(simulateStation3Intro(), audioEnabled);
    return cancel;
  }, [audioEnabled, round]);

  const handleDigit = (d) => {
    if (correct || input.length >= 3) return;
    sounds.click(audioEnabled);
    setInput(prev => prev + d);
  };

  const handleClear = () => {
    if (correct) return;
    setInput('');
  };

  useEffect(() => {
    if (input.length === 0 || correct) return;
    if (parseInt(input, 10) === answer) {
      setCorrect(true);
      sounds.correct(audioEnabled);
      if (audioEnabled) narrate(simulateSentenceCorrectNarration(), audioEnabled);
    } else if (input.length >= answer.toString().length + 1) {
      sounds.wrong(audioEnabled);
      setTimeout(() => setInput(''), 600);
    }
  }, [input, answer, correct, audioEnabled]);

  const handleNext = () => {
    if (round + 1 >= TOTAL_ROUNDS) { onStationDone(); return; }
    setRound(r => r + 1);
  };

  return (
    <div>
      <p style={{
        textAlign: 'center', color: 'var(--text-secondary)',
        fontFamily: 'var(--font-display)', fontSize: '0.97rem', marginBottom: 8,
      }}>
        Use the number pad to fill in the blank!
      </p>

      <div className="station-round-dots">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={`station-round-dot${i < round ? ' done' : i === round ? ' active' : ''}`}
          />
        ))}
      </div>

      {/* Equation display */}
      <div className="length-equation" aria-label={`${a} cm ${op} ${b} cm = ?`}>
        <span className="length-eq-number">{a}</span>
        <span className="length-eq-unit">cm</span>
        <span className="length-eq-operator">{op}</span>
        <span className="length-eq-number">{b}</span>
        <span className="length-eq-unit">cm</span>
        <span className="length-eq-equals">=</span>
        <div className={`length-eq-blank${correct ? ' correct' : ''}`}>
          {input || <span style={{ color: 'var(--text-muted)', fontSize: '1.8rem' }}>_</span>}
        </div>
        <span className="length-eq-unit">cm</span>
      </div>

      {/* Bar model hint */}
      {showHint && (
        <BarModel
          total={op === '+' ? a + b : a}
          partA={op === '+' ? a : b}
          partB={op === '+' ? b : a - b}
          unitLabel="cm"
        />
      )}

      {!correct ? (
        <>
          <button
            className="hint-toggle-btn"
            style={{ display: 'block', margin: '8px auto 12px' }}
            onClick={() => setShowHint(h => !h)}
          >
            {showHint ? 'Hide' : 'Show'} Bar Model Hint 📊
          </button>

          {/* Number pad */}
          <div className="number-pad" role="group" aria-label="Number pad">
            {[1,2,3,4,5,6,7,8,9].map(d => (
              <button
                key={d}
                className="number-pad-btn"
                onClick={() => handleDigit(String(d))}
                aria-label={String(d)}
              >
                {d}
              </button>
            ))}
            <button
              className="number-pad-btn"
              onClick={() => handleDigit('0')}
              aria-label="0"
            >
              0
            </button>
            <button
              className="number-pad-btn number-pad-clear"
              onClick={handleClear}
              aria-label="Clear"
            >
              Clear ✕
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <p style={{
            color: 'var(--green)', fontFamily: 'var(--font-display)',
            fontSize: '1.15rem', fontWeight: 700, marginBottom: 14,
          }}>
            ✅ {a} cm {op} {b} cm = <strong>{answer} cm</strong> — correct!
          </p>
          <button className="btn btn-primary" onClick={handleNext}>
            {round + 1 < TOTAL_ROUNDS ? 'Next Round →' : 'Finish Simulate! 🎮'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN SimulatePhase ───────────────────────────────────────────────────────
export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const [doneStations, setDoneStations] = useState(new Set());

  const handleStationDone = () => {
    setDoneStations(prev => new Set([...prev, station]));
    if (station < STATIONS.length - 1) setStation(s => s + 1);
    else onComplete();
  };

  const S = STATIONS[station];

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h2 className="section-heading">🧪 Simulate</h2>
        <p className="section-subheading">Explore length measurement hands-on!</p>

        {/* Station tabs */}
        <div className="station-tabs">
          {STATIONS.map((st, i) => (
            <div
              key={st.id}
              className={`station-tab${i === station ? ' active' : doneStations.has(i) ? ' done' : ''}`}
            >
              {st.icon}
              <span className="step-label" style={{ display: 'inline' }}>{st.title}</span>
              {doneStations.has(i) && ' ✓'}
            </div>
          ))}
        </div>
      </div>

      <div className="station-card" key={station}>
        <div className="station-header">
          <div className="station-icon">{S.icon}</div>
          <div>
            <div className="station-title">{S.title}</div>
            <div className="station-subtitle">{S.subtitle}</div>
          </div>
        </div>

        {station === 0 && (
          <RulerStation onStationDone={handleStationDone} audioEnabled={audioEnabled} />
        )}
        {station === 1 && (
          <ComparatorStation onStationDone={handleStationDone} audioEnabled={audioEnabled} />
        )}
        {station === 2 && (
          <SentenceStation onStationDone={handleStationDone} audioEnabled={audioEnabled} />
        )}
      </div>
    </div>
  );
}
