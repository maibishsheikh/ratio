const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder',   desc: 'A ratio mystery awaits!' },
  { icon: '📖', label: 'Story',    desc: 'See ratios in real life' },
  { icon: '🧪', label: 'Simulate', desc: 'Build ratios & rates' },
  { icon: '🎮', label: 'Play',     desc: '100 challenges & worlds' },
  { icon: '📓', label: 'Reflect',  desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      {/* Badge */}
      <div className="intro-badge">✨ Intellia SG · Grade 6 Maths</div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>RatioCraft</span>
        <br />
        <span style={{ color: 'var(--coral)', fontSize: '70%' }}>Ratios, Rates &amp; Proportions</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 1 · Introduction to Ratios &amp; Rates
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🧮</div>
        <div className="speech-bubble">
          Let's explore ratios! ⚖️
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to spot <strong style={{ color: 'var(--gold)' }}>ratios and rates</strong> everywhere —
        in markets, on tracks, and in everyday life.
        Master proportions and unlock the power of maths!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <div className="intro-journey-title">Your Learning Journey</div>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && (
                <div className="intro-journey-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={onStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">⚖️</div>
          <div className="feature-card-label">Ratios &amp; Rates</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🏆</div>
          <div className="feature-card-label">Badges &amp; XP</div>
        </div>
      </div>
    </div>
  );
}
