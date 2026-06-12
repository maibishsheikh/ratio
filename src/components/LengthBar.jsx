import React from 'react';

const BAR_COLORS = ['#8b5cf6','#4caf50','#ff7043','#3f51b5','#e91e63','#00bcd4'];

/**
 * LengthBar — horizontal proportional bar
 * Props: label, length, maxLength, colorIndex, onClick, badgeNum, isSelected
 */
export default function LengthBar({
  label,
  length,
  maxLength,
  colorIndex = 0,
  onClick,
  badgeNum,
  isSelected,
}) {
  const pct      = maxLength > 0 ? Math.max(10, (length / maxLength) * 100) : 30;
  const color    = BAR_COLORS[colorIndex % BAR_COLORS.length];
  const canClick = !!onClick;

  return (
    <div
      className="length-bar-container"
      onClick={canClick ? onClick : undefined}
      style={{ cursor: canClick ? 'pointer' : 'default' }}
      role={canClick ? 'button' : undefined}
      aria-label={canClick ? `Select ${label} (${length} cm)` : undefined}
      aria-pressed={isSelected}
    >
      <div
        className="length-bar"
        style={{
          width:      `${pct}%`,
          background: isSelected
            ? `linear-gradient(90deg, ${color}, rgba(255,255,255,0.3))`
            : color,
          boxShadow: isSelected ? `0 0 12px ${color}88` : 'none',
          border:    isSelected ? '2px solid var(--gold)' : '2px solid transparent',
          transition: 'all 0.35s ease',
        }}
      >
        <span className="length-bar-label">{label}</span>

        {/* Ordered badge */}
        {badgeNum != null && (
          <div className="length-bar-badge">{badgeNum}</div>
        )}
      </div>

      {/* Length value shown to the right */}
      <span className="length-bar-value">{length} cm</span>
    </div>
  );
}
