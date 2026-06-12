// Shared visual aids for ratio/rate/proportion questions

/* Horizontal proportional bar — used for ratios & sharing problems */
export function RatioBarDiagram({ partA, partB, labelA = 'A', labelB = 'B', missing = 'none', total, colorA = '#ef5350', colorB = '#3b82f6' }) {
  const a = Number(partA) || 1;
  const b = Number(partB) || 1;
  const sum = a + b;

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '20px auto' }}>
      {total != null && (
        <div style={{
          textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700,
          marginBottom: 10, color: 'var(--text-secondary)', fontSize: '1rem',
        }}>
          Total = {total}
        </div>
      )}
      <div className="ratio-bar-track">
        <div className="ratio-bar-segment" style={{ flex: a / sum, background: colorA, minWidth: 48 }}>
          {missing === 'A' ? '?' : partA}
        </div>
        <div className="ratio-bar-segment" style={{ flex: b / sum, background: colorB, minWidth: 48 }}>
          {missing === 'B' ? '?' : partB}
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 10,
        fontSize: '0.9rem', fontFamily: 'var(--font-display)', fontWeight: 700,
      }}>
        <span style={{ color: colorA }}>{labelA}</span>
        <span style={{ color: colorB }}>{labelB}</span>
      </div>
    </div>
  );
}

/* Two groups of emoji counters — used for picture-ratio questions */
export function PictureRatio({ a, b, emojiA, emojiB }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', margin: '20px 0' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 320 }}>
        {Array.from({ length: a }, (_, i) => (
          <span key={i} style={{ fontSize: '2.2rem', lineHeight: 1 }}>{emojiA}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 320 }}>
        {Array.from({ length: b }, (_, i) => (
          <span key={i} style={{ fontSize: '2.2rem', lineHeight: 1 }}>{emojiB}</span>
        ))}
      </div>
    </div>
  );
}

/* a : b = c : d display — used for proportion / cross-multiplication questions */
export function ProportionVisual({ a, b, c, d }) {
  const tokens = [a, ':', b, '=', c, ':', d];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      margin: '20px 0', padding: '20px 24px', flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.06)', borderRadius: 18,
      border: '1px solid rgba(255,255,255,0.12)',
    }}>
      {tokens.map((t, i) => {
        const isOperator = t === ':' || t === '=';
        const isUnknown  = t === 'x' || t === '?';
        return (
          <span key={i} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: isOperator ? '1.4rem' : '2.1rem',
            color: isOperator ? 'var(--text-muted)' : isUnknown ? 'var(--gold)' : 'var(--text-primary)',
          }}>
            {t}
          </span>
        );
      })}
    </div>
  );
}
