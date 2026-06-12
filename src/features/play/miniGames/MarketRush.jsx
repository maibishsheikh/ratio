import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../../core/store/progressStore';
import { Zap, Timer, Check, X } from 'lucide-react';

const DURATION = 90;

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function simplify(a, b) { const g = gcd(a, b); return [a/g, b/g]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generatePair() {
  const a = randInt(1, 8), b = randInt(1, 8);
  const mult = randInt(2, 6);
  const equivalent = Math.random() > 0.4;
  if (equivalent) {
    return { left: [a, b], right: [a*mult, b*mult], answer: true };
  } else {
    let c, d;
    do { c = randInt(1, 8); d = randInt(1, 8); } while (simplify(c, d)[0] === a && simplify(c, d)[1] === b);
    return { left: [a, b], right: [c, d], answer: false };
  }
}

export default function MarketRush({ onComplete }) {
  const { addXP, addCoins } = useProgressStore();
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore]       = useState(0);
  const [wrong, setWrong]       = useState(0);
  const [total, setTotal]       = useState(0);
  const [pair, setPair]         = useState(() => generatePair());
  const [flash, setFlash]       = useState(null); // 'correct'|'wrong'
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) { setDone(true); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, done]);

  const answer = useCallback((choice) => {
    if (done || flash) return;
    const correct = choice === pair.answer;
    setTotal(p => p + 1);
    if (correct) { setScore(p => p + 1); setFlash('correct'); addXP(3); addCoins(1); }
    else { setWrong(p => p + 1); setFlash('wrong'); }
    setTimeout(() => { setFlash(null); setPair(generatePair()); }, 350);
  }, [pair, done, flash]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  answer(true);
      if (e.key === 'ArrowRight') answer(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answer]);

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 text-center flex flex-col items-center gap-5">
      <div className="text-5xl">🏪</div>
      <h3 className="font-extrabold text-xl text-white font-display">Market Rush Complete!</h3>
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {[['Score',`${score}/${total}`,'text-primary'],['Correct',score,'text-green-300'],['Wrong',wrong,'text-red-500']].map(([l,v,c]) => (
          <div key={l} className="bg-white/5 rounded-xl p-3 border border-white/10">
            <p className={`font-extrabold text-lg ${c}`}>{v}</p><p className="text-xs text-white/40">{l}</p>
          </div>
        ))}
      </div>
      <button onClick={onComplete} className="flex items-center gap-2 bg-primary text-white font-extrabold py-2.5 px-7 rounded-full shadow-md text-sm">
        <Zap className="w-4 h-4" />Collect +{score * 3} XP
      </button>
    </motion.div>
  );

  const timePct = (timeLeft / DURATION) * 100;
  return (
    <div className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      <div className="h-1.5 bg-white/10">
        <motion.div className="h-full" style={{ width:`${timePct}%`, background: timeLeft < 20 ? '#EF4444' : '#0F766E' }} transition={{ duration: 1 }} />
      </div>
      <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs font-extrabold text-primary">Score: {score}</span>
        <div className={`flex items-center gap-1.5 font-extrabold text-sm ${timeLeft < 20 ? 'text-red-600 animate-pulse' : 'text-white/80'}`}>
          <Timer className="w-4 h-4" />{timeLeft}s
        </div>
        <span className="text-xs text-white/40">{total} judged</span>
      </div>
      <div className="p-6 flex flex-col items-center gap-6">
        <div className="text-xs text-white/40 font-semibold">Are these equivalent ratios?</div>

        <AnimatePresence mode="wait">
          <motion.div key={`${pair.left}-${pair.right}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className={`w-full max-w-sm flex items-center justify-center gap-6 p-6 rounded-2xl border-2 transition-all ${
              flash === 'correct' ? 'bg-green-900/30 border-green-300' : flash === 'wrong' ? 'bg-red-900/30 border-red-300' : 'bg-white/5 border-white/10'
            }`}>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-primary font-display">{pair.left[0]}:{pair.left[1]}</div>
            </div>
            <div className="text-2xl text-white/30 font-light">=?</div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-secondary font-display">{pair.right[0]}:{pair.right[1]}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 w-full max-w-xs">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={() => answer(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-900/300 hover:bg-green-600 text-white font-extrabold py-4 rounded-2xl shadow-md transition-colors">
            <Check className="w-5 h-5" /> YES
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={() => answer(false)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-900/300 hover:bg-red-600 text-white font-extrabold py-4 rounded-2xl shadow-md transition-colors">
            <X className="w-5 h-5" /> NO
          </motion.button>
        </div>
        <p className="text-[10px] text-white/40">← YES  &nbsp;|&nbsp;  NO → (keyboard shortcuts)</p>
      </div>
    </div>
  );
}
