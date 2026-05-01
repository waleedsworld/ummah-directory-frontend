import React, { useEffect, useRef, useState } from 'react';

export default function Preloader() {
  const preloaderRef = useRef(null);
  const imgBlockRef = useRef(null);
  const percentRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const st = performance.now();
    const dur = 2500;
    const imgD = 1900;
    const pctD = 1900;
    let rafId;

    function anim(now) {
      if (!preloaderRef.current || !imgBlockRef.current || !percentRef.current) return;
      
      const el = now - st;
      const t = Math.min(el / dur, 1);
      
      preloaderRef.current.style.backdropFilter = `blur(${30 * (1 - t)}px)`;
      
      if (el >= 2000) {
        const f = (el - 2000) / 500;
        preloaderRef.current.style.opacity = String(1 - Math.min(f, 1));
      }
      
      if (el <= imgD) {
        imgBlockRef.current.style.transform = `translateY(${-75 * (el / imgD)}%)`;
      } else {
        imgBlockRef.current.style.transform = 'translateY(-75%)';
      }
      
      if (el <= pctD) {
        percentRef.current.textContent = Math.round((el / pctD) * 100);
      } else {
        percentRef.current.textContent = '100';
      }
      
      if (el < dur) {
        rafId = requestAnimationFrame(anim);
      } else {
        setVisible(false);
        document.documentElement.style.removeProperty('overflow');
      }
    }
    
    rafId = requestAnimationFrame(anim);

    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader-icon">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L44 40H4L24 4Z" stroke="#F90000" strokeWidth="2" fill="none" />
          <path d="M24 16L32 32H16L24 16Z" fill="#F90000" />
        </svg>
      </div>
      <div className="preloader-img-block" ref={imgBlockRef}>
        {[1, 2].map((i) => (
          <svg key={i} width="40" height="800" viewBox="0 0 40 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="0" x2="20" y2="800" stroke="rgba(238,242,249,0.1)" strokeWidth="1" />
            <g fill="rgba(238,242,249,0.15)">
              {Array.from({ length: 20 }).map((_, j) => (
                <rect key={j} x="16" y={j * 40} width="8" height="1" />
              ))}
            </g>
          </svg>
        ))}
      </div>
      <div className="preloader-percent">
        <span ref={percentRef}>0</span> %
      </div>
      <div className="shadow-top"></div>
      <div className="shadow-bot"></div>
    </div>
  );
}