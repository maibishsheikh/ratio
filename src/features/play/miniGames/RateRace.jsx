import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '../../../core/store/progressStore';
import { ChevronRight, Zap } from 'lucide-react';

function randInt(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }

function genRound() {
  const cars = ['🏎️','🚗','🚕'];
  const items = cars.map((car, i) => {
    const dist = randInt(5,30)*10, time = randInt(2,8);
    return { id: i, car, label: `Car ${String.fromCharCode(65+i)}`, dist, time, rate: dist/time };
  });
  // Ensure distinct rates
  const rates = items.map(i=>i.rate);
  if (new Set(rates).size < 3) return genRound();
  return items;
}

export default function RateRace({ onComplete }) {
  const { addXP, addCoins } = useProgressStore();
  const [rounds]   = useState(() => Array.from({length:3}, genRound));
  const [idx, setIdx]      = useState(0);
  const [order, setOrder]  = useState(() => [...rounds[0]].sort(()=>Math.random()-0.5));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore]  = useState(0);
  const [done, setDone]    = useState(false);
  const [dragIdx, setDragIdx]= useState(null);

  const items = rounds[idx];

  const moveUp   = (i) => { if(i===0) return; const a=[...order]; [a[i-1],a[i]]=[a[i],a[i-1]]; setOrder(a); };
  const moveDown = (i) => { if(i===order.length-1) return; const a=[...order]; [a[i],a[i+1]]=[a[i+1],a[i]]; setOrder(a); };

  const handleSubmit = () => {
    const sorted = [...items].sort((a,b)=>a.rate-b.rate);
    const correct = order.every((item, i) => item.id === sorted[i].id);
    setSubmitted(true);
    if (correct) { setScore(s=>s+1); addXP(15); addCoins(3); }
  };

  const handleNext = () => {
    if (idx < rounds.length - 1) {
      setIdx(i=>i+1);
      setOrder([...rounds[idx+1]].sort(()=>Math.random()-0.5));
      setSubmitted(false);
    } else { setDone(true); }
  };

  if (done) return (
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
      className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 p-8 text-center flex flex-col items-center gap-5">
      <div className="text-5xl">🏁</div>
      <h3 className="font-extrabold text-xl text-white font-display">Rate Race Complete!</h3>
      <p className="text-white/50 text-sm">{score}/3 rounds won</p>
      <button onClick={onComplete} className="flex items-center gap-2 bg-accent text-white font-extrabold py-2.5 px-7 rounded-full shadow-md text-sm">
        <Zap className="w-4 h-4"/>Collect +{score*15} XP
      </button>
    </motion.div>
  );

  const sorted = [...items].sort((a,b)=>a.rate-b.rate);

  return (
    <div className="w-full bg-white/5 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      <div className="h-1.5 bg-white/10">
        <div className="h-full bg-accent transition-all" style={{width:`${(idx/rounds.length)*100}%`}} />
      </div>
      <div className="p-6 md:p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/8 px-3 py-1 rounded-full border border-accent/15">Round {idx+1} of 3</span>
          <p className="text-xs text-white/40">Arrange slowest → fastest</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          {items.map(item => (
            <div key={item.id} className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
              <div className="text-2xl mb-1">{item.car}</div>
              <div className="font-extrabold text-sm text-white/80">{item.label}</div>
              <div className="text-xs text-white/50 mt-1">{item.dist} m in {item.time}s</div>
            </div>
          ))}
        </div>

        {/* Rank order */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-3">Your Ranking (slowest → fastest)</p>
          <div className="flex flex-col gap-2">
            {order.map((item, i) => {
              const correct = submitted && item.id === sorted[i].id;
              const wrong   = submitted && item.id !== sorted[i].id;
              return (
                <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  correct ? 'border-green-300 bg-green-900/30' : wrong ? 'border-red-500/40 bg-red-900/30' : 'border-white/15 bg-white/5'
                }`}>
                  <span className="text-[10px] font-extrabold text-white/40 w-3">{i+1}</span>
                  <span className="text-lg">{item.car}</span>
                  <span className="text-sm font-extrabold text-white/80 flex-1">{item.label} — {item.rate.toFixed(1)} m/s</span>
                  {!submitted && (
                    <div className="flex gap-1">
                      <button onClick={()=>moveUp(i)} disabled={i===0} className="w-6 h-6 rounded bg-white/10 text-xs font-bold hover:bg-white/15 disabled:opacity-30">↑</button>
                      <button onClick={()=>moveDown(i)} disabled={i===order.length-1} className="w-6 h-6 rounded bg-white/10 text-xs font-bold hover:bg-white/15 disabled:opacity-30">↓</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {submitted && (
          <div className={`rounded-xl p-3 border text-sm text-center font-medium ${
            order.every((item,i)=>item.id===sorted[i].id) ? 'bg-green-900/30 border-green-500/40 text-green-300' : 'bg-amber-900/30 border-amber-500/40 text-amber-300'
          }`}>
            {order.every((item,i)=>item.id===sorted[i].id)
              ? '✅ Perfect ranking! You correctly sorted by unit rate!'
              : `💡 Correct order: ${sorted.map(i=>i.label).join(' → ')} (divide distance ÷ time for each)`}
          </div>
        )}

        <div className="flex justify-end">
          {!submitted ? (
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleSubmit}
              className="flex items-center gap-2 bg-accent text-white font-extrabold py-2.5 px-6 rounded-full shadow-md text-sm">
              Lock in Ranking <ChevronRight className="w-4 h-4"/>
            </motion.button>
          ) : (
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleNext}
              className="flex items-center gap-2 bg-accent text-white font-extrabold py-2.5 px-6 rounded-full shadow-md text-sm">
              {idx<rounds.length-1?'Next Round':'Finish'} <ChevronRight className="w-4 h-4"/>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
