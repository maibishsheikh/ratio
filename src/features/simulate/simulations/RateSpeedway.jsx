import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function RateSpeedway({ onComplete, onDiscovery }) {
  const [cars] = useState([
    { id: 'A', emoji: '🏎️', color: '#F97316', dist: 90, time: 3  },
    { id: 'B', emoji: '🚗', color: '#7C3AED', dist: 120, time: 6 },
  ]);
  const [discovered, setDiscovered] = useState(false);
  const [racing, setRacing]         = useState(false);
  const [racePos, setRacePos]       = useState({ A: 0, B: 0 });
  const [challenge, setChallenge]   = useState(false);
  const [answer, setAnswer]         = useState('');
  const [result, setResult]         = useState(null);

  const rates = cars.map(c => ({ ...c, rate: c.dist / c.time }));
  const fastest = rates.sort((a,b) => b.rate - a.rate)[0];

  const startRace = () => {
    if (!discovered) { setDiscovered(true); onDiscovery?.('UNIT_RATE'); }
    setRacing(true);
    const winner = fastest.id;
    setTimeout(() => {
      setRacePos({ [winner]: 100, [cars.find(c=>c.id!==winner).id]: 67 });
      setTimeout(() => setChallenge(true), 800);
    }, 200);
  };

  const checkAnswer = () => {
    const correct = Number(answer) === 45;
    setResult(correct);
    if (correct) setTimeout(() => onComplete?.(), 1200);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">🏎️</span>
          <div>
            <h3 className="font-extrabold text-white font-display text-sm">Rate Speedway</h3>
            <p className="text-xs text-muted">Calculate each car's unit rate, then race to see who wins!</p>
          </div>
        </div>

        {/* Car stats */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {cars.map(car => (
            <div key={car.id} className="glass-card rounded-xl p-4 border border-white/10 text-center">
              <div className="text-3xl mb-2">{car.emoji}</div>
              <div className="font-extrabold text-secondary font-display text-sm">Car {car.id}</div>
              <div className="text-xs text-muted mt-1">{car.dist} m in {car.time}s</div>
              <div className="mt-2 font-extrabold text-sm" style={{color:car.color}}>
                {car.dist} ÷ {car.time} = <span className="text-lg">{car.dist/car.time}</span> m/s
              </div>
            </div>
          ))}
        </div>

        {/* Race track */}
        <div className="bg-gray-800 rounded-xl p-4 flex flex-col gap-3">
          {cars.map(car => (
            <div key={car.id} className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-white/30 w-6">Car {car.id}</span>
              <div className="flex-1 h-8 bg-gray-700 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 flex items-center px-2 gap-1">
                  {[...Array(8)].map((_,i)=><div key={i} className="flex-1 border-r border-dashed border-gray-600"/>)}
                </div>
                <motion.div className="absolute top-1 bottom-1 flex items-center"
                  animate={{ left: racing ? `calc(${racePos[car.id]}% - 20px)` : '2px' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}>
                  <span className="text-xl">{car.emoji}</span>
                </motion.div>
              </div>
              <span className="text-xs font-extrabold w-12 text-right" style={{color:car.color}}>{car.dist/car.time} m/s</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          {!racing ? (
            <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}} onClick={startRace}
              className="flex items-center gap-2 bg-accent text-white font-extrabold py-2.5 px-7 rounded-full shadow-md">
              🏁 Start Race!
            </motion.button>
          ) : (
            <div className="text-center font-extrabold text-white bg-accent rounded-full px-5 py-2 text-sm">
              🏆 Car {fastest.id} wins at {fastest.rate} m/s!
            </div>
          )}
        </div>
      </div>

      {challenge && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          className="glass-card rounded-2xl border border-white/10 shadow-md p-5 flex flex-col gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-accent/8 px-3 py-1 rounded-full border border-accent/15 w-fit">Challenge</span>
          <p className="font-extrabold text-white font-display text-sm">A new car covers 360 km in 8 hours. What is its unit rate in km/h?</p>
          <div className="flex items-center gap-3">
            <input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="km/h" onKeyDown={e=>e.key==='Enter'&&checkAnswer()}
              className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-center outline-none transition-colors ${
                result===true?'border-green-400 bg-green-900/30':result===false?'border-red-300 bg-red-900/30':'border-white/15 focus:border-accent'
              }`}/>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={checkAnswer}
              className="flex items-center gap-1.5 bg-accent text-white font-extrabold py-2.5 px-5 rounded-xl shadow-md text-sm">
              Check <ChevronRight className="w-4 h-4"/>
            </motion.button>
          </div>
          {result!==null&&(
            <div className={`rounded-xl p-3 text-sm ${result?'bg-green-900/30 text-green-300 border border-green-500/40':'bg-amber-900/30 text-amber-300 border border-amber-500/40'}`}>
              {result?'✅ Correct! 360 ÷ 8 = 45 km/h.':'💡 Unit rate = distance ÷ time = 360 ÷ 8 = 45 km/h.'}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
