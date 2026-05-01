import React from 'react';
import Footer from '../components/Footer';
import { sourceMeta, ummahAbout } from '../data/travelData';

const AboutPage = () => (
  <div className="min-h-screen bg-[#E3E7E0] text-[#2A3324]">
    <main className="mx-auto max-w-5xl px-6 py-10 md:px-12 md:py-16">
      <nav className="border-b border-[#C4CFC0] pb-6 text-sm uppercase tracking-[0.22em] text-[#2A3324]/65"><a href="/">Home</a> / About</nav>
      <h1 className="mt-16 font-editorial text-6xl leading-none md:text-8xl">About Ummah Directory.</h1>
      <p className="mt-10 whitespace-pre-line text-xl leading-10 text-[#2A3324]/74">{ummahAbout}</p>
      <div className="mt-14 grid border-y border-[#C4CFC0] md:grid-cols-3">
        <div className="py-6 md:border-r md:px-6"><div className="font-editorial text-4xl">{sourceMeta.totalListings}</div><div className="text-sm text-[#2A3324]/58">Business listings</div></div>
        <div className="py-6 md:border-r md:px-6"><div className="font-editorial text-4xl">{sourceMeta.totalCategories}</div><div className="text-sm text-[#2A3324]/58">Directory categories</div></div>
        <div className="py-6 md:px-6"><div className="font-editorial text-4xl">2003</div><div className="text-sm text-[#2A3324]/58">Directory began</div></div>
      </div>
    </main>
    <Footer />
  </div>
);

export default AboutPage;
