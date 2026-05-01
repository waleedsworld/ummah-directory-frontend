import React, { useState, useRef } from 'react';
import clsx from 'clsx';

const faqs = [
  {
    q: "What positions are currently open at Anvil Racing?",
    a: "We're actively recruiting aerodynamicists, race strategy engineers, composite technicians, and data analysts. Driver positions open through our junior academy program."
  },
  {
    q: "Where is the Anvil Racing headquarters?",
    a: "Our main technical campus is located in Oxfordshire, United Kingdom, with satellite offices for logistics near key circuits. The facility includes wind tunnels, simulation rooms, and our composite manufacturing center."
  },
  {
    q: "How does your driver development program work?",
    a: "The Anvil Junior Academy identifies talent from karting through Formula 4 and Formula 3. Selected drivers receive simulator access, engineering support, physical training, and mentorship from our senior drivers."
  },
  {
    q: "Can I visit the factory or attend a race as a guest?",
    a: "Factory tours are available for corporate partners and select fan events throughout the season. Race hospitality packages include paddock access, garage tours, and strategy briefings with our engineers."
  },
  {
    q: "What makes Anvil Racing different from other teams?",
    a: "Our vertical integration. We design, simulate, fabricate, and assemble everything in-house. This gives us an iterative speed that larger teams can't match — concept to track-tested component in days, not weeks."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="faq-wrapper">
        <div className="faq-header">
          <div className="section-label">
            <div className="red-sq"></div>
            <span>Questions</span>
          </div>
          <h2>FAQ</h2>
        </div>
        
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className={clsx("faq-item", openIndex === i && "open")}
            onClick={() => toggleFAQ(i)}
          >
            <div className="faq-question">
              <span>{faq.q}</span>
              <div className="faq-toggle"></div>
            </div>
            <div 
              className="faq-answer"
              style={{ maxHeight: openIndex === i ? `${contentRefs.current[i]?.scrollHeight}px` : '0px' }}
            >
              <div className="faq-answer-inner" ref={el => contentRefs.current[i] = el}>
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}