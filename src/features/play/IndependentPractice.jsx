import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../core/store/progressStore';
import { useAudio } from '../../core/audio/useAudio';
import { getRandomQuestions, parseOptions } from '../../core/questions/questionBank';
import { generateQuestion } from '../../core/questions/questionFactory';
import { CORRECT_NARRATIONS, WRONG_NARRATIONS } from '../../utils/narration';
import { CheckCircle2, XCircle, ChevronRight, Lightbulb, Zap } from 'lucide-react';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function IndependentPractice({ onComplete }) {
  const { currentWorldId, addXP, addCoins, coins, updateMastery } = useProgressStore();
  const { playSingleText, stop } = useAudio();

  const questions = useMemo(() => {
    const bank = getRandomQuestions(currentWorldId, 10);
    if (bank.length < 10) {
      const tags = { 1: ['RATIO_SIMPLIFY','EQUIVALENT_RATIO','RATIO_DEFINITION'], 2: ['UNIT_RATE','PROPORTION_CHECK','RATE_COMPARISON'], 3: ['PERCENT_OF','SIMPLE_INTEREST','PERCENT_CHANGE'] }[currentWorldId] || [];
      const extra = Array.from({ length: 10 - bank.length }, (_, i) => generateQuestion(tags[i % tags.length] || 'RATIO_SIMPLIFY', 2));
      return [...bank, ...extra];
    }
    return bank;
  }, [currentWorldId]);

  const [idx, setIdx]           = useState(0);
  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState(0);    // per question
  const [submitted, setSubmitted]= useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore]       = useState(0);
  const [done, setDone]         = useState(false);

  const q = questions[idx];
  if (!q) return null;
  const options = parseOptions(q);

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = options[selected] === q.correctAnswer;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSubmitted(true);
    if (correct) {
      const xp = newAttempts === 1 ? 15 : 7;
      addXP(xp); addCoins(2); updateMastery(q.tag, 8); setScore(s => s + 1);
      playSingleText(pick(CORRECT_NARRATIONS).text);
    } else {
      playSingleText(pick(WRONG_NARRATIONS).text);
    }
  };

  const handleNext = () => {
    stop();
    if (idx < questions.length - 1) { setIdx(p => p + 1); setSelected(null); setAttempts(0); setSubmitted(false); setShowHint(false); }
    else { setDone(true); onComplete?.(); }
  };

  const handleHint = () => {
    if (coins < 2) return;
    addCoins(-2);
    setShowHint(true);
  };

  const isCorrect = submitted && options[selected] === q.correctAnswer;

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 text-center flex flex-col items-center gap-4">
      <div className="text-5xl">{score >= 8 ? '🌟' : score >= 5 ? '⭐' : '💪'}</div>
      <h3 className="font-extrabold text-xl text-white font-display">Practice Complete!</h3>
      <p className="text-muted text-sm">You scored <strong className="text-primary">{score}/{questions.length}</strong></p>
      <div className="bg-primary/8 text-primary font-extrabold text-sm px-4 py-2 rounded-full flex items-center gap-1.5 border border-primary/15">
        <Zap className="w-3.5 h-3.5" />+{score * 15} XP total
      </div>
    </motion.div>
  );

  return (
    <div className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      <div className="h-1.5 bg-white/10">
        <motion.div className="h-full bg-secondary" animate={{ width: `${(idx / questions.length) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/8 px-3 py-1 rounded-full border border-secondary/15">
            Independent · Q{idx + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
            <span className="text-sm">🪙</span>{coins} coins (hint costs 2)
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <p className="text-base md:text-lg font-extrabold text-white font-display leading-snug mb-5">{q.questionText}</p>

            {showHint && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-amber-900/30 border border-amber-500/40 rounded-xl p-3 mb-4 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 font-medium">{q.explanation}</p>
              </motion.div>
            )}

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
                      isSelected ? 'border-secondary bg-secondary/5 text-secondary' :
                      'border-white/10 bg-white/5 hover:border-white/15 text-secondary'
                    }`}>
                    <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-extrabold ${
                      isRight ? 'bg-green-900/300 text-white' : isWrong ? 'bg-red-400 text-white' : isSelected ? 'bg-secondary text-white' : 'bg-white/10 text-secondary'
                    }`}>{String.fromCharCode(65 + i)}</span>
                    <span className="mt-0.5 flex-1">{opt}</span>
                    {isRight && <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />}
                    {isWrong && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                  </motion.button>
                );
              })}
            </div>

            {submitted && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 border mb-4 text-sm ${isCorrect ? 'bg-green-900/30 border-green-500/40 text-green-200' : 'bg-red-900/30 border-red-500/40 text-red-200'}`}>
                <strong>{isCorrect ? '✅ Correct! ' : '❌ Not quite — '}</strong>{q.explanation}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center">
          {!submitted && !showHint && (
            <button onClick={handleHint} disabled={coins < 2}
              className="flex items-center gap-1.5 text-xs text-amber-300 font-extrabold hover:underline disabled:opacity-40 disabled:cursor-not-allowed">
              <Lightbulb className="w-3.5 h-3.5" />Hint (2 coins)
            </button>
          )}
          {submitted ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNext}
              className="ml-auto flex items-center gap-2 bg-secondary text-white font-extrabold py-2.5 px-6 rounded-full shadow-md text-sm">
              {idx < questions.length - 1 ? 'Next' : 'Finish'} <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
              disabled={selected === null}
              className="ml-auto flex items-center gap-2 bg-secondary text-white font-extrabold py-2.5 px-6 rounded-full shadow-md text-sm disabled:opacity-40">
              Submit <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
