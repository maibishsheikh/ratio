import React, { useMemo } from 'react';

const SYMBOLS = ['📏', '📐', 'cm', 'm', '1m', '100cm', '⬤', '◼', '→', '≡', '5cm', '10cm', '🔢', '⬅', '▶'];

export default function FloatingNumbers() {
  const items = useMemo(() => (
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      symbol:   SYMBOLS[i % SYMBOLS.length],
      top:      Math.random() * 100,
      left:     Math.random() * 100,
      fontSize: 0.8 + Math.random() * 1.4,
      opacity:  0.04 + Math.random() * 0.04,
      delay:    Math.random() * 12,
      duration: 12 + Math.random() * 16,
    }))
  ), []);

  return (
    <div className="floating-numbers" aria-hidden="true">
      {items.map(item => (
        <div
          key={item.id}
          className="floating-symbol"
          style={{
            top:            `${item.top}%`,
            left:           `${item.left}%`,
            fontSize:       `${item.fontSize}rem`,
            opacity:        item.opacity,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );
}
