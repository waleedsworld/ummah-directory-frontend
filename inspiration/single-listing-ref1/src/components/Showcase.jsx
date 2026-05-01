import React, { useEffect, useRef } from 'react';

export default function Showcase() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const w = sectionRef.current;
    if (!w) return;
    
    const ch = w.querySelector('.showcase-crosshair');
    const ib = w.querySelectorAll('.showcase-info-block');
    let ia = false;

    const checkCrosshair = () => {
      const r = w.getBoundingClientRect();
      const c = window.innerHeight / 2;
      const ic = c >= r.top && c <= r.bottom;
      
      if (ic && !ia) {
        ia = true;
        ch.classList.add('visible');
        ib.forEach(b => {
          setTimeout(() => b.classList.add('visible'), 700 + (+b.dataset.delay || 0));
        });
      }
      
      if (!ic && ia) {
        ia = false;
        ch.classList.remove('visible');
        ib.forEach(b => b.classList.remove('visible'));
      }
    };

    window.addEventListener("scroll", checkCrosshair);
    window.addEventListener("resize", checkCrosshair);
    checkCrosshair();

    return () => {
      window.removeEventListener("scroll", checkCrosshair);
      window.removeEventListener("resize", checkCrosshair);
    };
  }, []);

  return (
    <section id="showcase" className="showcase-section" ref={sectionRef}>
      <div className="showcase-img">
        <img src="https://raw.githubusercontent.com/VanhDc/starter-templates/main/anvil/images/car.jpg" alt="Anvil racing car" />
      </div>
      
      <div className="showcase-crosshair">
        <div className="showcase-crosshair-line-h"></div>
        <div className="showcase-crosshair-line-v"></div>
      </div>
      
      <div className="showcase-overlay">
        <div className="showcase-info">
          <div className="showcase-info-block" data-delay="0">
            <div className="showcase-info-title">AN-26 Prototype</div>
            <div className="showcase-info-desc">Carbon fiber monocoque<br />Twin-turbo hybrid V6</div>
            <div className="showcase-info-num">01 / 02</div>
          </div>
          <div className="showcase-info-block" data-delay="400">
            <div className="showcase-info-title">Performance</div>
            <div className="showcase-info-desc">1,020 HP combined output<br />0–200 km/h in 4.2 seconds</div>
            <div className="showcase-info-num">02 / 02</div>
          </div>
        </div>
      </div>
    </section>
  );
}