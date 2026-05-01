import React, { useEffect, useRef, useState } from 'react';
import GridOverlay from './GridOverlay';

export default function Hero() {
  const trackingRef = useRef(null);
  const cursorRef = useRef(null);
  const [coords, setCoords] = useState({ x: '0000', y: '0000' });

  useEffect(() => {
    const area = trackingRef.current;
    const cursor = cursorRef.current;
    if (!area || !cursor) return;

    const handleMouseMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      setCoords({
        x: String(e.clientX).padStart(4, '0'),
        y: String(e.clientY).padStart(4, '0')
      });
    };

    const handleEnter = () => cursor.style.opacity = '1';
    const handleLeave = () => cursor.style.opacity = '0';

    area.addEventListener('mousemove', handleMouseMove);
    area.addEventListener('mouseenter', handleEnter);
    area.addEventListener('mouseleave', handleLeave);

    return () => {
      area.removeEventListener('mousemove', handleMouseMove);
      area.removeEventListener('mouseenter', handleEnter);
      area.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="hero-bg">
        <img src="https://raw.githubusercontent.com/VanhDc/starter-templates/main/anvil/images/hero.jpg" alt="Racing car on track" />
      </div>
      
      <div className="tracking-area" ref={trackingRef}>
        <div className="custom-cursor" ref={cursorRef}>
          <div className="line-vertical"></div>
          <div className="line-horizontal"></div>
          <div className="cursor-dot"></div>
          <div className="coords">
            <div className="coord-x">X: <span className="coords-x-val">{coords.x}</span></div>
            <div className="coord-y">Y: <span className="coords-y-val">{coords.y}</span></div>
          </div>
        </div>
      </div>

      <div className="hero-wrapper">
        <div className="hero-bottom">
          <div className="hero-left">
            <div className="hero-label">
              <div className="red-sq"></div>
              <span className="hero-label-text">Championship Motorsport Team</span>
            </div>
            <div className="hero-heading-wrapper">
              <h1 className="hero-heading">Forged In</h1>
            </div>
            <div className="hero-heading-wrapper">
              <h1 className="hero-heading accent">
                <svg className="hero-heading-icon" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L44 40H4L24 4Z" fill="#F90000" />
                </svg>
                Speed
              </h1>
            </div>
          </div>
          <div className="hero-right">
            <div className="scroll-indicator">
              <span>++</span>
              <span>scroll</span>
            </div>
          </div>
        </div>
      </div>
      
      <GridOverlay id="hero-grid" triggerSelector="#hero" />
    </section>
  );
}