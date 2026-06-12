import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function SimpleInterestTimeMachine({ onComplete, onDiscovery }) {
  const [P, setP] = useState(500);
  const [R, setR] = useState(10);
  const [T, setT] = useState(3);
  const [discovered, setDiscovered] = useState(false);
  const [animated, setAnimated]     = useState(false);
  const [challenge, setChallenge]   = useState(false);
  const [answer, setAnswer]         = useState('');
  const [result, setResult]         = useState(null);

  const I = (P * R * T) / 100;
  const total = P + I;

  const yearBars = Array.from({length: T}, (_, i) => {
    const interest = (P * R * (i+1)) / 100;
    return { year: i+1, amount: P + interest };
  });
  const maxAmount = total;

  const handleRun = () => {
    if (!discovered) { setDiscovered(true); onDiscovery?.('SIMPLE_INTEREST'); }
    setAnimated(true);
    setTimeout(() => setChallenge(true), 800);
  };

  const checkAnswer = () => {
    const correct = Number(answer) === 240;
    setResult(correct);
    if (correct) setTimeout(() => onComplete?.(), 1100);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">⏰</span>
          <div>
            <h3 className="font-extrabold text-white font-display text-sm">Simple Interest Time Machine</h3>
            <p className="text-xs text-muted">Set P, R, T — then run the time machine to watch Leo's coins grow!</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Principal (P)', symbol: '💰', value: P, setter: setP, min: 100, max: 2000, step: 100, unit: 'coins' },
            { label: 'Rate % (R)', symbol: '📈', value: R, setter: setR, min: 1, max: 25, step: 1, unit: '% p.a.' },
            { label: 'Time (T)', symbol: '📅', value: T, setter: setT, min: 1, max: 8, step: 1, unit: 'years' },
          ].map(({ label, symbol, value, setter, min, max, step, unit }) => (
            <div key={label} className="glass-card rounded-xl p-3 border border-white/10">
              <div className="text-[10px] font-extrabold uppercase text-muted mb-1">{symbol} {label}</div>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => { setter(Number(e.target.value)); setAnimated(false); setChallenge(false); setResult(null); }}
                className="w-full h-2 rounded-full cursor-pointer mb-1" style={{ accentColor: '#F59E0B' }} />
              <div className="font-extrabold text-amber-300 text-base font-display">{value} <span className="text-xs text-muted">{unit}</span></div>
            </div>
          ))}
        </div>

        {/* Formula preview */}
        <div className="bg-amber-900/30 rounded-xl p-3 border border-amber-500/40 mb-4 text-center">
          <p className="text-xs text-amber-300 font-semibold">I = P × R × T ÷ 100</p>
          <p className="text-sm font-extrabold text-amber-200 mt-0.5">= {P} × {R} × {T} ÷ 100 = <span className="text-base">{I}</span> coins</p>
          <p className="text-xs text-amber-300 mt-0.5">Total amount = {P} + {I} = <strong>{total}</strong> coins</p>
        </div>

        {/* Year bars */}
        {animated && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="flex items-end gap-2 h-28 mb-4 px-2">
            {yearBars.map((bar) => (
              <div key={bar.year} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-extrabold text-muted">{Math.round(bar.amount)}</span>
                <motion.div className="w-full rounded-t-lg" style={{ background: '#F59E0B' }}
                  initial={{ height: 0 }} animate={{ height: `${(bar.amount / (maxAmount * 1.2)) * 100}px` }}
                  transition={{ duration: 0.6, delay: (bar.year-1) * 0.2 }} />
                <span className="text-[9px] text-muted font-semibold">Y{bar.year}</span>
              </div>
            ))}
          </motion.div>
        )}

        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleRun}
          className="w-full flex items-center justify-center gap-2 bg-amber-900/300 text-white font-extrabold py-3 rounded-xl shadow-md text-sm">
          ⏰ Run Time Machine!
        </motion.button>
      </div>

      {challenge && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          className="glass-card rounded-2xl border border-white/10 shadow-md p-5 flex flex-col gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/40 w-fit">Challenge</span>
          <p className="font-extrabold text-white font-display text-sm">P = 1,200 coins, R = 8%, T = 2.5 years. Calculate the simple interest.</p>
          <div className="flex items-center gap-3">
            <input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="I = ? coins" onKeyDown={e=>e.key==='Enter'&&checkAnswer()}
              className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-center outline-none transition-colors ${
                result===true?'border-green-400 bg-green-900/30':result===false?'border-red-300 bg-red-900/30':'border-white/15 focus:border-amber-400'
              }`}/>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={checkAnswer}
              className="flex items-center gap-1.5 bg-amber-900/300 text-white font-extrabold py-2.5 px-5 rounded-xl shadow-md text-sm">
              Check <ChevronRight className="w-4 h-4"/>
            </motion.button>
          </div>
          {result!==null&&(
            <div className={`rounded-xl p-3 text-sm ${result?'bg-green-900/30 text-green-300 border border-green-500/40':'bg-amber-900/30 text-amber-300 border border-amber-500/40'}`}>
              {result?'✅ I = 1200 × 8 × 2.5 ÷ 100 = 240 coins!':'💡 I = P×R×T÷100 = 1200 × 8 × 2.5 ÷ 100 = 240 coins.'}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
