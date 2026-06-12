// ProgressRing.jsx
// SVG circular progress ring used to display mastery percentages.

import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProgressRing
 * Props:
 *   value       {number}  0–100 percentage
 *   size        {number}  Diameter in px (default 64)
 *   stroke      {number}  Stroke width (default 6)
 *   color       {string}  Stroke color (default primary teal)
 *   trackColor  {string}  Background track color
 *   label       {string}  Center label (if omitted, shows value%)
 *   labelSize   {string}  Font size class (default 'text-sm')
 */
export default function ProgressRing({
  value = 0,
  size = 64,
  stroke = 6,
  color = '#0F766E',
  trackColor = '#E5E7EB',
  label,
  labelSize = 'text-sm',
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <span
        className={`absolute font-extrabold ${labelSize} text-white`}
        style={{ color }}
      >
        {label ?? `${pct}%`}
      </span>
    </div>
  );
}
