import React, { useEffect, useState } from 'react';
import GridOverlay from './GridOverlay';

export default function Footer() {
  const [timeStr, setTimeStr] = useState('');
  
  useEffect(() => {
    function updateClock() {
      const n = new Date();
      const ds = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const d = ds[n.getDay()];
      const h = String(n.getHours()).padStart(2, '0');
      const m = String(n.getMinutes()).padStart(2, '0');
      const s = String(n.getSeconds()).padStart(2, '0');
      const tz = -(n.getTimezoneOffset() / 60);
      const sg = tz >= 0 ? '+' : '';
      setTimeStr(`${d} ${h}:${m}:${s} (GMT${sg}${tz})`);
    }
    
    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer className="footer">
      <GridOverlay id="footer-grid" triggerSelector=".footer" isFooter={true} />
      
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-logo">ANVIL</div>
          <div className="footer-links">
            <div className="footer-link-group">
              <h4>Contact</h4>
              <a href="#">info@anvilracing.com</a>
              <a href="#">careers@anvilracing.com</a>
            </div>
            <div className="footer-link-group">
              <h4>Partnerships</h4>
              <a href="#">Sponsorship</a>
              <a href="#">Technical Partners</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-text">
            © {new Date().getFullYear()} ANVIL RACING. All rights reserved.
          </div>
          <div className="footer-socials">
            <a href="#" className="footer-social">
              Instagram 
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.16 4.4V3.5L8.5 3.5V7.84H7.6V5.03L4.13 8.5L3.5 7.87L6.97 4.4H4.16Z" fill="currentColor" />
              </svg>
            </a>
            <a href="#" className="footer-social">
              YouTube 
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.16 4.4V3.5L8.5 3.5V7.84H7.6V5.03L4.13 8.5L3.5 7.87L6.97 4.4H4.16Z" fill="currentColor" />
              </svg>
            </a>
          </div>
          <div className="footer-clock" id="footer-clock">
            {timeStr}
          </div>
        </div>
      </div>
    </footer>
  );
}