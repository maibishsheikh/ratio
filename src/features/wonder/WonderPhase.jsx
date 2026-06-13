import { useState, useEffect, useCallback } from 'react';
import { useAudio } from '../../core/audio/useAudio';
import { wonderHookNarration } from '../../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "Mia mixes 2 cups of orange juice with 3 cups of water. Is that the same mix as 4 cups juice and 6 cups water?",
    subtext: "When two amounts compare the same way, we call it a ratio!",
    emoji: "🍊",
    bgEmojis: ["🍊", "💧", "⚖️", "🔢"],
    worldId: 1,
  },
  {
    question: "A car travels 60 km in 1 hour. How far does it go in 2 hours if it keeps the same speed?",
    subtext: "Speed is a rate — it compares distance to time!",
    emoji: "🚗",
    bgEmojis: ["🚗", "⏱️", "🛣️", "💨"],
    worldId: 2,
  },
  {
    question: "At a stall, 3 apples cost $2. How much do 9 apples cost?",
    subtext: "When price per item stays the same, quantities are in proportion!",
    emoji: "🍎",
    bgEmojis: ["🍎", "💰", "🛒", "✨"],
    worldId: 1,
  },
  {
    question: "In a class, 12 out of 30 students like maths. What fraction of the class is that?",
    subtext: "Ratios help us compare parts to wholes — just like fractions!",
    emoji: "📊",
    bgEmojis: ["📊", "🧮", "🎓", "🔢"],
    worldId: 1,
  },
  {
    question: "A recipe needs 1 cup of sugar for every 4 cups of flour. If you use 3 cups of sugar, how much flour do you need?",
    subtext: "Keeping ratios equal is what proportional thinking is all about!",
    emoji: "🍰",
    bgEmojis: ["🍰", "🥣", "⚖️", "🌟"],
    worldId: 1,
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(
    () => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]
  );
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);
  const { playNarration, stop } = useAudio();

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Play hook narration exactly once, when the question card first appears
  useEffect(() => {
    if (stage !== 1 || !audioEnabled) return;
    const segs = wonderHookNarration(wonder.worldId);
    if (segs.length > 0) playNarration(segs, null, null);
  }, [stage, audioEnabled]);

  // Stop audio on unmount
  useEffect(() => {
    return () => stop();
  }, []);

  const handleDiscover = useCallback(() => {
    stop();
    setTimeout(() => onComplete(), 400);
  }, [onComplete, stop]);

  return (
    <div className="wonder-phase">
      {/* Floating emoji particles */}
      <div className="wonder-particles">
        {particles.map(p => (
          <span
            key={p.id}
            className="wonder-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}rem`,
            }}
          >{p.emoji}</span>
        ))}
      </div>

      {/* Central content */}
      <div className="wonder-content">
        {/* Big ? mark */}
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>

        {/* Mascot with speech bubble */}
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot-container">
            <div className="mascot thinking">🧮</div>
            <div className="speech-bubble wonder-bubble">
              Hmm… I wonder… 🤔
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <span className="wonder-emoji">{wonder.emoji}</span>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>

        {/* Discover button */}
        <button
          className={`btn-wonder ${stage >= 2 ? 'visible' : ''}`}
          onClick={handleDiscover}
          id="discover-btn"
        >
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
