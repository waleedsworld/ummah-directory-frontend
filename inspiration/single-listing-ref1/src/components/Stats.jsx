import React from 'react';

export default function Stats() {
  return (
    <section className="stats-section" style={{ position: 'relative', padding: '100px 32px', background: 'var(--bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-label">
          <div className="red-sq"></div>
          <span>2026 Season</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginTop: '40px' }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
          <div style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1, color: 'var(--accent)' }}>P1</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 500, marginTop: '8px' }}>Constructor Standing</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px' }}>After 6 rounds</div>
          </div>
          <div style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1 }}>247</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 500, marginTop: '8px' }}>Points Scored</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px' }}>+38 ahead of P2</div>
          </div>
          <div style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1 }}>4</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 500, marginTop: '8px' }}>Race Victories</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px' }}>2 consecutive 1-2 finishes</div>
          </div>
          <div style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1, color: 'var(--accent)' }}>1:28.3</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 500, marginTop: '8px' }}>Fastest Lap Record</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px' }}>Circuit de Barcelona</div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '32px' }} className="max-md:grid-cols-1">
          <div style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>Next Race</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.4rem', marginBottom: '4px' }}>Grand Prix de Monaco</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Round 7 — May 25, 2026 · Monte Carlo</div>
          </div>
          <div style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>Driver Standings</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 500 }}>M. Hartley</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--accent)' }}>P2 — 142 pts</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>K. Tanaka</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>P4 — 105 pts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}