import React, { useEffect, useRef } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Goal() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const words = section.querySelectorAll('.goal-word');
    const crosshair = section.querySelector('.goal-crosshair');

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        words.forEach(w => {
          setTimeout(() => w.classList.add('visible'), +w.dataset.delay);
        });
        setTimeout(() => crosshair.classList.add('visible'), 500);
      },
      onLeaveBack: () => {
        words.forEach(w => w.classList.remove('visible'));
        crosshair.classList.remove('visible');
      }
    });

    return () => st.kill();
  }, []);

  return (
    <section id="goal" className="goal-section" ref={sectionRef}>
      <div className="goal-heading-block">
        <div className="goal-word" data-delay="0">Our</div>
        <div className="goal-word" data-delay="150">Singular</div>
        <div className="goal-word accent-word" data-delay="300">Target</div>
        
        <div className="goal-crosshair">
          <div className="goal-crosshair-line h"></div>
          <div className="goal-crosshair-line v"></div>
        </div>
        
        <div className="goal-sub">
          <div className="red-sq"></div>
          <span className="goal-sub-text">World Championship 2026 — Every point, every lap, every second counts.</span>
        </div>
      </div>
    </section>
  );
}