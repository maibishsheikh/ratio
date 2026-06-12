import { useState, useCallback, useEffect } from 'react';
import { useAudio } from '../../core/audio/useAudio';
import { storyNarrations } from '../../utils/narration';

const STORY_SLIDES = [
  {
    title: "The Spice Bazaar 🌶️",
    text: "Alex runs a spice stall at the bustling bazaar. Each morning, he mixes 2 bags of pepper with 3 bags of salt. Customers love his blend! But one day, a big order arrives — they need 6 bags of pepper. How much salt does Alex need to keep the same flavour?",
    highlight: "2 bags pepper : 3 bags salt  →  6 bags pepper : 9 bags salt",
    answer: "Answer: 9 bags of salt! Multiply both sides by 3.",
    image: "/assets/images/story/1.png",
  },
  {
    title: "What is a Ratio? ⚖️",
    text: "A ratio compares two quantities of the same type. Alex's mix is 2 : 3 — for every 2 bags of pepper, there are 3 bags of salt. We can write it as '2 to 3', '2 : 3', or the fraction 2/3. The ratio stays exactly the same even when amounts get bigger or smaller!",
    highlight: "2:3 = 4:6 = 6:9 = 8:12 — all the same ratio!",
    answer: null,
    image: "/assets/images/story/2.png",
  },
  {
    title: "Rates at the Speedway 🚗",
    text: "Emma's race car travels 120 km in 2 hours. That's a RATE — it compares two different types of measurement (distance and time). We write it as '60 km per hour' or '60 km/h'. Unlike a ratio, rates always have two different units joined by the word 'per'.",
    highlight: "Speed = Distance ÷ Time = 120 km ÷ 2 h = 60 km/h",
    answer: null,
    image: "/assets/images/story/3.png",
  },
  {
    title: "Proportion Palace 🏰",
    text: "Two ratios that are equal form a PROPORTION. If 5 pens cost $3, then 10 pens cost $6 — the ratio of pens to price stays the same. We use cross-multiplication to check: multiply diagonally and the products should be equal. This is one of the most powerful tools in maths!",
    highlight: "5 : 3  =  10 : 6   →   5 × 6 = 30   and   3 × 10 = 30  ✓",
    answer: null,
    image: "/assets/images/story/4.png",
  },
  {
    title: "You're Ready! 🏆",
    text: "You now understand three powerful ideas: ratios compare same-type quantities (e.g. 2:3), rates compare different units (e.g. 60 km/h), and proportions are equal ratios (check with cross-multiplication). These skills help solve real problems — in cooking, on maps, calculating speeds, and much more!",
    highlight: "Ratio → Rate → Proportion — you've got this! 🚀",
    answer: null,
    image: "/assets/images/story/5.png",
  },
];

// World 1 narration scripts align with our 5 slides
const SLIDE_NARRATIONS = [
  storyNarrations[1][0],
  storyNarrations[1][1],
  storyNarrations[1][2],
  storyNarrations[1][3],
  storyNarrations[1][4],
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [index, setIndex] = useState(0);
  const { playNarration, stop } = useAudio();
  const slide = STORY_SLIDES[index];
  const total = STORY_SLIDES.length;
  const pct   = Math.round(((index + 1) / total) * 100);

  // Play narration for current slide
  useEffect(() => {
    if (!audioEnabled) return;
    const seg = SLIDE_NARRATIONS[index];
    if (seg) {
      playNarration([seg], null, null);
    }
    return () => stop();
  }, [index, audioEnabled]);

  // Stop audio when phase unmounts
  useEffect(() => {
    return () => stop();
  }, []);

  const next = useCallback(() => {
    stop();
    if (index + 1 < total) setIndex(i => i + 1);
    else onComplete();
  }, [index, total, onComplete, stop]);

  const prev = useCallback(() => {
    stop();
    if (index > 0) setIndex(i => i - 1);
  }, [index, stop]);

  return (
    <div className="story-phase">

      {/* ── Progress bar ── */}
      <div className="story-progress">
        <div className="story-progress-bar">
          <div className="story-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="story-progress-label">{index + 1} / {total}</div>
      </div>

      {/* ── Story card — image on top, scrollable text below ── */}
      <div className="story-card">

        {/* Real image panel */}
        <div className="story-image-section" style={{ background: '#1a1a2e', padding: 0, overflow: 'hidden' }}>
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'opacity 0.3s ease',
            }}
          />
        </div>

        {/* Text body — scrollable */}
        <div className="story-text-section">
          <h2 className="story-title">{slide.title}</h2>
          <p className="story-text">{slide.text}</p>

          {slide.highlight && (
            <div className="story-highlight">
              <span className="story-highlight-icon">💡</span>
              <span className="story-highlight-text">{slide.highlight}</span>
            </div>
          )}

          {slide.answer && (
            <div className="story-answer">✅ {slide.answer}</div>
          )}

          {/* Mascot */}
          <div className="story-mascot-row">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem', flexShrink: 0 }}>🧮</div>
            <div className="speech-bubble" style={{ fontSize: '0.88rem', padding: '9px 13px' }}>
              {index === total - 1 ? "Let's play! 🎮" : "Got it? Let's keep going! 👉"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="story-nav">
        <button
          className="btn btn-outline btn-sm"
          onClick={prev}
          disabled={index === 0}
          style={{ opacity: index === 0 ? 0.35 : 1 }}
        >
          ← Back
        </button>

        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (
            <div key={i} className={`story-dot ${i === index ? 'active' : i < index ? 'completed' : ''}`} />
          ))}
        </div>

        <button className="btn btn-primary btn-sm" onClick={next}>
          {index + 1 === total ? '🎮 Play!' : 'Next →'}
        </button>
      </div>

    </div>
  );
}
