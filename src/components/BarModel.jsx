import React from 'react';

/**
 * BarModel — Singapore part-whole bar model
 * Props: total, partA, partB, unitLabel, hideTotal
 */
export default function BarModel({ total, partA, partB, unitLabel = 'cm', hideTotal = false }) {
  const safeTotal = total ?? (partA + partB);
  const pctA      = safeTotal > 0 ? (partA / safeTotal) * 100 : 50;
  const pctB      = 100 - pctA;

  return (
    <div className="bar-model" role="figure" aria-label="Bar model diagram">
      {/* Total bar (whole) */}
      {!hideTotal && (
        <div>
          <div className="bar-model-label-row">
            <span className="bar-model-row-label">Total (Whole)</span>
            <span className="bar-model-row-label" style={{ color: 'var(--green)' }}>
              {safeTotal} {unitLabel}
            </span>
          </div>
          <div className="bar-model-total">
            <span className="bar-model-text">{safeTotal} {unitLabel}</span>
          </div>
        </div>
      )}

      {/* Parts row */}
      <div>
        <div className="bar-model-label-row">
          <span className="bar-model-row-label">Parts</span>
        </div>
        <div className="bar-model-parts">
          <div
            className="bar-model-part-a"
            style={{ flex: pctA }}
          >
            <span className="bar-model-text">{partA} {unitLabel}</span>
          </div>
          <div
            className="bar-model-part-b"
            style={{ flex: pctB }}
          >
            <span className="bar-model-text">{partB} {unitLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
