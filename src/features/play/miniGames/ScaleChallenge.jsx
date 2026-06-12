import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '../../../core/store/progressStore';
import { ChevronRight, Zap } from 'lucide-react';

function randInt(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }

function genPuzzle() {
  const a = randInt(1,9), b = randInt(1,9), c = randInt(1,9);
  const d = (b * c) / a;
  if (!Number.isInteger(d) || d < 1 || d > 30) return genPuzzle();
  const wrong1 = d + randInt(1,4);
  const wrong2 = Math.max(1, d - randInt(1,4));
  const wrong3 = a * c;
  const opts = [...new Set([d, wrong1, wrong2, wrong3])].slice(0,4);
  while (opts.length < 4) opts.push(d + opts.length * 3);
  return { a, b, c, d, opts: opts.sort(() => Math.random()-0.5) };
}

export default function ScaleChallenge({ onComplete }) {
  const { addXP, addCoins } = useProgressStore();
  const [puzzles]    = useState(() => Array.from({length:5}, genPuzzle));
  const [idx, setIdx]= useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone]   = useState(false);

  const p = puzzles[idx];

  const handleAnswer = (v) => {
    if (submitted) return;
    setSelected(v);
    setSubmitted(true);
    const correct = v === p.d;
    if (correct) { setScore(s=>s+1); addXP(8); addCoins(2); }
  };

  const handleNext = () => {
    if (idx < puzzles.length - 1) { setIdx(i=>i+1); setSelected(null); setSubmitted(false); }
    else { setDone(true); }
  };

  if (done) return (
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 text-center flex flex-col items-center gap-5">
      <div className="text-5xl">⚖️</div>
      <h3 className="font-extrabold text-xl text-white font-display">Scale Challenge Done!</h3>
      <p className="text-white/50 text-sm">{score}/5 scales balanced</p>
      <button onClick={onComplete} className="flex items-center gap-2 bg-secondary text-white font-extrabold py-2.5 px-7 rounded-full shadow-md text-sm">
        <Zap className="w-4 h-4"/>Collect +{score*8} XP
      </button>
    </motion.div>
  );

  const tilt = submitted ? 0 : 0;
  return (
    <div className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      <div className="h-1.5 bg-white/10">
        <div className="h-full bg-secondary transition-all" style={{width:`${(idx/puzzles.length)*100}%`}} />
      </div>
      <div className="p-6 md:p-8 flex flex-col items-center gap-6">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/8 px-3 py-1 rounded-full border border-secondary/15">Puzzle {idx+1} of 5</span>
        <p className="text-sm text-white/50 font-medium">Find the missing value to make this proportion true:</p>

        {/* Proportion display */}
        <div className="flex items-center gap-4 text-2xl font-extrabold font-display">
          <span className="text-primary">{p.a}:{p.b}</span>
          <span className="text-white/30">=</span>
          <span className="text-secondary">{p.c}:?</span>
        </div>

        {/* Scale visual */}
        <div className="relative w-36 h-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-12 bg-amber-600 rounded-full" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-amber-900/300 rounded-full" />
          <div className="absolute top-5 left-3 w-8 h-5 bg-amber-900/40 rounded-lg border border-amber-300 flex items-center justify-center text-xs font-extrabold text-amber-300">{p.a}:{p.b}</div>
          <div className="absolute top-5 right-3 w-8 h-5 bg-violet-100 rounded-lg border border-violet-300 flex items-center justify-center text-xs font-extrabold text-violet-700">{p.c}:?</div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {p.opts.map(v => {
            const isSelected = selected === v;
            const isRight    = submitted && v === p.d;
            const isWrong    = submitted && isSelected && v !== p.d;
            return (
              <motion.button key={v} whileHover={!submitted?{scale:1.03}:{}} whileTap={!submitted?{scale:0.97}:{}}
                onClick={() => handleAnswer(v)}
                className={`py-3 rounded-xl border-2 font-extrabold text-lg font-display transition-all ${
                  isRight ? 'border-green-400 bg-green-900/30 text-green-300' :
                  isWrong ? 'border-red-300 bg-red-900/30 text-red-600' :
                  isSelected ? 'border-secondary bg-secondary/8 text-secondary' :
                  'border-white/10 bg-white/5 text-white/80 hover:border-white/15'
                }`}>
                {v}
              </motion.button>
            );
          })}
        </div>

        {submitted && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            className={`w-full rounded-xl p-3 border text-sm text-center ${selected===p.d?'bg-green-900/30 border-green-500/40 text-green-300':'bg-amber-900/30 border-amber-500/40 text-amber-300'}`}>
            {selected===p.d ? `✅ Correct! ${p.a}:${p.b} = ${p.c}:${p.d} — cross multiply: ${p.a}×${p.d} = ${p.b}×${p.c} ✓`
              : `💡 The answer was ${p.d}. Scale factor from ${p.a} to ${p.c} is ${p.c/p.a}, so apply that to ${p.b}.`}
          </motion.div>
        )}

        {submitted && (
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleNext}
            className="flex items-center gap-2 bg-secondary text-white font-extrabold py-2.5 px-6 rounded-full shadow-md text-sm">
            {idx<puzzles.length-1?'Next':'Finish'} <ChevronRight className="w-4 h-4"/>
          </motion.button>
        )}
      </div>
    </div>
  );
}
