import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function ProportionScale({ onComplete, onDiscovery }) {
  const [vals, setVals]           = useState({ a: 2, b: 3, c: 4, d: 6 });
  const [discoveryShown, setDiscoveryShown] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [answer, setAnswer]       = useState('');
  const [result, setResult]       = useState(null);

  const cross1 = vals.a * vals.d;
  const cross2 = vals.b * vals.c;
  const balanced = cross1 === cross2;
  const tilt = Math.max(-20, Math.min(20, (cross2 - cross1) * 1.5));

  const handleChange = (key, val) => {
    const v = Math.max(1, Math.min(20, Number(val) || 1));
    const next = { ...vals, [key]: v };
    setVals(next);
    if (next.a * next.d === next.b * next.c && !discoveryShown) {
      setDiscoveryShown(true);
      onDiscovery?.('PROPORTION_CHECK');
      setTimeout(() => setChallenge(true), 800);
    }
  };

  const checkAnswer = () => {
    const num = Number(answer);
    // Challenge: 3/5 = ?/15 → answer = 9
    const correct = num === 9;
    setResult(correct);
    if (correct) setTimeout(() => onComplete?.(), 1200);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚖️</span>
          <div>
            <h3 className="font-extrabold text-white font-display text-sm">Proportion Scale</h3>
            <p className="text-xs text-muted">Adjust the values until the scale balances. When balanced, a×d = b×c.</p>
          </div>
        </div>

        {/* Scale visual */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-64 h-20">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-14 bg-amber-700 rounded-full" />
            <div className="absolute bottom-8 left-1/2 w-2 h-2 -translate-x-1/2 bg-amber-900 rounded-full" />
            <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-56 h-2 bg-amber-600 rounded-full origin-center"
              animate={{ rotate: tilt }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
              <div className="absolute left-2 -top-4 w-12 h-8 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-center text-xs font-extrabold text-primary">{vals.a}:{vals.b}</div>
              <div className="absolute right-2 -top-4 w-12 h-8 bg-secondary/10 rounded-lg border border-secondary/20 flex items-center justify-center text-xs font-extrabold text-secondary">{vals.c}:{vals.d}</div>
            </motion.div>
          </div>

          <AnimatePresence>
            {balanced ? (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                className="flex items-center gap-2 bg-green-900/30 border border-green-500/40 rounded-full px-4 py-1.5 text-xs font-extrabold text-green-300">
                ⚖️ Balanced! {vals.a}×{vals.d} = {vals.b}×{vals.c} = {cross1}
              </motion.div>
            ) : (
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-muted">
                {vals.a}×{vals.d} = {cross1} &nbsp;≠&nbsp; {vals.b}×{vals.c} = {cross2}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Value inputs */}
        <div className="grid grid-cols-2 gap-4">
          {[['a','Left top'],['b','Left bottom'],['c','Right top'],['d','Right bottom']].map(([k,label]) => (
            <div key={k}>
              <label className="text-[10px] font-extrabold uppercase text-muted block mb-1">{label} ({k})</label>
              <input type="number" min={1} max={20} value={vals[k]}
                onChange={e => handleChange(k, e.target.value)}
                className="w-full border-2 border-white/15 focus:border-primary rounded-xl px-3 py-2 text-sm font-extrabold font-display text-center outline-none transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {challenge && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          className="glass-card rounded-2xl border border-white/10 shadow-md p-5 flex flex-col gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/8 px-3 py-1 rounded-full border border-primary/15 w-fit">Challenge</span>
          <p className="font-extrabold text-white font-display text-sm">Solve: 3/5 = ?/15  (find the missing value)</p>
          <div className="flex items-center gap-3">
            <input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="?" onKeyDown={e=>e.key==='Enter'&&checkAnswer()}
              className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-center outline-none transition-colors ${
                result===true?'border-green-400 bg-green-900/30':result===false?'border-red-300 bg-red-900/30':'border-white/15 focus:border-primary'
              }`}/>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={checkAnswer}
              className="flex items-center gap-1.5 bg-primary text-white font-extrabold py-2.5 px-5 rounded-xl shadow-md text-sm">
              Check <ChevronRight className="w-4 h-4"/>
            </motion.button>
          </div>
          {result!==null && (
            <div className={`rounded-xl p-3 text-sm ${result?'bg-green-900/30 text-green-300 border border-green-500/40':'bg-red-900/30 text-red-300 border border-red-500/40'}`}>
              {result?'✅ Correct! Cross-multiply: 3×15 = 5×? → 45 = 5? → ? = 9.':'💡 Cross-multiply: 3×15 = 5×?  →  45 = 5 × ?  →  ? = 9'}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
