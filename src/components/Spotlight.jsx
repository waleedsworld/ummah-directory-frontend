import React from 'react';
import SafeImage from './SafeImage';

const Spotlight = () => {
  return (
    <section className="md:py-24 z-20 font-inter bg-[#F4F4F5] w-full border-slate-200/50 border-t pt-16 pb-16 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 md:mb-14">
        <h2 className="md:text-4xl lg:text-5xl uppercase text-3xl text-[#1F3E3D] tracking-tight font-oswald mb-4">Ummah Directory Spotlight</h2>
        <p className="md:text-base leading-relaxed text-sm font-light text-slate-600 max-w-2xl">Explore useful updates, featured categories, and practical ways to find and support local Muslim-owned and Halal-friendly businesses.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(31,62,61,0.04)] flex flex-col group border border-slate-200/60 hover:shadow-[0_12px_40px_rgba(31,62,61,0.08)] transition-all duration-500 hover:-translate-y-1">
          <div className="relative h-48 md:h-52 overflow-hidden bg-slate-100">
            <SafeImage src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop" alt="Community Picks" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
          <div className="p-6 md:p-8 flex flex-col flex-grow relative bg-white">
            <h3 className="font-oswald text-xl uppercase tracking-tight text-[#1F3E3D] mb-3">Community Picks</h3>
            <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow">
              Find useful businesses and services selected from active directory categories, including food, services, education, and community support.
            </p>
            <a href="#" className="text-[#C8A96A] font-normal text-sm mt-auto inline-flex items-center gap-1.5 hover:text-[#1F3E3D] transition-colors w-fit group/link">
              Browse Picks
              <iconify-icon icon="lucide:arrow-right" class="w-4 h-4 group-hover/link:translate-x-1 transition-transform"></iconify-icon>
            </a>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(31,62,61,0.04)] flex flex-col group border border-slate-200/60 hover:shadow-[0_12px_40px_rgba(31,62,61,0.08)] transition-all duration-500 hover:-translate-y-1">
          <div className="relative h-48 md:h-52 overflow-hidden bg-slate-100">
            <SafeImage src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop" alt="Community Stories" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
          <div className="p-6 md:p-8 flex flex-col flex-grow relative bg-white">
            <h3 className="uppercase text-xl text-[#1F3E3D] tracking-tight font-oswald mb-3">Community Stories</h3>
            <p className="leading-relaxed flex-grow text-sm font-light text-slate-600 mb-6">
              Discover local businesses, community organisations, and services that help people connect through trust, convenience, and shared values.
            </p>
            <a href="#" className="text-[#C8A96A] font-normal text-sm mt-auto inline-flex items-center gap-1.5 hover:text-[#1F3E3D] transition-colors w-fit group/link">
              Read Stories
              <iconify-icon icon="lucide:arrow-right" class="w-4 h-4 group-hover/link:translate-x-1 transition-transform"></iconify-icon>
            </a>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(31,62,61,0.04)] flex flex-col group border border-slate-200/60 hover:shadow-[0_12px_40px_rgba(31,62,61,0.08)] transition-all duration-500 hover:-translate-y-1">
          <div className="relative h-48 md:h-52 overflow-hidden bg-slate-100">
            <SafeImage src="https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=1000&auto=format&fit=crop" alt="Local Services" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
          <div className="p-6 md:p-8 flex flex-col flex-grow relative bg-white">
            <h3 className="font-oswald text-xl uppercase tracking-tight text-[#1F3E3D] mb-3">Local Services</h3>
            <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow">
              Find trades, professional services, health providers, education options, and everyday support from community businesses.
            </p>
            <a href="#" className="text-[#C8A96A] font-normal text-sm mt-auto inline-flex items-center gap-1.5 hover:text-[#1F3E3D] transition-colors w-fit group/link">
              Find Services
              <iconify-icon icon="lucide:arrow-right" class="w-4 h-4 group-hover/link:translate-x-1 transition-transform"></iconify-icon>
            </a>
          </div>
        </div>

        {/* Column 4: Services */}
        <div className="flex flex-col gap-4 h-full lg:col-span-1 md:col-span-2">
          
          <div className="bg-white rounded-r-xl rounded-l-sm border border-slate-200/60 border-l-4 border-l-[#1F3E3D]/10 flex flex-row lg:flex-col xl:flex-row items-center gap-5 p-5 md:p-6 shadow-[0_4px_20px_rgba(31,62,61,0.02)] hover:shadow-md hover:border-l-[#C8A96A] hover:-translate-y-0.5 transition-all duration-300 flex-1 group">
            <div className="w-12 h-12 shrink-0 rounded-full border border-slate-100 text-[#1F3E3D]/70 flex items-center justify-center bg-slate-50 group-hover:border-[#C8A96A]/30 group-hover:text-[#C8A96A] group-hover:bg-[#C8A96A]/5 transition-colors duration-300">
              <iconify-icon icon="lucide:shield-check" class="w-5 h-5"></iconify-icon>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <h4 className="text-sm font-normal text-[#1F3E3D]">Trusted Categories</h4>
              <a href="#" className="text-xs text-[#C8A96A] hover:text-[#1F3E3D] transition-colors font-normal inline-flex items-center gap-1 group/slink">
                Learn More <iconify-icon icon="lucide:chevron-right" class="w-3 h-3 group-hover/slink:translate-x-0.5 transition-transform"></iconify-icon>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-r-xl rounded-l-sm border border-slate-200/60 border-l-4 border-l-[#1F3E3D]/10 flex flex-row lg:flex-col xl:flex-row items-center gap-5 p-5 md:p-6 shadow-[0_4px_20px_rgba(31,62,61,0.02)] hover:shadow-md hover:border-l-[#C8A96A] hover:-translate-y-0.5 transition-all duration-300 flex-1 group">
            <div className="w-12 h-12 shrink-0 rounded-full border border-slate-100 text-[#1F3E3D]/70 flex items-center justify-center bg-slate-50 group-hover:border-[#C8A96A]/30 group-hover:text-[#C8A96A] group-hover:bg-[#C8A96A]/5 transition-colors duration-300">
              <iconify-icon icon="lucide:diamond" class="w-5 h-5"></iconify-icon>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <h4 className="text-sm font-normal text-[#1F3E3D]">New Listings</h4>
              <a href="#" className="text-xs text-[#C8A96A] hover:text-[#1F3E3D] transition-colors font-normal inline-flex items-center gap-1 group/slink">
                Learn More <iconify-icon icon="lucide:chevron-right" class="w-3 h-3 group-hover/slink:translate-x-0.5 transition-transform"></iconify-icon>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-r-xl rounded-l-sm border border-slate-200/60 border-l-4 border-l-[#1F3E3D]/10 flex flex-row lg:flex-col xl:flex-row items-center gap-5 p-5 md:p-6 shadow-[0_4px_20px_rgba(31,62,61,0.02)] hover:shadow-md hover:border-l-[#C8A96A] hover:-translate-y-0.5 transition-all duration-300 flex-1 group">
            <div className="w-12 h-12 shrink-0 rounded-full border border-slate-100 text-[#1F3E3D]/70 flex items-center justify-center bg-slate-50 group-hover:border-[#C8A96A]/30 group-hover:text-[#C8A96A] group-hover:bg-[#C8A96A]/5 transition-colors duration-300">
              <iconify-icon icon="lucide:headset" class="w-5 h-5"></iconify-icon>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <h4 className="text-sm font-normal text-[#1F3E3D]">Contact Support</h4>
              <a href="#" className="text-xs text-[#C8A96A] hover:text-[#1F3E3D] transition-colors font-normal inline-flex items-center gap-1 group/slink">
                Contact Us <iconify-icon icon="lucide:chevron-right" class="w-3 h-3 group-hover/slink:translate-x-0.5 transition-transform"></iconify-icon>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Spotlight;
