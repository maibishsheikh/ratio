import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../core/store/progressStore';
import { useAudio } from '../../core/audio/useAudio';
import { getRandomQuestions, parseOptions } from '../../core/questions/questionBank';
import { generateQuestion } from '../../core/questions/questionFactory';
import { Clock, Zap, ChevronRight, Trophy } from 'lucide-react';

export default function TimedChallenge({ onComplete }) {
  const { currentWorldId, addXP, addCoins, updateMastery } = useProgressStore();
  const { playSingleText, stop } = useAudio();

  const questions = useMemo(() => {
    const bank = getRandomQuestions(currentWorldId, 15);
    if (bank.length < 15) {
      const tags = { 1:['RATIO_DEFINITION','RATIO_SIMPLIFY','EQUIVALENT_RATIO'], 2:['UNIT_RATE','RATE_COMPARISON','PROPORTION_CHECK'], 3:['PERCENT_OF','PERCENT_CHANGE','SIMPLE_INTEREST'] }[currentWorldId]||[];
      const extra = Array.from({length: 15-bank.length}, (_,i) => generateQuestion(tags[i%tags.length]||'RATIO_SIMPLIFY', 2));
      return [...bank, ...extra];
    }
    return bank;
  }, [currentWorldId]);

  const TOTAL_TIME = 300; // 5 min
  const [started, setStarted]   = useState(false);
  const [idx, setIdx]           = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted]= useState(false);
  const [score, setScore]       = useState(0);
  const [streak, setStreak]     = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (!started || done) return;
    if (timeLeft <= 0) { setDone(true); onComplete?.(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [started, done, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const timePct = (timeLeft / TOTAL_TIME) * 100;
  const timeColor = timeLeft < 60 ? '#EF4444' : timeLeft < 120 ? '#F59E0B' : '#0F766E';

  const handleSubmit = (optIdx) => {
    if (submitted) return;
    setSelected(optIdx);
    setSubmitted(true);
    const q = questions[idx];
    const options = parseOptions(q);
    const correct = options[optIdx] === q.correctAnswer;
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(s => s + 1);
      const bonus = newStreak >= 5 ? 20 : newStreak >= 3 ? 10 : 0;
      addXP(10 + bonus); addCoins(2); updateMastery(q.tag, 8);
      if (newStreak >= 3) playSingleText(`${newStreak} in a row! Brilliant streak!`, 'celebration');
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (idx < questions.length - 1) { setIdx(p => p + 1); setSelected(null); setSubmitted(false); }
      else { setDone(true); onComplete?.(); }
    }, 600);
  };

  if (done) {
    const stars = score >= 13 ? 3 : score >= 9 ? 2 : 1;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 flex flex-col items-center text-center gap-5">
        <div className="text-5xl">{['⭐','⭐⭐','⭐⭐⭐'][stars-1]}</div>
        <h2 className="font-extrabold text-2xl text-white font-display">Challenge Complete!</h2>
        <div className="text-5xl font-extrabold text-primary">{score}/{questions.length}</div>
        <p className="text-muted text-sm">Time left: {formatTime(timeLeft)}</p>
        <div className="bg-primary/10 text-primary font-extrabold text-sm px-4 py-2 rounded-full flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5"/>+{score * 10} XP earned
        </div>
      </motion.div>
    );
  }

  if (!started) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 flex flex-col items-center text-center gap-5">
      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-3xl">⏱️</div>
      <div>
        <h2 className="font-extrabold text-2xl text-white font-display">Timed Challenge</h2>
        <p className="text-muted text-sm mt-1">15 questions in 5 minutes. Build streaks of 3+ for bonus XP!</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center w-full max-w-xs">
        {[['15','Questions'],['5 min','Time'],['3+','Streak XP']].map(([v,l]) => (
          <div key={l} className="bg-white/5 rounded-xl p-3 border border-white/10">
            <p className="font-extrabold text-primary text-lg">{v}</p><p className="text-xs text-muted">{l}</p>
          </div>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setStarted(true)}
        className="flex items-center gap-2 bg-accent text-white font-extrabold py-3 px-8 rounded-full shadow-md">
        <Clock className="w-4 h-4" /> Start Timer!
      </motion.button>
    </motion.div>
  );

  const q = questions[idx];
  const options = parseOptions(q);

  return (
    <div className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      {/* Timer bar */}
      <div className="h-2 bg-white/10">
        <motion.div className="h-full transition-all" style={{ width: `${timePct}%`, background: timeColor }} />
      </div>
      <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Q{idx+1}/{questions.length} · Score: {score}</span>
        <div className={`flex items-center gap-1.5 font-extrabold text-sm ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-secondary'}`}>
          <Clock className="w-4 h-4" />{formatTime(timeLeft)}
        </div>
        {streak >= 2 && (
          <span className="text-xs font-extrabold text-amber-300 bg-amber-900/30 px-2 py-0.5 rounded-full border border-amber-500/40">
            🔥 {streak} streak!
          </span>
        )}
      </div>
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
            <p className="text-base md:text-lg font-extrabold text-white font-display leading-snug mb-5">{q.questionText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {options.map((opt, i) => {
                const isSelected = selected === i;
                const isRight    = submitted && opt === q.correctAnswer;
                const isWrong    = submitted && isSelected && !isRight;
                return (
                  <motion.button key={i} whileHover={!submitted ? { scale: 1.01 } : {}} whileTap={!submitted ? { scale: 0.99 } : {}}
                    onClick={() => handleSubmit(i)}
                    className={`p-4 text-left rounded-xl border-2 flex items-start gap-3 text-sm font-medium transition-all ${
                      isRight ? 'border-green-400 bg-green-900/30' : isWrong ? 'border-red-300 bg-red-900/30' :
                      isSelected ? 'border-accent bg-amber-900/30' : 'border-white/10 hover:border-white/15 bg-white/5 text-secondary'
                    }`}>
                    <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-extrabold ${
                      isRight ? 'bg-green-900/300 text-white' : isWrong ? 'bg-red-400 text-white' : isSelected ? 'bg-accent text-white' : 'bg-white/10 text-secondary'
                    }`}>{String.fromCharCode(65+i)}</span>
                    <span className="mt-0.5">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
