import React, { useState } from 'react';

export default function Header() {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleNightMode = () => {
    const newMode = !isNightMode;
    setIsNightMode(newMode);
    
    // The original script toggles opacity of .red-flow elements globally
    document.querySelectorAll(".red-flow").forEach(e => {
      e.style.opacity = newMode ? "1" : "0";
    });
  };

  return (
    <header className="header">
      <div className="header-left">
        <a href="#" className="header-logo">
          <div className="header-logo-mark">
            <iconify-icon icon="lucide:triangle" width="16"></iconify-icon>
          </div>
          ANVIL
        </a>
        <nav className="header-nav">
          <a href="#about">About Us</a>
          <a href="#values">Philosophy</a>
          <a href="#goal">Our Season</a>
          <a href="#faq">FAQ</a>
        </nav>
      </div>
      <div className="header-right">
        <div className="night-mode-btn" onClick={toggleNightMode}>
          <span>night mode</span>
          <div className="plus-wrap">
            <div className="plus-wrap-line plus-wrap-line-1"></div>
            <div 
              className="plus-wrap-line plus-wrap-line-2"
              style={{ transform: isNightMode ? "translateX(-50%) rotateZ(0deg)" : "translateX(-50%) rotateZ(90deg)" }}
            ></div>
          </div>
        </div>
        <a href="#cta" className="join-btn">
          <span>Apply Now</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.16 4.4V3.5L8.5 3.5V7.84H7.6V5.03L4.13 8.5L3.5 7.87L6.97 4.4H4.16Z" fill="currentColor" />
          </svg>
        </a>
      </div>
    </header>
  );
}