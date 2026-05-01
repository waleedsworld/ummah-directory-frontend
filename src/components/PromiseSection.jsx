import React, { useEffect, useRef } from 'react';
import { listings, sourceMeta } from '../data/travelData';
import SafeImage from './SafeImage';

const revealCopy = 'Find Muslim-owned and Halal-friendly places across Australia. Food, mosques, services, tradies, events, and everyday help, all in one trusted directory.';
const revealPhrases = ['Search with purpose', 'Choose with confidence', 'Support the Ummah'];

const PromiseSection = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageListing = listings.find(item => item.image) || listings[0];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !textRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.35;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      textRef.current.style.clipPath = `inset(0 ${100 - (progress * 100)}% 0 0)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 50);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="flex flex-col lg:gap-y-24 bg-center bg-[#0B101A] w-full bg-[url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/09fd4820-ff21-47a8-b915-20b74cb1a37a_3840w.png')] bg-cover z-20 border-white/5 border-t pt-20 pb-24 relative scale-100 gap-y-16">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 w-full max-w-7xl mx-auto px-6 md:px-12 items-center">
        <div className="w-full lg:w-[45%] flex flex-col gap-8 pt-2 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#C8A96A]"></div>
            <span className="text-[#C8A96A] text-xs font-oswald uppercase tracking-widest">The Ummah Directory Promise</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white font-oswald uppercase">
            Support the <span className="text-[#C8A96A]">Ummah</span> through local commerce
          </h2>

          <p className="text-sm md:text-base leading-relaxed font-light text-white/70 text-left">
            Ummah Directory helps Muslim consumers find Muslim-owned and Halal-friendly businesses across Australia, from food and mosques to tradies, education, medical providers, charities, events, clothing, and professional services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a href="/search" className="bg-[#C8A96A] text-[#1F3E3D] px-8 py-3.5 text-sm font-medium rounded-sm w-fit hover:bg-white transition-all duration-300 shadow-[0_4px_14px_rgba(200,169,106,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5">
              Search Directory
            </a>
            <a href="/about" className="bg-transparent border border-white/20 text-white px-8 py-3.5 text-sm font-medium rounded-sm w-fit hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all duration-300">
              Read Mission
            </a>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4 border-t border-white/10 pt-8">
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-oswald text-[#C8A96A]">{sourceMeta.totalListings}</span>
              <span className="text-xs text-white/50 uppercase tracking-widest font-light">Business Listings</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-oswald text-[#C8A96A]">{sourceMeta.totalCategories}</span>
              <span className="text-xs text-white/50 uppercase tracking-widest font-light">Directory Categories</span>
            </div>
          </div>
        </div>

        <div className="lg:w-[55%] md:h-[60vh] lg:h-[70vh] overflow-hidden shrink-0 group w-full h-[50vh] rounded-3xl relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1F3E3D]/50 via-transparent to-black/20 z-10 pointer-events-none transition-colors duration-700 group-hover:from-transparent"></div>
          <div className="absolute inset-0 border border-white/10 z-20 pointer-events-none rounded-sm"></div>
          <SafeImage src={imageListing.image} alt={imageListing.title} className="object-center group-hover:scale-105 transition-transform duration-[2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] w-full h-full object-cover ring-teal-50 rounded-3xl" />

          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 bg-[#0B101A]/80 backdrop-blur-md border border-[#C8A96A]/30 p-5 rounded-sm max-w-[240px] shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <div className="flex items-center gap-2 mb-2">
              <iconify-icon icon="lucide:map-pin" class="w-4 h-4 text-[#C8A96A]"></iconify-icon>
              <span className="text-xs font-oswald tracking-widest uppercase text-white">{imageListing.region}</span>
            </div>
            <p className="text-[11px] text-white/70 font-light leading-relaxed">{imageListing.title} · {imageListing.location}</p>
          </div>
        </div>
      </div>

      <div className="md:px-12 flex flex-col w-full max-w-7xl mt-8 mr-auto ml-auto pr-6 pl-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full border-b border-white/10 pb-6 gap-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight text-white tracking-tight font-oswald uppercase">
            Commerce, integrity, connection
          </h2>
          <div className="flex items-center gap-2 text-[#C8A96A] text-sm font-light">
            <span>Scroll to reveal</span>
            <iconify-icon icon="lucide:arrow-down" class="w-4 h-4 animate-bounce"></iconify-icon>
          </div>
        </div>

        <div className="w-full relative mt-8 pb-4" ref={containerRef}>
          <div className="flex flex-wrap gap-x-5 gap-y-3 mb-8">
            {revealPhrases.map(phrase => (
              <span key={phrase} className="border border-white/15 px-4 py-2 text-xs md:text-sm uppercase tracking-[0.22em] text-white/72 font-oswald">
                {phrase}
              </span>
            ))}
          </div>
          <div className="relative">
            <div className="max-w-5xl text-4xl md:text-6xl lg:text-7xl leading-[0.98] font-light text-white/12 tracking-tight text-left">
              {revealCopy}
            </div>
            <div
              ref={textRef}
              className="absolute inset-0 max-w-5xl text-4xl md:text-6xl lg:text-7xl leading-[0.98] text-[#C8A96A] tracking-tight font-light text-left will-change-[clip-path]"
              style={{ clipPath: 'inset(0px 100% 0px 0px)' }}
            >
              {revealCopy}
              <span className="inline-block ml-2 h-[0.82em] w-[3px] translate-y-[0.08em] bg-[#C8A96A] shadow-[0_0_18px_rgba(200,169,106,0.55)] animate-pulse" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromiseSection;
