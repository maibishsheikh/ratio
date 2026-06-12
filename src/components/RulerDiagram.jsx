import React from 'react';

const CM_PX  = 24;   // pixels per centimetre
const RH     = 60;   // ruler height
const OBJ_H  = 14;   // object bar height
const PAD    = 24;   // left/right padding
const TOP_P  = 22;   // space above ruler for object bar

/**
 * RulerDiagram
 * Props:
 *   length       {number} — total ruler length in cm  (default 30)
 *   markedLength {number} — length of the object bar
 *   selected     {number} — currently tapped cm value
 *   onSelect     {fn}     — if provided, ruler is interactive
 *   emojiChar    {string} — emoji to show on the object bar
 */
export default function RulerDiagram({
  length      = 30,
  markedLength,
  selected,
  onSelect,
  emojiChar   = '✏️',
}) {
  const svgW = length * CM_PX + PAD * 2;
  const svgH = TOP_P + RH + 8;

  return (
    <div className="ruler-svg-container" role="img" aria-label={`Ruler showing ${markedLength ?? 0} cm`}>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', minWidth: svgW }}
      >
        <defs>
          <linearGradient id="rulerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="objGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#ff7043" />
            <stop offset="100%" stopColor="#ff8a65" />
          </linearGradient>
        </defs>

        {/* Ruler body */}
        <rect
          x={PAD} y={TOP_P}
          width={length * CM_PX} height={RH}
          rx={6} ry={6}
          fill="url(#rulerGrad)"
        />

        {/* Ruler border */}
        <rect
          x={PAD} y={TOP_P}
          width={length * CM_PX} height={RH}
          rx={6} ry={6}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
        />

        {/* Object bar (markedLength) */}
        {markedLength > 0 && (
          <>
            <rect
              x={PAD} y={TOP_P - OBJ_H - 4}
              width={markedLength * CM_PX} height={OBJ_H}
              rx={4} ry={4}
              fill="url(#objGrad)"
              opacity={0.92}
            />
            {/* Emoji label on bar */}
            <text
              x={PAD + 4}
              y={TOP_P - OBJ_H - 4 + OBJ_H / 2 + 5}
              fontSize={11}
              fill="white"
              fontFamily="system-ui, sans-serif"
            >
              {emojiChar}
            </text>
          </>
        )}

        {/* Tick marks + labels + tap targets */}
        {Array.from({ length: length + 1 }, (_, i) => {
          const x        = PAD + i * CM_PX;
          const isFive   = i % 5 === 0;
          const tickH    = isFive ? 22 : 10;
          const isSelHl  = selected === i;
          const isMark   = markedLength && i === markedLength;

          return (
            <g key={i}>
              {/* Tick */}
              <line
                x1={x} y1={TOP_P}
                x2={x} y2={TOP_P + tickH}
                stroke={isFive ? 'white' : 'rgba(255,255,255,0.55)'}
                strokeWidth={isFive ? 2.5 : 1}
              />

              {/* Label every 5 cm */}
              {isFive && i > 0 && (
                <text
                  x={x} y={TOP_P + 38}
                  textAnchor="middle"
                  fontFamily="Fredoka, sans-serif"
                  fontSize={13}
                  fontWeight={700}
                  fill={isSelHl || isMark ? '#ffc107' : 'white'}
                >
                  {i}
                </text>
              )}

              {/* Gold highlight if selected */}
              {isSelHl && (
                <rect
                  x={x - CM_PX / 2} y={TOP_P}
                  width={CM_PX} height={RH}
                  fill="rgba(255,193,7,0.22)"
                  rx={3}
                />
              )}

              {/* Interactive tap target (per cm segment) */}
              {onSelect && i > 0 && (
                <rect
                  x={x - CM_PX} y={TOP_P}
                  width={CM_PX} height={RH}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelect(i)}
                  role="button"
                  aria-label={`${i} centimetres`}
                />
              )}
            </g>
          );
        })}

        {/* "0" label */}
        <text
          x={PAD} y={TOP_P + 38}
          textAnchor="middle"
          fontFamily="Fredoka, sans-serif"
          fontSize={13}
          fontWeight={700}
          fill="white"
        >
          0
        </text>
      </svg>
    </div>
  );
}
