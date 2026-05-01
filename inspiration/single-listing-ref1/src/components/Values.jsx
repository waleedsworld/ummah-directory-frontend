import React from 'react';

export default function Values() {
  return (
    <section id="values" className="values-section">
      <div className="values-wrapper">
        <div className="values-left" style={{ position: 'sticky', top: '120px', alignSelf: 'start' }}>
          <div className="section-label">
            <div className="red-sq"></div>
            <span>Guiding Principles</span>
          </div>
          <div className="values-left-heading">Our Racing<br />Philosophy</div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--text-dim)', marginTop: '32px', maxWidth: '380px' }}>
            Three pillars define how we approach every race weekend, every design decision, and every tenth of a second on the stopwatch.
          </p>
          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '1px', background: 'var(--accent)' }}></div>
              <span style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>Est. 2018</span>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.6rem' }}>120+</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>Engineers</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.6rem' }}>2</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>Drivers</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.6rem' }}>1</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>Mission</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="values-right">
          <div className="values-card">
            <div className="values-card-num">[01]</div>
            <h3>Precision</h3>
            <p>Every component is measured to the micron. Every pit stop choreographed to the millisecond. We don't accept approximation — we demand exactness from machine and human alike.</p>
            <div className="values-card-img">
              <img src="https://raw.githubusercontent.com/VanhDc/starter-templates/main/anvil/images/precision.jpg" alt="Engineering precision" />
            </div>
          </div>
          <div className="values-card">
            <div className="values-card-num">[02]</div>
            <h3>Strategy</h3>
            <p>Data-driven decisions made at 300 km/h. Our race engineers process thousands of telemetry points per second, turning raw data into split-second tactical advantage on every corner.</p>
            <div className="values-card-img">
              <img src="https://raw.githubusercontent.com/VanhDc/starter-templates/main/anvil/images/strategy.jpg" alt="Race strategy" />
            </div>
          </div>
          <div className="values-card">
            <div className="values-card-num">[03]</div>
            <h3>Legacy</h3>
            <p>We're not building a team. We're building a dynasty. Every race adds to our story — a lineage of drivers, engineers, and victories that spans generations of motorsport excellence.</p>
            <div className="values-card-img">
              <img src="https://raw.githubusercontent.com/VanhDc/starter-templates/main/anvil/images/legacy.jpg" alt="Racing legacy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}