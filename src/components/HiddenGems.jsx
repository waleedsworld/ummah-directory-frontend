import React, { useEffect, useRef } from 'react';
import { listings } from '../data/travelData';
import { FALLBACK_IMAGE } from './SafeImage';

const HiddenGems = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let isTicking = false;

    const updateScroll = () => {
      if (sectionRef.current && containerRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalScroll = rect.height - windowHeight;
        let progress = -rect.top / totalScroll;
        progress = Math.max(0, Math.min(1, progress));

        const padding = window.innerWidth >= 768 ? 96 : 48;
        const maxTranslate = Math.max(0, containerRef.current.scrollWidth - window.innerWidth + padding);
        containerRef.current.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;
      }
      isTicking = false;
    };

    const handleScrollOrResize = () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateScroll);
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    setTimeout(updateScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  const gems = listings;

  return (
    <div className="relative z-20 text-black bg-[#F4F4F5] w-full" style={{ height: '500vh' }} id="hidden-gems-section" ref={sectionRef}>
      <div className="sticky flex flex-col overflow-hidden w-full h-screen top-0 justify-center" style={{ paddingTop: 'clamp(3rem, 8vh, 6rem)', paddingBottom: 'clamp(2rem, 5vh, 4rem)' }}>
        <main className="flex flex-col w-full" style={{ gap: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
          <div className="flex flex-col md:flex-row md:items-end md:pr-12 md:pl-12 shrink-0 pr-6 pl-6 items-start justify-between gap-4 md:gap-0">
            <div className="md:w-72 lg:w-80 leading-relaxed order-2 md:order-1 hidden sm:block text-xs font-light text-[#1F3E3D]/70 w-full">
              Browse highlighted businesses and community services from across the directory, from Halal food to mosques, trades, schools, charities, events, and professional services.
            </div>
            <h2 className="leading-[0.95] order-1 uppercase md:order-2 md:w-3/5 text-[#1F3E3D] tracking-tight font-oswald" style={{ fontSize: 'clamp(2rem, 6vw, 7rem)' }}>
              Highlighted Directory<br className="hidden md:block" /> Listings For<br className="hidden md:block" /> The Community
            </h2>
            <div className="hidden md:block text-xs uppercase tracking-widest text-[#1F3E3D]/40 order-3 mb-1 whitespace-nowrap">
              Scroll to explore
            </div>
          </div>

          <div className="flex will-change-transform pl-6 md:pl-12" style={{ gap: 'clamp(0.75rem, 1.5vw, 1.25rem)', paddingRight: '1.5rem', paddingBottom: '1rem', width: 'max-content' }} id="horizontal-scroll-container" ref={containerRef}>
            {gems.map((gem, index) => (
              <a key={gem.slug} href={`/listing/${gem.slug}`} style={{ width: 'clamp(200px, 55vw, 300px)', height: 'clamp(320px, 45vh, 480px)', flexShrink: 0 }} aria-label={`Open ${gem.title}`} className="relative block rounded-2xl overflow-hidden group cursor-pointer border border-black/5 shadow-xl bg-[#1A1A1A]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" style={{ backgroundImage: `url('${gem.image || FALLBACK_IMAGE}'), url('${FALLBACK_IMAGE}')` }}></div>
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-90"></div>
                
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-normal uppercase tracking-widest text-white/90 shadow-sm">{gem.region}</div>
                </div>
                {gem.approvalBadge && (
                  <div className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#C8A96A]/70 bg-black/42 text-[#C8A96A] backdrop-blur-md" aria-label={`${gem.approvalBadge} approved listing`}>
                    <iconify-icon icon="lucide:badge-check" class="h-4 w-4"></iconify-icon>
                  </div>
                )}
                
                <div className={`absolute ${gem.approvalBadge ? 'right-4 top-14' : 'right-4 top-4'} z-20 translate-x-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100`}>
                  <span className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 transition-all pointer-events-none">
                    <iconify-icon icon="lucide:heart" class="w-3.5 h-3.5"></iconify-icon>
                  </span>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="flex justify-between items-end transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[44px]">
                    <div className="flex flex-col gap-1">
                      <div className="text-white text-base font-normal tracking-tight drop-shadow-sm">{gem.title}</div>
                      <div className="flex items-center gap-1 text-white/70 text-xs font-light">
                        <iconify-icon icon="lucide:map-pin" class="w-3 h-3"></iconify-icon>
                        {gem.location}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="text-white/50 text-[9px] uppercase tracking-widest font-normal">Category</div>
                      <div className="text-white text-sm font-normal tracking-tight drop-shadow-sm">{gem.price}</div>
                    </div>
                  </div>
                  <div className="absolute left-0 right-0 bottom-0 translate-y-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="w-full bg-white text-[#1F3E3D] py-2.5 rounded-xl text-xs font-normal flex items-center justify-center gap-1.5 group-hover:bg-[#C8A96A] transition-colors shadow-lg pointer-events-none">
                      View Listing Details
                      <iconify-icon icon="lucide:arrow-right" class="w-3 h-3"></iconify-icon>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HiddenGems;
