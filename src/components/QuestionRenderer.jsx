import React, { useState } from 'react';
import RulerDiagram from './RulerDiagram.jsx';
import BarModel     from './BarModel.jsx';
import LengthBar    from './LengthBar.jsx';
import { sounds }   from '../utils/audio.js';

// ─── Visual sub-components ────────────────────────────────────────────────────

function RulerVisual({ q }) {
  return (
    <RulerDiagram
      length={Math.max(30, q.lengthA + 4)}
      markedLength={q.lengthA}
      emojiChar={q.emojiChar || '✏️'}
    />
  );
}

function SentenceVisual({ q }) {
  const parts = q.questionText.match(/(\d+)\s*cm\s*([+\-])\s*(\d+)\s*cm/);
  if (!parts) return (
    <div className="tf-statement-card" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
      {q.questionText}
    </div>
  );
  const [, a, op, b] = parts;
  return (
    <div className="length-equation" aria-label={q.questionText}>
      <span className="length-eq-number">{a}</span>
      <span className="length-eq-unit">cm</span>
      <span className="length-eq-operator">{op}</span>
      <span className="length-eq-number">{b}</span>
      <span className="length-eq-unit">cm</span>
      <span className="length-eq-equals">=</span>
      <span className="length-eq-number" style={{ color: 'var(--gold)' }}>?</span>
      <span className="length-eq-unit">cm</span>
    </div>
  );
}

function BarModelVisual({ q }) {
  const isAdd = q.type === 'word_addition' || q.type === 'fill_addition';
  return (
    <BarModel
      total={isAdd ? q.answer : q.lengthA}
      partA={q.lengthA}
      partB={q.lengthB ?? 0}
      unitLabel="cm"
    />
  );
}

function LengthBarsVisual({ q }) {
  if (q.type === 'comparison') {
    const { name1, name2, lenA, lenB } = q.comparisonData || {};
    const maxLen = Math.max(lenA, lenB, 1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 20, marginBottom: 8 }}>
        <LengthBar label={name1} length={lenA} maxLength={maxLen} colorIndex={0} />
        <LengthBar label={name2} length={lenB} maxLength={maxLen} colorIndex={1} />
      </div>
    );
  }
  if (q.type === 'ordering' && q.orderingData) {
    const maxLen = Math.max(...q.orderingData.map(o => o.length), 1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 20, marginBottom: 8 }}>
        {q.orderingData.map((item, i) => (
          <LengthBar
            key={item.name}
            label={`${item.emoji || ''} ${item.name}`}
            length={item.length}
            maxLength={maxLen}
            colorIndex={i}
          />
        ))}
      </div>
    );
  }
  return null;
}

function UnitChartVisual() {
  return (
    <div className="unit-chart" aria-label="Unit reference: cm vs m">
      <div className="unit-card" style={{ cursor: 'default' }}>
        <div className="unit-card-symbol">cm</div>
        <div className="unit-card-label">centimetre</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
          short things
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold)',
      }}>
        100 cm = 1 m
      </div>
      <div className="unit-card" style={{ cursor: 'default' }}>
        <div className="unit-card-symbol">m</div>
        <div className="unit-card-label">metre</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
          long things
        </div>
      </div>
    </div>
  );
}

function TrueFalseVisual({ q }) {
  const stmt = q.questionText.replace('True or False? "', '').replace('"', '');
  return (
    <div className="tf-statement-card">
      🔎 {stmt}
    </div>
  );
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

export default function QuestionRenderer({
  q,
  onAnswer,
  answered,
  selectedOption,
  showHint,
}) {
  const correct = answered && String(selectedOption) === String(q.answer);

  function renderVisual() {
    switch (q.visual) {
      case 'ruler':       return <RulerVisual q={q} />;
      case 'sentence':    return <SentenceVisual q={q} />;
      case 'bar_model':   return <BarModelVisual q={q} />;
      case 'length_bars': return <LengthBarsVisual q={q} />;
      case 'unit_chart':  return <UnitChartVisual />;
      case 'true_false':  return <TrueFalseVisual q={q} />;
      default:            return null;
    }
  }

  const isTwoOpt = q.options?.length === 2;
  const colClass = isTwoOpt ? 'options-grid' : 'options-grid';

  return (
    <div>
      {/* Visual */}
      {renderVisual()}

      {/* Hint */}
      {showHint && (
        <div className="hint-box" role="note">
          💡 {q.hint1}
        </div>
      )}

      {/* Options */}
      <div className={colClass} style={isTwoOpt ? { gridTemplateColumns: '1fr 1fr' } : {}}>
        {q.options?.map((opt, i) => {
          const strOpt  = String(opt);
          const isRight = String(q.answer) === strOpt;
          let cls = 'option-btn';
          if (answered) {
            cls += ' disabled';
            if (strOpt === String(selectedOption)) cls += isRight ? ' correct' : ' wrong';
            else if (isRight) cls += ' correct';
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !answered && onAnswer(opt)}
              aria-label={`Option: ${strOpt}`}
              aria-pressed={answered && strOpt === String(selectedOption)}
            >
              {strOpt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
