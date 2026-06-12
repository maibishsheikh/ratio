import React from 'react';

/**
 * RatioBondDiagram
 * Visualises a proportion  a : b  =  c : d
 * One of a/b/c/d can be the "missing" slot (shown as '?').
 */
export default function RatioBondDiagram({ a, b, c, d, missing = 'none', animated = true }) {
  const boxFill  = (key, fallback) => (missing === key ? '#FFF9C4' : fallback);
  const textFill = (key) => (missing === key ? '#999' : '#FFF');
  const dash     = (key) => (missing === key ? '6,3' : '0');
  const display  = (key, value) => (missing === key ? '?' : value);
  const tStyle   = { transition: animated ? 'all 0.3s ease' : 'none' };

  return (
    <svg viewBox="0 0 290 80" style={{ width: '100%', maxWidth: 290 }}>
      {/* a */}
      <rect x="4" y="12" width="56" height="56" rx="12"
        fill={boxFill('a', '#4A90D9')} stroke="#2E6DB4" strokeWidth="3"
        strokeDasharray={dash('a')} style={tStyle} />
      <text x="32" y="48" textAnchor="middle" fontSize="22" fontWeight="bold" fill={textFill('a')}>
        {display('a', a)}
      </text>

      {/* : */}
      <text x="68" y="48" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#FFFFFF">:</text>

      {/* b */}
      <rect x="76" y="12" width="56" height="56" rx="12"
        fill={boxFill('b', '#4A90D9')} stroke="#2E6DB4" strokeWidth="3"
        strokeDasharray={dash('b')} style={tStyle} />
      <text x="104" y="48" textAnchor="middle" fontSize="22" fontWeight="bold" fill={textFill('b')}>
        {display('b', b)}
      </text>

      {/* = */}
      <text x="145" y="48" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#FFD54F">=</text>

      {/* c */}
      <rect x="158" y="12" width="56" height="56" rx="12"
        fill={boxFill('c', '#FF8A50')} stroke="#E65C00" strokeWidth="3"
        strokeDasharray={dash('c')} style={tStyle} />
      <text x="186" y="48" textAnchor="middle" fontSize="22" fontWeight="bold" fill={textFill('c')}>
        {display('c', c)}
      </text>

      {/* : */}
      <text x="222" y="48" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#FFFFFF">:</text>

      {/* d */}
      <rect x="230" y="12" width="56" height="56" rx="12"
        fill={boxFill('d', '#FF8A50')} stroke="#E65C00" strokeWidth="3"
        strokeDasharray={dash('d')} style={tStyle} />
      <text x="258" y="48" textAnchor="middle" fontSize="22" fontWeight="bold" fill={textFill('d')}>
        {display('d', d)}
      </text>
    </svg>
  );
}
