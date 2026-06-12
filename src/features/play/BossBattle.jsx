import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../core/store/progressStore';
import { useAudio } from '../../core/audio/useAudio';
import { getRandomQuestions, parseOptions } from '../../core/questions/questionBank';
import { generateQuestion } from '../../core/questions/questionFactory';
import { bossBattleNarration, bossWinNarration } from '../../utils/narration';
import { Sword, Heart, Timer, ChevronRight, Zap } from 'lucide-react';

const BOSS_PER_WORLD = {
  1: { name: 'Merchant Malik', emoji: '🧙‍♂️', color: '#F97316', hp: 5 },
  2: { name: 'Rival Racer Rex', emoji: '🏎️', color: '#7C3AED', hp: 5 },
  3: { name: 'Gold Baron Grax', emoji: '👑', color: '#D97706', hp: 5 },
};
const TIME_PER_Q = 12; // seconds

export default function BossBattle({ onComplete }) {
  const { currentWorldId, addXP, addCoins, updateMastery } = useProgressStore();
  const { playNarration, playSingleText, stop } = useAudio();

  const questions = useMemo(() => {
    const bank = getRandomQuestions(currentWorldId, 5);
    if (bank.length < 5) {
      const tags = { 1:['EQUIVALENT_RATIO','RATIO_SIMPLIFY'], 2:['UNIT_RATE','PROPORTION_CHECK'], 3:['PERCENT_OF','SIMPLE_INTEREST'] }[currentWorldId]||['RATIO_SIMPLIFY'];
      const extra = Array.from({length: 5-bank.length}, (_,i) => generateQuestion(tags[i%tags.length], 3));
      return [...bank, ...extra];
    }
    return bank;
  }, [currentWorldId]);

  const boss = BOSS_PER_WORLD[currentWorldId] || BOSS_PER_WORLD[1];
  const [phase, setPhase]       = useState('intro'); // 'intro' | 'battle' | 'win' | 'lose'
  const [idx, setIdx]           = useState(0);
  const [bossHp, setBossHp]     = useState(boss.hp);
  const [playerHp, setPlayerHp] = useState(3);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted]= useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [score, setScore]       = useState(0);

  // Timer
  useEffect(() => {
    if (phase !== 'battle' || submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      const hp = playerHp - 1;
      setPlayerHp(hp);
      if (hp <= 0) setTimeout(() => setPhase('lose'), 800);
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, submitted]);

  // Intro narration
  useEffect(() => {
    if (phase === 'intro') playNarration(bossBattleNarration());
  }, [phase]);

  const startBattle = () => { stop(); setPhase('battle'); setTimeLeft(TIME_PER_Q); };



  const handleSubmit = (optIdx) => {
    if (submitted) return;
    setSelected(optIdx);
    setSubmitted(true);
    const q = questions[idx];
    const options = parseOptions(q);
    const correct = options[optIdx] === q.correctAnswer;
    if (correct) {
      const newHp = bossHp - 1;
      setBossHp(newHp);
      setScore(s => s + 1);
      addXP(20); addCoins(5); updateMastery(q.tag, 12);
      if (newHp <= 0) { stop(); playNarration(bossWinNarration()); setTimeout(() => { setPhase('win'); onComplete?.(); }, 1500); return; }
      playSingleText("Hit! Keep going!", 'celebration');
    } else {
      const newHp = playerHp - 1;
      setPlayerHp(newHp);
      if (newHp <= 0) { setTimeout(() => setPhase('lose'), 800); return; }
      playSingleText("The boss blocks! Watch out!", 'thinking');
    }
  };

  const handleNext = () => { stop(); setIdx(p => p + 1); setSelected(null); setSubmitted(false); setTimeLeft(TIME_PER_Q); };

  const q = questions[idx];
  const options = q ? parseOptions(q) : [];

  // ── Intro screen ──
  if (phase === 'intro') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 flex flex-col items-center text-center gap-6">
      <motion.div className="text-7xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>{boss.emoji}</motion.div>
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">Boss Battle</span>
        <h2 className="font-extrabold text-2xl text-white font-display mt-2">{boss.name} Appears!</h2>
        <p className="text-muted text-sm mt-2 max-w-sm mx-auto">Answer 5 questions correctly to defeat the boss! You have 3 hearts. {TIME_PER_Q} seconds per question.</p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }, (_, i) => <span key={i} className="text-2xl">❤️</span>)}
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={startBattle}
        className="flex items-center gap-2 text-white font-extrabold py-3 px-8 rounded-full shadow-lg"
        style={{ background: `linear-gradient(135deg, ${boss.color}, ${boss.color}AA)` }}>
        <Sword className="w-5 h-5" /> Begin Battle!
      </motion.button>
    </motion.div>
  );

  // ── Win screen ──
  if (phase === 'win') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 flex flex-col items-center text-center gap-5">
      <motion.div className="text-7xl" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.6 }}>🏆</motion.div>
      <div>
        <h2 className="font-extrabold text-2xl text-white font-display">{boss.name} Defeated!</h2>
        <p className="text-muted text-sm mt-1">Incredible! You've mastered the challenge. Reflect phase unlocked!</p>
      </div>
      <div className="flex gap-3">
        <div className="bg-primary/10 text-primary font-extrabold text-sm px-4 py-2 rounded-full flex items-center gap-1.5"><Zap className="w-3.5 h-3.5"/>+{score*20} XP</div>
        <div className="bg-amber-900/30 text-amber-300 font-extrabold text-sm px-4 py-2 rounded-full flex items-center gap-1.5">🪙 +{score*5} Coins</div>
      </div>
    </motion.div>
  );

  // ── Lose screen ──
  if (phase === 'lose') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 flex flex-col items-center text-center gap-5">
      <div className="text-6xl">💀</div>
      <div>
        <h2 className="font-extrabold text-2xl text-white font-display">You were defeated!</h2>
        <p className="text-muted text-sm mt-1">Don't worry — practice makes perfect. Try again!</p>
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        onClick={() => { setBossHp(boss.hp); setPlayerHp(3); setIdx(0); setScore(0); setSelected(null); setSubmitted(false); setPhase('intro'); }}
        className="flex items-center gap-2 bg-primary text-white font-extrabold py-3 px-8 rounded-full shadow-md">
        Try Again <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );

  // ── Battle screen ──
  return (
    <div className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      {/* Status bar */}
      <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{boss.emoji}</span>
          <div>
            <p className="text-[10px] font-extrabold text-muted uppercase">{boss.name}</p>
            <div className="flex gap-1 mt-0.5">
              {Array.from({length: boss.hp}, (_,i) => (
                <motion.div key={i} className="w-4 h-2 rounded-full transition-all" style={{ background: i < bossHp ? boss.color : '#E5E7EB' }} />
              ))}
            </div>
          </div>
        </div>
        {/* Timer */}
        <div className={`flex items-center gap-1.5 font-extrabold text-sm rounded-full px-3 py-1.5 ${timeLeft <= 4 ? 'bg-red-900/50 text-red-300 animate-pulse' : 'bg-white/10 text-secondary'}`}>
          <Timer className="w-4 h-4" />{timeLeft}s
        </div>
        {/* Player hearts */}
        <div className="flex items-center gap-1">
          {Array.from({length: 3}, (_,i) => (
            <span key={i} className={`text-base transition-all ${i < playerHp ? '' : 'opacity-20'}`}>❤️</span>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">Q{idx+1} of {questions.length}</span>
        </div>

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
                    onClick={() => !submitted && handleSubmit(i)}
                    className={`p-4 text-left rounded-xl border-2 flex items-start gap-3 text-sm font-medium transition-all ${
                      isRight  ? 'border-green-400 bg-green-900/30 text-green-200' :
                      isWrong  ? 'border-red-300 bg-red-900/30 text-red-300' :
                      isSelected ? 'border-secondary bg-secondary/5' :
                      'border-white/10 bg-white/5 hover:border-white/15 text-secondary'
                    }`}>
                    <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-extrabold ${
                      isRight ? 'bg-green-900/300 text-white' : isWrong ? 'bg-red-400 text-white' : isSelected ? 'bg-secondary text-white' : 'bg-white/10 text-secondary'
                    }`}>{String.fromCharCode(65 + i)}</span>
                    <span className="mt-0.5">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-4 flex justify-end">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNext}
                  className="flex items-center gap-2 text-white font-extrabold py-2.5 px-6 rounded-full shadow-md text-sm"
                  style={{ background: boss.color }}>
                  {idx < questions.length - 1 ? 'Next Attack' : 'Finish'} <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
