import React, { useEffect, useRef } from 'react';

export default function CTA() {
  const engineerBtnRef = useRef(null);
  const driverBtnRef = useRef(null);

  useEffect(() => {
    const eb = engineerBtnRef.current;
    const db = driverBtnRef.current;
    if (!eb || !db) return;

    let s = {
      t: null,
      es: 0, ds: 0,
      eBg: 249, eBo: 20, eT: 20,
      dBg: 20, dBo: 20, dT: 249
    };

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    let rafId;
    function animateButtons() {
      if (s.t === 'engineer') {
        s.es = lerp(s.es, -13, 0.1);
        s.eBg = lerp(s.eBg, 20, 0.1);
        s.eBo = lerp(s.eBo, 20, 0.1);
        s.eT = lerp(s.eT, 249, 0.1);
        s.ds = lerp(s.ds, 0, 0.1);
        s.dBg = lerp(s.dBg, 20, 0.1);
        s.dBo = lerp(s.dBo, 20, 0.1);
        s.dT = lerp(s.dT, 249, 0.1);
      } else if (s.t === 'driver') {
        s.ds = lerp(s.ds, -13, 0.1);
        s.dBg = lerp(s.dBg, 249, 0.1);
        s.dBo = lerp(s.dBo, 20, 0.1);
        s.dT = lerp(s.dT, 20, 0.1);
        s.es = lerp(s.es, 0, 0.1);
        s.eBg = lerp(s.eBg, 249, 0.1);
        s.eBo = lerp(s.eBo, 20, 0.1);
        s.eT = lerp(s.eT, 20, 0.1);
      } else {
        s.es = lerp(s.es, 0, 0.1);
        s.ds = lerp(s.ds, 0, 0.1);
        s.eBg = lerp(s.eBg, 249, 0.1);
        s.eBo = lerp(s.eBo, 20, 0.1);
        s.eT = lerp(s.eT, 20, 0.1);
        s.dBg = lerp(s.dBg, 20, 0.1);
        s.dBo = lerp(s.dBo, 20, 0.1);
        s.dT = lerp(s.dT, 249, 0.1);
      }

      eb.style.backgroundColor = `rgb(${s.eBg},0,0)`;
      eb.style.borderColor = `rgb(${s.eBo},${s.eBo + 4},${s.eBo + 10})`;
      eb.querySelector('.button-text').style.color = `rgb(${s.eT},0,0)`;
      
      db.style.backgroundColor = `rgb(${s.dBg},0,0)`;
      db.style.borderColor = `rgb(${s.dBo},${s.dBo + 4},${s.dBo + 10})`;
      db.querySelector('.button-text').style.color = `rgb(${s.dT},0,0)`;
      
      eb.style.transform = `skewX(${s.es}deg)`;
      eb.querySelector('.button-text').style.transform = `skewX(${-s.es}deg)`;
      
      db.style.transform = `skewX(${s.ds}deg)`;
      db.querySelector('.button-text').style.transform = `skewX(${-s.ds}deg)`;

      rafId = requestAnimationFrame(animateButtons);
    }

    animateButtons();

    const handleEEnter = () => s.t = 'engineer';
    const handleDEnter = () => s.t = 'driver';
    const handleLeave = () => s.t = null;

    eb.addEventListener('mouseenter', handleEEnter);
    eb.addEventListener('mouseleave', handleLeave);
    db.addEventListener('mouseenter', handleDEnter);
    db.addEventListener('mouseleave', handleLeave);

    return () => {
      cancelAnimationFrame(rafId);
      eb.removeEventListener('mouseenter', handleEEnter);
      eb.removeEventListener('mouseleave', handleLeave);
      db.removeEventListener('mouseenter', handleDEnter);
      db.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section id="cta" className="cta-section">
      <div className="cta-heading">
        Be the one who<br /><span className="text-accent">drives the future</span>
      </div>
      <div className="cta-text">
        Choose the path that matches your expertise and become part of the Anvil Racing program.
      </div>
      <div className="btn-wrapper">
        <a id="engineer-btn" href="#" className="cta-btn" ref={engineerBtnRef}>
          <span className="button-text">Join as Engineer</span>
        </a>
        <a id="driver-btn" href="#" className="cta-btn" ref={driverBtnRef}>
          <span className="button-text">Join as Driver</span>
        </a>
      </div>
      <div className="cta-filler"></div>
    </section>
  );
}