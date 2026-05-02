import React, { useEffect, useRef, useState } from 'react';
import { categories } from '../data/travelData';
import SafeImage from './SafeImage';

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const smoothstep = value => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

const Hero = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const trackRef = useRef(null);
  const sceneRef = useRef(null);
  const doorPanelRef = useRef(null);
  const uiLayerRef = useRef(null);
  const portalContentRef = useRef(null);
  const portalGlowRef = useRef(null);
  const whiteoutRef = useRef(null);

  useEffect(() => {
    let animationFrameId = 0;
    let lastProgress = -1;

    const viewportHeight = () => window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight;
    const measureProgress = () => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - viewportHeight());
      return clamp(-rect.top / scrollable);
    };

    const renderAnimation = () => {
      animationFrameId = 0;
      const progress = measureProgress();
      if (Math.abs(progress - lastProgress) < 0.001) return;
      lastProgress = progress;

      const isMobile = window.innerWidth < 768;
      const zoomProgress = smoothstep(progress);
      const doorProgress = smoothstep((progress - 0.08) / 0.48);
      const revealProgress = smoothstep((progress - 0.12) / 0.34);
      const exitProgress = smoothstep((progress - 0.7) / 0.28);

      if (sceneRef.current) {
        const scale = 1 + zoomProgress * (isMobile ? 8.5 : 14);
        const translateY = zoomProgress * (isMobile ? 5 : 8);
        sceneRef.current.style.transform = `scale(${scale.toFixed(3)}) translate3d(0, ${translateY.toFixed(2)}%, 0)`;
      }

      if (doorPanelRef.current) {
        const angle = -(doorProgress * (isMobile ? 94 : 108));
        doorPanelRef.current.style.transform = `rotateY(${angle.toFixed(2)}deg) translateZ(2px)`;
      }

      if (portalContentRef.current && portalGlowRef.current) {
        portalContentRef.current.style.opacity = revealProgress.toFixed(3);
        portalGlowRef.current.style.opacity = Math.min(1, revealProgress * 1.15).toFixed(3);
      }

      if (uiLayerRef.current) {
        const uiHide = smoothstep(progress / 0.32);
        uiLayerRef.current.style.opacity = (1 - uiHide).toFixed(3);
        uiLayerRef.current.style.transform = `translate3d(0, ${(-44 * uiHide).toFixed(2)}px, 0)`;
      }

      if (whiteoutRef.current) {
        whiteoutRef.current.style.opacity = exitProgress.toFixed(3);
      }
    };

    const requestRender = () => {
      if (!animationFrameId) animationFrameId = requestAnimationFrame(renderAnimation);
    };
    const requestResizeRender = () => {
      lastProgress = -1;
      requestRender();
    };

    requestRender();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestResizeRender, { passive: true });
    window.visualViewport?.addEventListener('resize', requestResizeRender, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestResizeRender);
      window.visualViewport?.removeEventListener('resize', requestResizeRender);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <div className="z-10 bg-[#0B101A] w-full h-[205svh] md:h-[245vh] relative" id="scroll-track" ref={trackRef}>
      <div className="sticky overflow-hidden [perspective:1200px] w-full h-[100svh] top-0 right-0 bottom-0 left-0 md:h-screen">
        
        {/* 3D Scene Wrapper */}
        <div 
          className="flex [transform-style:preserve-3d] will-change-transform origin-[50%_55%] bg-center bg-cyan-950 opacity-100 absolute top-0 right-0 bottom-0 left-0 items-center justify-center" 
          id="scene-container"
          ref={sceneRef}
        >
          {/* Background Image Container */}
          <div className="pointer-events-none z-0 absolute top-0 right-0 bottom-0 left-0">
            <SafeImage
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1fb0d000-28e3-4a63-9571-a768c099c566_3840w.png"
              alt="Background Environment"
              className="opacity-60 mix-blend-overlay w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              data-critical-image="true"
            />
          </div>

          {/* Nature's Greenery Surface */}
          <div className="origin-top [transform:rotateX(80deg)_translateZ(-100px)] bg-gradient-to-b from-[#52525B]/95 to-[#18181B] w-[200%] h-[100%] border-[#A1A1AA]/30 border-t absolute top-[60%] left-[-50%] drop-shadow-2xl backdrop-blur-md">
            <div className="bg-center opacity-100 mix-blend-soft-light bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/05b11cf5-028b-41dd-9248-8b56e028f570_3840w.png)] bg-contain absolute top-0 right-0 bottom-0 left-0 shadow-2xl translate-y-4"></div>
          </div>

          {/* The Door Asset */}
          <div className="sm:w-[320px] sm:h-[560px] [transform-style:preserve-3d] group xs:w-[260px] xs:h-[460px] -translate-y-2 sm:-translate-y-12 w-[210px] h-[380px] relative md:-translate-y-8">
            
            {/* Original Aura portal visual */}
            <div 
              className="bg-center will-change-[opacity] opacity-25 bg-cover rounded-t-[144px] absolute top-[8px] right-[8px] bottom-[8px] left-[8px]" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1968&auto=format&fit=crop')" }} 
              id="portal-content"
              ref={portalContentRef}
            >
              <div className="bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-t-[144px] absolute top-0 right-0 bottom-0 left-0"></div>
              <div className="bg-[#86A873]/30 opacity-0 mix-blend-screen rounded-t-[144px] absolute top-0 right-0 bottom-0 left-0 blur-xl" id="portal-glow" ref={portalGlowRef}></div>
            </div>

            {/* Realistic Stone Door Frame */}
            <div className="border-[16px] [transform:translateZ(1px)] bg-transparent border-[#EAE6DF] rounded-t-[160px] absolute top-0 right-0 bottom-0 left-0">
              <div className="absolute inset-0 border border-[#C8C3B8] rounded-t-[144px] rounded-b-sm pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] rounded-t-[144px] rounded-b-sm pointer-events-none"></div>
            </div>

            {/* Realistic Wood Door Panel */}
            <div 
              className="sm:inset-[12px] origin-left will-change-transform [transform:translateZ(2px)] flex flex-row z-20 overflow-hidden bg-[#4A3018] border-[#2D1B0E] border rounded-t-[148px] absolute top-[8px] right-[8px] bottom-[8px] left-[8px] shadow-[10px_0_20px_rgba(0,0,0,0.5)]"
              id="door-panel"
              ref={doorPanelRef}
            >
              {/* Wood Planks */}
              <div className="flex-1 border-r border-[#2D1B0E] shadow-[inset_-2px_0_10px_rgba(0,0,0,0.3)] bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
              <div className="flex-1 bg-gradient-to-b from-transparent via-black/5 to-black/20 border-[#2D1B0E] border-r shadow-[inset_-2px_0_10px_rgba(0,0,0,0.3)]"></div>
              <div className="flex-1 border-r border-[#2D1B0E] shadow-[inset_-2px_0_10px_rgba(0,0,0,0.3)] bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
              <div className="flex-1 border-r border-[#2D1B0E] shadow-[inset_-2px_0_10px_rgba(0,0,0,0.3)] bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
              <div className="flex-1 shadow-[inset_-2px_0_10px_rgba(0,0,0,0.3)] bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>

              {/* Iron Crossbars */}
              <div className="absolute top-[25%] left-0 w-full h-5 bg-[#1A1A1A] shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex justify-around items-center px-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#333] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"></div>
              </div>
              <div className="absolute bottom-[25%] left-0 w-full h-5 bg-[#1A1A1A] shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex justify-around items-center px-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#333] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]"></div>
              </div>

              {/* Realistic Iron Ring Door Handle */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 border-[5px] border-[#1A1A1A] rounded-full shadow-[2px_2px_6px_rgba(0,0,0,0.6)] flex items-center justify-center [transform-style:preserve-3d]">
                <div className="absolute left-[-12px] w-5 h-6 bg-[#1A1A1A] rounded-sm [transform:translateZ(-1px)] shadow-md flex flex-col justify-around py-1">
                  <div className="w-2 h-1 bg-[#333] mx-auto rounded-full"></div>
                  <div className="w-2 h-1 bg-[#333] mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UI Overlay Layer */}
        <div className="z-50 pointer-events-none flex flex-col md:p-12 will-change-[opacity,transform] p-4 sm:p-6 absolute top-0 right-0 bottom-0 left-0 justify-between" id="ui-layer" ref={uiLayerRef}>
          
          <header className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] pointer-events-auto gap-2 sm:gap-4 text-white w-full relative items-center">
            {/* Left: Logo */}
            <a href="/" className="justify-self-start flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:opacity-100 focus:outline-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center group-hover:bg-[#C8A96A]/10 group-hover:scale-110 group-hover:border-[#C8A96A]/50 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_20px_rgba(200,169,106,0.4)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#C8A96A]/0 via-[#C8A96A]/20 to-[#C8A96A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                <iconify-icon icon="lucide:plane-takeoff" class="w-4 h-4 text-white group-hover:text-[#C8A96A] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-500"></iconify-icon>
              </div>
              <div className="flex flex-col text-[10px] sm:text-[11px] uppercase tracking-[0.2em] leading-tight font-light">
                <span className="text-white group-hover:text-[#C8A96A] transition-colors duration-300">Ummah Directory</span>
                <span className="text-white/60 group-hover:text-white transition-colors duration-300">Directory</span>
              </div>
            </a>

            {/* Center: Search */}
            <div className="hidden md:flex justify-self-center items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md p-1 px-5 gap-5 shadow-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 group/search">
              <button
                type="button"
                onClick={() => setSearchOpen(current => !current)}
                className="text-white/70 hover:text-[#C8A96A] transition-all duration-200 focus:outline-none flex items-center gap-2"
                aria-label="Open directory search"
                aria-expanded={searchOpen}
              >
                <iconify-icon icon="lucide:map-pin" class="w-4 h-4"></iconify-icon>
                <span className="w-28 text-left text-xs text-white/55">Search directory</span>
              </button>
              <div className="h-3 w-px bg-white/20 group-hover/search:bg-white/40 transition-colors duration-500"></div>
              <a href="/profile" className="text-white/70 hover:text-[#C8A96A] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none flex items-center justify-center group" aria-label="Visited activity">
                <iconify-icon icon="lucide:calendar" class="w-4 h-4 group-hover:rotate-3 transition-transform duration-300"></iconify-icon>
              </a>
              <div className="h-3 w-px bg-white/20 group-hover/search:bg-white/40 transition-colors duration-500"></div>
              <a href="/profile" className="text-white/70 hover:text-[#C8A96A] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none flex items-center justify-center group" aria-label="Profile">
                <iconify-icon icon="lucide:users" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300"></iconify-icon>
              </a>
              <div className="h-3 w-px bg-white/20 group-hover/search:bg-white/40 transition-colors duration-500"></div>
              <button
                className="bg-[#C8A96A] text-[#1F3E3D] p-1.5 rounded-full hover:bg-white active:scale-95 transition-all duration-200 focus:outline-none"
                aria-label="Open search"
                type="button"
                onClick={() => setSearchOpen(current => !current)}
              >
                <iconify-icon icon="lucide:search" class="w-3.5 h-3.5"></iconify-icon>
              </button>
            </div>

            {/* Right: Navigation */}
            <div className="justify-self-end flex items-center gap-2 sm:gap-4 lg:gap-8">
              <nav className="hidden lg:flex items-center gap-6">
                <div className="relative group">
                  <button className="flex items-center gap-1.5 text-[11px] font-light uppercase tracking-widest text-white/80 hover:text-white transition-colors py-2 focus:outline-none relative after:absolute after:bottom-1 after:left-0 after:w-full after:h-px after:bg-[#C8A96A] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right group-hover:after:origin-left">
                    Categories
                    <iconify-icon icon="lucide:chevron-down" class="w-3 h-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"></iconify-icon>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B101A]/95 backdrop-blur-md border border-white/10 rounded-sm py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 shadow-2xl z-50">
                    <a href="/category/food-and-beverage" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-6 transition-all duration-300">Food & Beverage</a>
                    <a href="/category/mosques-and-prayer-rooms" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-6 transition-all duration-300">Mosques</a>
                    <a href="/category/education" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-6 transition-all duration-300">Education</a>
                    <a href="/category/medical" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-6 transition-all duration-300">Medical</a>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center gap-1.5 text-[11px] font-light uppercase tracking-widest text-white/80 hover:text-white transition-colors py-2 focus:outline-none relative after:absolute after:bottom-1 after:left-0 after:w-full after:h-px after:bg-[#C8A96A] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right group-hover:after:origin-left">
                    Listings
                    <iconify-icon icon="lucide:chevron-down" class="w-3 h-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"></iconify-icon>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B101A]/95 backdrop-blur-md border border-white/10 rounded-sm py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 shadow-2xl z-50">
                    <a href="/search" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-6 transition-all duration-300">Search</a>
                    <a href="/add-listing" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-6 transition-all duration-300">Add listing</a>
                    <a href="/manage-listings" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-6 transition-all duration-300">Manage listings</a>
                    <a href="/category/trades-and-construction" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-6 transition-all duration-300">Trades</a>
                  </div>
                </div>
              </nav>

              <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 lg:border-l lg:border-white/20 lg:pl-5">
                <div className="relative group hidden sm:block">
                  <button className="flex items-center gap-1.5 text-[11px] font-light uppercase tracking-widest text-white/80 hover:text-white transition-colors py-2 focus:outline-none group-hover:text-white">
                    EN
                    <iconify-icon icon="lucide:globe" class="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300"></iconify-icon>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-32 bg-[#0B101A]/95 backdrop-blur-md border border-white/10 rounded-sm py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 shadow-2xl z-50">
                    <a href="#" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-[#C8A96A] bg-white/5 border-l-2 border-[#C8A96A]">English</a>
                    <a href="#" className="block px-4 py-2.5 text-[11px] font-light uppercase tracking-widest text-white/70 hover:text-[#C8A96A] hover:bg-white/5 hover:pl-5 transition-all duration-300 border-l-2 border-transparent hover:border-[#C8A96A]/50">Español</a>
                  </div>
                </div>

                <a href="/about" className="hidden sm:block text-[11px] font-light uppercase tracking-widest text-white/80 hover:text-white transition-all duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-[#C8A96A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:-translate-y-0.5">About</a>
                <a href="/add-listing" className="hidden sm:block text-[11px] font-light uppercase tracking-widest text-white/80 hover:text-white transition-all duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-[#C8A96A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:-translate-y-0.5">Add Listing</a>
                <a href="/manage-listings" className="hidden xl:block text-[11px] font-light uppercase tracking-widest text-white/80 hover:text-white transition-all duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-[#C8A96A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:-translate-y-0.5">Manage</a>

                <button className="lg:hidden text-white/80 hover:text-[#C8A96A] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none">
                  <iconify-icon icon="lucide:menu" class="w-5 h-5"></iconify-icon>
                </button>
              </div>
            </div>
            {searchOpen && (
              <div className="pointer-events-auto absolute left-1/2 top-16 z-[70] hidden w-[min(560px,calc(100vw-32px))] -translate-x-1/2 border border-white/18 bg-[#0B101A]/96 text-white shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-md md:block">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="text-sm font-medium text-white">Quick search</div>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-white/55 transition-colors hover:text-white"
                    aria-label="Close search"
                  >
                    <iconify-icon icon="lucide:x" class="h-4 w-4"></iconify-icon>
                  </button>
                </div>
                <form action="/search" method="get" className="flex border-b border-white/10">
                  <label className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-white/70" aria-label="Search location or service">
                    <iconify-icon icon="lucide:search" class="h-4 w-4 shrink-0 text-[#C8A96A]"></iconify-icon>
                    <input
                      autoFocus
                      name="q"
                      className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/46"
                      placeholder="Try halal food, barber, mosque, suburb..."
                    />
                  </label>
                  <button type="submit" className="bg-[#C8A96A] px-5 text-sm font-medium text-[#1F3E3D] transition-colors hover:bg-white">
                    Search
                  </button>
                </form>
                <div className="grid gap-px bg-white/10 sm:grid-cols-3">
                  {[
                    ['Halal food Melbourne', 'halal food Melbourne'],
                    ['Barber Coburg', 'barber Coburg'],
                    ['Mosque Preston', 'mosque Preston'],
                  ].map(([label, query]) => (
                    <a
                      key={query}
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="bg-[#0B101A]/94 px-4 py-3 text-xs uppercase tracking-[0.14em] text-white/70 transition-colors hover:bg-white/8 hover:text-[#C8A96A]"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Hero Title */}
          <div className="pointer-events-auto max-w-2xl absolute left-4 sm:left-6 md:left-24" style={{ top: 'clamp(7rem, 18svh, 11rem)' }}>
            <h1 className="leading-[1.1] sm:text-4xl md:text-6xl text-3xl font-normal text-white tracking-tight drop-shadow-md">
              Beyond this <span className="font-light italic">Door</span> lies<br />Ummah Directory
            </h1>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col xl:flex-row pointer-events-auto text-white w-full gap-x-12 gap-y-6 sm:gap-y-8 items-end justify-between" style={{ paddingBottom: 'clamp(1rem, 4vh, 4rem)' }}>
            <div className="flex flex-col sm:gap-6 shrink-0 sm:pb-4 max-w-md pb-2 translate-y-4 gap-x-4 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#C8A96A]"></div>
                <span className="text-[#C8A96A] text-xs font-oswald uppercase tracking-widest">Ummah Directory Highlights</span>
              </div>
              <p className="text-base md:text-xl text-white/90 leading-relaxed drop-shadow-sm font-light hidden sm:block">
                Find Muslim-owned and Halal-friendly businesses across food, mosques, trades, education, health, events, clothing, and professional services.
              </p>
              <button type="button" onClick={() => setSearchOpen(true)} className="bg-[#C8A96A] text-[#1F3E3D] px-6 sm:px-8 py-3 sm:py-4 rounded-sm text-sm font-medium hover:bg-white hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] transition-all duration-300 w-max shadow-lg flex items-center gap-3 group">
                Search Directory
                <iconify-icon icon="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></iconify-icon>
              </button>
              {searchOpen && (
                <div className="w-[min(92vw,440px)] border border-white/18 bg-[#0B101A]/82 backdrop-blur-sm md:hidden">
                  <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                    <span className="text-sm font-medium">Quick search</span>
                    <button type="button" onClick={() => setSearchOpen(false)} className="text-white/58" aria-label="Close search">
                      <iconify-icon icon="lucide:x" class="h-4 w-4"></iconify-icon>
                    </button>
                  </div>
                  <form action="/search" method="get" className="flex">
                    <input
                      autoFocus
                      name="q"
                      className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/45"
                      placeholder="Search food, mosque, barber..."
                    />
                    <button type="submit" className="bg-[#C8A96A] px-4 text-sm font-medium text-[#1F3E3D]">
                      Search
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="flex xl:w-[700px] overflow-x-auto hide-scrollbar gap-4 sm:gap-6 snap-x snap-mandatory -mx-2 w-full pt-2 sm:pt-4 pr-2 pb-2 sm:pb-4 pl-2">
              {categories.map((card) => (
                <a key={card.slug} href={`/category/${card.slug}`} className="snap-start shrink-0 w-[200px] sm:w-[260px] md:w-[300px] h-[160px] sm:h-[190px] md:h-[220px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-2xl border border-white/10">
                  <SafeImage src={card.image} className="transition-transform duration-[1.5s] ease-out group-hover:scale-110 w-full h-full object-cover" alt={card.title} />
                  <div className="group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#1F3E3D]/90 via-[#1F3E3D]/20 to-transparent opacity-80 absolute top-0 right-0 bottom-0 left-0"></div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/40 backdrop-blur-md rounded-full p-2 border border-white/10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <iconify-icon icon="lucide:arrow-right" class="w-4 h-4 text-white"></iconify-icon>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-xl sm:text-2xl font-oswald uppercase tracking-tight text-white mb-1 sm:mb-2">{card.title}</h3>
                    <p className="text-xs sm:text-sm text-white/70 font-light mb-3 sm:mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden sm:block">
                      {card.description}
                    </p>
                    <div className="flex items-center gap-2 text-[#C8A96A] text-xs font-oswald tracking-widest uppercase">
                      <span>Discover</span>
                      <div className="h-px w-4 bg-[#C8A96A] group-hover:w-8 transition-all duration-500"></div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Transition Layer */}
        <div className="pointer-events-none z-[100] will-change-[opacity] bg-[#F4F4F5] opacity-0 absolute top-0 right-0 bottom-0 left-0" id="whiteout" ref={whiteoutRef}></div>
      </div>
    </div>
  );
};

export default Hero;
