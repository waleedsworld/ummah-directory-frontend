import React, { useEffect, useRef } from 'react';

export default function Team() {
  const trackRef = useRef(null);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    
    // Duplicate content for seamless infinite marquee
    t.innerHTML += t.innerHTML;
    
    let p = 0;
    let bs = 0.6;
    let sp = bs;
    let dir = -1;
    let lsy = window.scrollY;
    let lsc = Date.now();
    let rafId;

    function am() {
      p += sp * dir;
      t.style.transform = `translateX(${p}px)`;
      const rp = t.scrollWidth / 2;
      
      if (p <= -rp) p += rp;
      if (p >= rp) p -= rp;
      
      rafId = requestAnimationFrame(am);
    }
    
    am();

    const handleScroll = () => {
      const now = Date.now();
      const d = now - lsc;
      const sd = window.scrollY - lsy;
      
      if (sd > 0) dir = -1;
      else if (sd < 0) dir = 1;
      
      const ss = Math.abs(sd) / Math.max(d, 1);
      sp += (bs + ss * 0.25 - sp) * 0.1;
      
      lsy = window.scrollY;
      lsc = now;
    };

    window.addEventListener("scroll", handleScroll);

    const decayInterval = setInterval(() => {
      if (Math.abs(sp - bs) > 0.01) {
        sp += (bs - sp) * 0.05;
      }
    }, 30);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(decayInterval);
    };
  }, []);

  return (
    <section id="team" className="team-section">
      <div className="team-content">
        <div className="team-img-wrapper">
          <img src="https://raw.githubusercontent.com/VanhDc/starter-templates/main/anvil/images/team.jpg" alt="Anvil racing team" />
        </div>
        <div className="team-right">
          <div className="section-label">
            <div className="red-sq"></div>
            <span>The Organization</span>
          </div>
          <h3>Anvil Motorsport<br />Racing Division</h3>
          <p>Founded in 2018, Anvil Racing brings together 120+ engineers, aerodynamicists, data scientists, and two championship-caliber drivers — all united by an obsessive pursuit of speed.</p>
          <p>Our technical campus in Oxfordshire houses wind tunnels, simulation rigs, and one of the most advanced composite fabrication facilities in motorsport.</p>
          <a href="#cta" className="join-btn" style={{ marginTop: '24px' }}>
            <span>Join Us</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.16 4.4V3.5L8.5 3.5V7.84H7.6V5.03L4.13 8.5L3.5 7.87L6.97 4.4H4.16Z" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
      
      <div className="marquee-wrapper">
        <div className="marquee-track" ref={trackRef}>
          <div className="marquee-item">
            <span>14 Race Wins</span><span className="sep"></span>
            <span className="ghost">3 Championships</span><span className="sep"></span>
            <span>42 Podiums</span><span className="sep"></span>
            <span className="ghost">8 Pole Positions</span><span className="sep"></span>
            <span>1,020 HP</span><span className="sep"></span>
            <span className="ghost">120+ Engineers</span><span className="sep"></span>
            <span>0.003s Fastest Pit</span><span className="sep"></span>
          </div>
        </div>
      </div>
    </section>
  );
}