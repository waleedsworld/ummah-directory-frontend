import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Values from './components/Values';
import Stats from './components/Stats';
import Goal from './components/Goal';
import Showcase from './components/Showcase';
import Team from './components/Team';
import CTA from './components/CTA';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Prevent scroll until preloader hides, handled in CSS initially but ensure Lenis is smooth
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    history.scrollRestoration = 'manual';

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initial GSAP reveals
    let ctx = gsap.context(() => {
      gsap.from('.about-heading-sm', { scrollTrigger: { trigger: '.about-section', start: 'top 70%' }, y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' });
      gsap.from('.about-heading-lg', { scrollTrigger: { trigger: '.about-section', start: 'top 65%' }, y: 60, opacity: 0, duration: 1, ease: 'power2.out', delay: 0.2 });
      gsap.from('.about-text', { scrollTrigger: { trigger: '.about-section', start: 'top 55%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 });
      gsap.from('.about-stats > div', { scrollTrigger: { trigger: '.about-stats', start: 'top 80%' }, y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' });
      gsap.from('.values-card', { scrollTrigger: { trigger: '.values-section', start: 'top 60%' }, y: 60, opacity: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' });
      gsap.from('.cta-heading', { scrollTrigger: { trigger: '.cta-section', start: 'top 60%' }, y: 60, opacity: 0, duration: 1, ease: 'power2.out' });
      gsap.from('.cta-text', { scrollTrigger: { trigger: '.cta-section', start: 'top 50%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 });
      gsap.from('.btn-wrapper', { scrollTrigger: { trigger: '.cta-section', start: 'top 45%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 });
      gsap.from('.team-img-wrapper', { scrollTrigger: { trigger: '.team-section', start: 'top 60%' }, x: -60, opacity: 0, duration: 1, ease: 'power2.out' });
      gsap.from('.team-right > *', { scrollTrigger: { trigger: '.team-section', start: 'top 55%' }, y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' });
    });

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <About />
        <Values />
        <Stats />
        <Goal />
        <Showcase />
        <Team />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}