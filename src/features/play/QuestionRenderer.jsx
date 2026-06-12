import { useState, useCallback } from 'react';
import { RatioBarDiagram, PictureRatio, ProportionVisual } from './visuals';

function Visual({ question }) {
  switch (question.visual) {
    case 'ratio_bar':
      return (
        <RatioBarDiagram
          partA={question.barA} partB={question.barB}
          labelA={question.barLabelA} labelB={question.barLabelB}
          missing={question.barMissing} total={question.barTotal}
        />
      );
    case 'picture':
      return <PictureRatio a={question.pictureA} b={question.pictureB} emojiA={question.emojiA} emojiB={question.emojiB} />;
    case 'proportion':
      return <ProportionVisual a={question.propA} b={question.propB} c={question.propC} d={question.propD} />;
    default:
      return null;
  }
}

const TOPIC_ICONS = {
  Ratios: '⚖️', Rates: '🚗', Proportions: '🔢', Percentages: '💯',
};

export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selected, setSelected] = useState(null);

  const handleClick = useCallback((opt) => {
    if (disabled || selected !== null) return;
    setSelected(opt);
    const isCorrect = String(opt) === String(question.correctAnswer);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
    }, 600);
  }, [disabled, selected, question.correctAnswer, onAnswer]);

  return (
    <div>
      <div className="topic-badge">
        {TOPIC_ICONS[question.topic] || '⚖️'} {question.topic?.toUpperCase() || 'RATIOCRAFT'}
      </div>

      <p className="question-text">{question.questionText}</p>

      <Visual question={question} />

      <div className="options-grid">
        {question.options.map((opt, i) => {
          let cls = 'option-btn';
          if (disabled || selected !== null) cls += ' disabled';
          if (selected === opt) {
            cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
          } else if ((disabled || selected !== null) && String(opt) === String(question.correctAnswer)) {
            cls += ' correct';
          }
          return (
            <button key={i} className={cls} onClick={() => handleClick(opt)}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
