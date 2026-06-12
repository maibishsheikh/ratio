import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function PercentageCoinVault({ onComplete, onDiscovery }) {
  const [pct, setPct]           = useState(40);
  const [discovered, setDiscovered] = useState(false);
  const [challenge, setChallenge]= useState(false);
  const [answer, setAnswer]     = useState('');
  const [result, setResult]     = useState(null);

  const coinsOut = Math.round(pct);    // out of 100

  const handleSlider = (v) => {
    setPct(Number(v));
    if (!discovered) { setDiscovered(true); onDiscovery?.('PERCENT_OF'); setTimeout(() => setChallenge(true), 700); }
  };

  const checkAnswer = () => {
    const correct = Number(answer) === 72;
    setResult(correct);
    if (correct) setTimeout(() => onComplete?.(), 1100);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">🏦</span>
          <div>
            <h3 className="font-extrabold text-white font-display text-sm">Percentage Coin Vault</h3>
            <p className="text-xs text-muted">Turn the dial to choose a percentage and watch coins flow from the vault!</p>
          </div>
        </div>

        {/* Vault visual */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl">🏦</div>

          {/* Coin grid: 10×10 = 100 coins */}
          <div className="bg-amber-900/30 rounded-2xl border border-amber-500/40 p-4">
            <div className="text-[10px] font-extrabold uppercase text-amber-300 mb-3 text-center">100 Gold Coins</div>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({length:100}, (_,i) => (
                <motion.div key={i} className="w-5 h-5 rounded-full flex items-center justify-center text-[8px]"
                  animate={{ background: i < coinsOut ? '#F59E0B' : '#E5E7EB', scale: i < coinsOut ? 1 : 0.85 }}
                  transition={{ duration: 0.15, delay: i < coinsOut ? i * 0.006 : 0 }}>
                  {i < coinsOut ? '🪙' : ''}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs font-extrabold text-muted mb-1">
              <span>0%</span><span className="text-amber-300 text-base font-extrabold">{pct}%</span><span>100%</span>
            </div>
            <input type="range" min={0} max={100} value={pct} onChange={e => handleSlider(e.target.value)}
              className="w-full h-3 rounded-full cursor-pointer" style={{ accentColor: '#D97706' }} />
          </div>

          {/* Result */}
          <div className="glass-card rounded-xl p-4 border border-white/10 text-center w-full max-w-xs">
            <p className="text-sm text-muted font-medium">{pct}% of 100 coins =</p>
            <p className="text-3xl font-extrabold text-amber-300 font-display">{coinsOut} coins</p>
            <p className="text-xs text-muted mt-1">Percent means <strong>per 100</strong> — ratio {coinsOut}:100</p>
          </div>
        </div>
      </div>

      {challenge && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          className="glass-card rounded-2xl border border-white/10 shadow-md p-5 flex flex-col gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/40 w-fit">Challenge</span>
          <p className="font-extrabold text-white font-display text-sm">What is 60% of 120 coins?</p>
          <div className="flex items-center gap-3">
            <input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="coins" onKeyDown={e=>e.key==='Enter'&&checkAnswer()}
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
              {result?'✅ Correct! 60% of 120 = (60÷100) × 120 = 0.6 × 120 = 72 coins.':'💡 60% = 60÷100 = 0.6. Then 0.6 × 120 = 72 coins.'}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
