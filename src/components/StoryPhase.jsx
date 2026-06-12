import React, { useState, useEffect } from 'react';
import { narrate, stopAll } from '../utils/audio.js';
import { getStoryNarration } from '../utils/narration.js';

const SLIDES = [
  {
    title:     'Emma Discovers the Ruler',
    image:     '/images/1.png',
    text:      "Emma found a ruler on her desk. \"What is this for?\" she asked Roo.",
    speech:    "This ruler helps us measure length! Each small mark is 1 centimetre.",
    highlight: 'Each mark on a ruler equals 1 centimetre!',
    bg:        'linear-gradient(135deg, #4a2c8a, #1a237e)',
  },
  {
    title:     'Measuring with Centimetres',
    image:     '/images/2.png',
    text:      "Oliver placed his pencil on the ruler. It reached all the way to 15!",
    speech:    "That means your pencil is 15 centimetres long — or 15 cm!",
    highlight: 'Always start from zero! Read the number at the end — that is the length!',
    bg:        'linear-gradient(135deg, #1a237e, #283593)',
  },
  {
    title:     'When We Need Metres',
    image:     '/images/3.png',
    text:      "\"Roo, how long is the classroom door?\" asked Emma.",
    speech:    "It is too long for centimetres! We use metres for long things.",
    highlight: '100 centimetres make 1 metre — and we write it as 1 m!',
    bg:        'linear-gradient(135deg, #0d1b3e, #1a237e)',
  },
  {
    title:     'Measuring Champions!',
    image:     '/images/4.png',
    text:      "Now Emma and Oliver can measure anything with centimetres and metres!",
    speech:    "You are now Measuring Champions! Let us practise!",
    highlight: '1 metre = 100 centimetres',
    bg:        'linear-gradient(135deg, #7c3aed, #4a2c8a)',
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);

  // Start narration for the current slide
  useEffect(() => {
    if (!audioEnabled) return;
    narrate(getStoryNarration(slide), audioEnabled);
  }, [slide, audioEnabled]);

  const goTo = (next) => {
    stopAll();           // kill current audio immediately, before state update
    setSlide(next);
  };

  const goNext = () => {
    if (slide < SLIDES.length - 1) goTo(slide + 1);
    else { stopAll(); onComplete(); }
  };

  const goPrev = () => {
    if (slide > 0) goTo(slide - 1);
  };

  const s = SLIDES[slide];

  return (
    <div className="story-phase">
      <div
        className="section-heading"
        style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'var(--font-display)' }}
      >
        📖 Story
      </div>

      <div className="story-card" key={slide}>

        <div
          className="story-image-section"
          style={{
            background:  s.bg,
            aspectRatio: '1659 / 948',
            height:      'auto',
            maxHeight:   '420px',
            overflow:    'hidden',
          }}
        >
          <img
            src={s.image}
            alt={s.title}
            style={{
              width:          '100%',
              height:         '100%',
              objectFit:      'cover',
              objectPosition: 'center',
              display:        'block',
            }}
          />
        </div>

        <div className="story-content">
          <h2 className="story-title">{s.title}</h2>
          <p className="story-text">{s.text}</p>
          <div className="story-speech">
            <span className="story-speech-robot" aria-hidden="true">🤖</span>
            <div className="story-speech-text">"{s.speech}"</div>
          </div>
          <div className="story-highlight" role="note">
            ⭐ {s.highlight}
          </div>
        </div>

        <div className="story-progress">
          <div className="story-dots" role="tablist" aria-label="Slide navigation">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === slide}
                aria-label={`Slide ${i + 1}`}
                className={`story-dot${i === slide ? ' active' : i < slide ? ' completed' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <div className="story-nav">
            {slide > 0 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={goPrev}
                aria-label="Previous slide"
              >
                ← Back
              </button>
            )}
            <button
              className="btn btn-primary btn-sm"
              onClick={goNext}
              aria-label={slide < SLIDES.length - 1 ? 'Next slide' : 'Finish story'}
            >
              {slide < SLIDES.length - 1 ? 'Next →' : "Let's Simulate! 🧪"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
