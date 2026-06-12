import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Lightbulb } from 'lucide-react';

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function simplifyRatio(a, b) { const g = gcd(a, b); return [a/g, b/g]; }

export default function RatioBarBuilder({ onComplete, onDiscovery }) {
  const [qtyA, setQtyA] = useState(3);
  const [qtyB, setQtyB] = useState(2);
  const [discovered, setDiscovered] = useState(false);
  const [seenSimplified, setSeenSimplified] = useState(new Set());
  const [challenge, setChallenge] = useState(null);
  const [challengeAns, setChallengeAns] = useState('');
  const [challengeResult, setChallengeResult] = useState(null);
  const [simpleA, simpleB] = simplifyRatio(qtyA, qtyB);

  // Track how many distinct simplified forms seen
  useEffect(() => {
    const key = `${simpleA}:${simpleB}`;
    const newSet = new Set(seenSimplified);
    newSet.add(key);
    setSeenSimplified(newSet);
    if (newSet.size >= 2 && !discovered) {
      setDiscovered(true);
      onDiscovery?.('EQUIVALENT_RATIO');
      setTimeout(() => setChallenge({ target: simplifyRatio(4, 6), question: 'Express 4:6 in its simplest form.' }), 900);
    }
  }, [qtyA, qtyB]);

  const maxBar = 180;
  const barA = Math.round((qtyA / 12) * maxBar);
  const barB = Math.round((qtyB / 12) * maxBar);

  const checkChallenge = () => {
    const [a, b] = challengeAns.split(':').map(Number);
    const correct = a === 2 && b === 3;
    setChallengeResult(correct);
    if (correct) { setTimeout(() => onComplete?.(), 1200); }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <div>
            <h3 className="font-extrabold text-white font-display text-sm">Ratio Bar Builder</h3>
            <p className="text-xs text-muted">Drag sliders to explore — try to find two ratios that simplify to the same form!</p>
          </div>
        </div>

        {/* Bars */}
        <div className="flex flex-col gap-4">
          {[['A (Red)', qtyA, setQtyA, '#F97316'], ['B (Blue)', qtyB, setQtyB, '#7C3AED']].map(([label, val, setter, color]) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-extrabold text-secondary">{label}</span>
                <span className="text-sm font-extrabold" style={{ color }}>{val}</span>
              </div>
              <input type="range" min={1} max={12} value={val}
                onChange={e => setter(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: color }} />
              <div className="mt-2 h-7 rounded-lg overflow-hidden bg-white/15">
                <motion.div className="h-full rounded-lg" style={{ background: color }}
                  animate={{ width: `${(val/12)*100}%` }} transition={{ duration: 0.2 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Live ratio display */}
        <div className="glass-card rounded-xl p-4 border border-white/10 flex flex-wrap gap-4 items-center justify-center">
          <div className="text-center">
            <div className="text-[10px] font-extrabold uppercase text-muted mb-0.5">Your Ratio</div>
            <div className="text-2xl font-extrabold text-white font-display">{qtyA}:{qtyB}</div>
          </div>
          <div className="text-white/30 text-xl">=</div>
          <div className="text-center">
            <div className="text-[10px] font-extrabold uppercase text-muted mb-0.5">Simplified</div>
            <div className="text-2xl font-extrabold text-primary font-display">{simpleA}:{simpleB}</div>
          </div>
          <div className="text-white/30 text-xl">=</div>
          <div className="text-center">
            <div className="text-[10px] font-extrabold uppercase text-muted mb-0.5">Scale Factor</div>
            <div className="text-2xl font-extrabold text-secondary font-display">{gcd(qtyA, qtyB)}×</div>
          </div>
        </div>

        {!discovered && (
          <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-500/40 rounded-xl p-3">
            <Lightbulb className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <p className="text-xs text-amber-200">Find two different ratios that simplify to the same thing. Seen: {seenSimplified.size} unique simplified form{seenSimplified.size !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {/* Challenge */}
      {challenge && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-white/10 shadow-md p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/8 px-3 py-1 rounded-full border border-primary/15">Challenge</span>
          </div>
          <p className="font-extrabold text-white font-display text-sm">{challenge.question}</p>
          <div className="flex items-center gap-3">
            <input value={challengeAns} onChange={e => setChallengeAns(e.target.value)}
              placeholder="e.g. 2:3" onKeyDown={e => e.key === 'Enter' && checkChallenge()}
              className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm font-extrabold font-display outline-none transition-colors ${
                challengeResult === true ? 'border-green-400 bg-green-900/30' : challengeResult === false ? 'border-red-300 bg-red-900/30' : 'border-white/15 focus:border-primary'
              }`} />
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={checkChallenge}
              className="flex items-center gap-1.5 bg-primary text-white font-extrabold py-2.5 px-5 rounded-xl shadow-md text-sm">
              Check <ChevronRight className="w-4 h-4"/>
            </motion.button>
          </div>
          {challengeResult !== null && (
            <div className={`rounded-xl p-3 text-sm font-medium ${challengeResult ? 'bg-green-900/30 text-green-300 border border-green-500/40' : 'bg-red-900/30 text-red-300 border border-red-500/40'}`}>
              {challengeResult ? '✅ Correct! GCF of 4 and 6 is 2. 4÷2=2, 6÷2=3. Answer: 2:3.' : '💡 Hint: Find the GCF of 4 and 6. Then divide both parts.'}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
