import React from 'react';

const Newsletter = () => {
  return (
    <section className="w-full bg-[#1F3E3D] py-16 md:py-20 relative z-20 overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-bl from-[#C8A96A]/10 via-transparent to-transparent pointer-events-none mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 relative z-10">

        <div className="flex flex-col gap-4 w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="font-oswald text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white drop-shadow-sm">
            Find Community Businesses
          </h2>
          <p className="md:text-base lg:mx-0 leading-relaxed text-sm font-light text-white/70 max-w-xl mr-auto ml-auto">
            Join the Ummah Directory mailing list for community updates, new business listings, offers, and directory news.
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-5 items-center lg:items-end">
          <form className="flex flex-col sm:flex-row w-full max-w-md lg:max-w-xl gap-3 relative group">
            <div className="relative flex-1">
              <iconify-icon icon="lucide:mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#C8A96A] transition-colors duration-300"></iconify-icon>
              <input type="email" placeholder="Enter your email address" required className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 pl-11 pr-5 py-3.5 rounded-sm text-sm focus:outline-none focus:border-[#C8A96A]/60 focus:bg-white/10 focus:ring-1 focus:ring-[#C8A96A]/60 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" />
            </div>
            <button type="submit" className="bg-[#C8A96A] text-[#1F3E3D] px-8 py-3.5 rounded-sm font-medium text-sm whitespace-nowrap hover:bg-white transition-all duration-300 shadow-[0_4px_14px_rgba(200,169,106,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group/btn">
              Join Now
              <iconify-icon icon="lucide:arrow-right" class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"></iconify-icon>
            </button>
          </form>
          <p className="text-xs text-white/40 text-center lg:text-left w-full max-w-md lg:max-w-xl font-light">
            By subscribing, you agree to Ummah Directory's <a href="#" className="text-white/60 hover:text-white underline decoration-white/20 hover:decoration-white/80 underline-offset-4 transition-all duration-300">Terms & Conditions</a> and <a href="#" className="text-white/60 hover:text-white underline decoration-white/20 hover:decoration-white/80 underline-offset-4 transition-all duration-300">Privacy Policy</a>.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Newsletter;