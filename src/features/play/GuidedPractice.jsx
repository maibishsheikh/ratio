import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../core/store/progressStore';
import { useAudio } from '../../core/audio/useAudio';
import { getRandomQuestions, parseOptions } from '../../core/questions/questionBank';
import { generateQuestion } from '../../core/questions/questionFactory';
import { CORRECT_NARRATIONS, WRONG_NARRATIONS } from '../../utils/narration';
import { CheckCircle2, XCircle, ChevronRight, Lightbulb, Zap } from 'lucide-react';

function pickSegment(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function GuidedPractice({ onComplete }) {
  const { currentWorldId, addXP, addCoins, updateMastery } = useProgressStore();
  const { playSingleText, stop } = useAudio();

  const questions = useMemo(() => {
    const bank = getRandomQuestions(currentWorldId, 5);
    if (bank.length < 5) {
      const tags = { 1: ['RATIO_SIMPLIFY','EQUIVALENT_RATIO'], 2: ['UNIT_RATE','PROPORTION_CHECK'], 3: ['PERCENT_OF','SIMPLE_INTEREST'] }[currentWorldId] || ['RATIO_SIMPLIFY'];
      const extra = Array.from({ length: 5 - bank.length }, () => generateQuestion(tags[Math.floor(Math.random() * tags.length)], 1));
      return [...bank, ...extra];
    }
    return bank;
  }, [currentWorldId]);

  const [idx, setIdx]           = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted]= useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [completed, setCompleted]= useState(false);

  const q = questions[idx];
  if (!q) return null;
  const options = parseOptions(q);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const correct = options[selected] === q.correctAnswer || String(selected) === String(q.correctAnswer);
    if (correct) { addXP(10); addCoins(3); updateMastery(q.tag, 10); playSingleText(pickSegment(CORRECT_NARRATIONS).text); }
    else { playSingleText(pickSegment(WRONG_NARRATIONS).text); }
  };

  const handleNext = () => {
    stop();
    if (idx < questions.length - 1) { setIdx(p => p + 1); setSelected(null); setSubmitted(false); setHintVisible(false); }
    else { setCompleted(true); onComplete?.(); }
  };

  const isCorrect = submitted && (options[selected] === q.correctAnswer || String(selected) === String(q.correctAnswer));

  if (completed) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 text-center flex flex-col items-center gap-4">
      <div className="text-5xl">🎉</div>
      <h3 className="font-extrabold text-xl text-white font-display">Guided Practice Complete!</h3>
      <p className="text-muted text-sm">You've finished all 5 guided questions. You're ready for independent practice!</p>
      <div className="flex gap-3">
        <div className="bg-primary/10 text-primary font-extrabold text-sm px-4 py-2 rounded-full flex items-center gap-1.5"><Zap className="w-3.5 h-3.5"/>+50 XP earned</div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-white/10">
        <motion.div className="h-full bg-primary" animate={{ width: `${((idx) / questions.length) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/8 px-3 py-1 rounded-full border border-primary/15">
            Guided · Q{idx + 1} of {questions.length}
          </span>
          <span className="text-xs text-muted font-semibold">{q.tag.replace(/_/g,' ')}</span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <p className="text-base md:text-lg font-extrabold text-white font-display leading-snug mb-5">{q.questionText}</p>

            {/* Hint */}
            {hintVisible && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-amber-900/30 border border-amber-500/40 rounded-xl p-3 mb-4 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 font-medium leading-relaxed">{q.explanation}</p>
              </motion.div>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {options.map((opt, i) => {
                const isSelected = selected === i;
                const isRight    = submitted && opt === q.correctAnswer;
                const isWrong    = submitted && isSelected && !isRight;
                return (
                  <motion.button key={i} whileHover={!submitted ? { scale: 1.01 } : {}} whileTap={!submitted ? { scale: 0.99 } : {}}
                    onClick={() => !submitted && setSelected(i)}
                    className={`p-4 text-left rounded-xl border-2 flex items-start gap-3 text-sm font-medium transition-all ${
                      isRight  ? 'border-green-400 bg-green-900/30 text-green-200' :
                      isWrong  ? 'border-red-300 bg-red-900/30 text-red-300' :
                      isSelected ? 'border-primary bg-primary/5 text-primary' :
                      'border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/5 text-secondary'
                    }`}>
                    <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-extrabold transition-all ${
                      isRight ? 'bg-green-900/300 text-white' : isWrong ? 'bg-red-400 text-white' : isSelected ? 'bg-primary text-white' : 'bg-white/10 text-secondary'
                    }`}>{String.fromCharCode(65 + i)}</span>
                    <span className="mt-0.5 flex-1">{opt}</span>
                    {isRight && <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />}
                    {isWrong && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {submitted && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 border mb-4 text-sm leading-relaxed ${isCorrect ? 'bg-green-900/30 border-green-500/40 text-green-200' : 'bg-amber-900/30 border-amber-500/40 text-amber-200'}`}>
                <strong>{isCorrect ? '✅ Correct! ' : '💡 Not quite — '}</strong>{q.explanation}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer actions */}
        <div className="flex justify-between items-center">
          {!submitted && (
            <button onClick={() => setHintVisible(p => !p)}
              className="flex items-center gap-1.5 text-xs text-amber-300 font-extrabold hover:underline transition-colors">
              <Lightbulb className="w-3.5 h-3.5" />{hintVisible ? 'Hide Hint' : 'Show Hint'}
            </button>
          )}
          {submitted ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNext}
              className="ml-auto flex items-center gap-2 bg-primary text-white font-extrabold py-2.5 px-6 rounded-full shadow-md text-sm">
              {idx < questions.length - 1 ? 'Next Question' : 'Complete!'} <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
              disabled={selected === null}
              className="ml-auto flex items-center gap-2 bg-primary text-white font-extrabold py-2.5 px-6 rounded-full shadow-md text-sm disabled:opacity-40">
              Submit <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
