import React from 'react';
import Footer from '../components/Footer';
import { categories, listings, sourceMeta, ummahAbout } from '../data/travelData';
import SafeImage from '../components/SafeImage';

const featured = listings.filter(item => item.image).slice(0, 8);
const partnerListings = listings.filter(item => item.approvalBadge).slice(0, 6);

const HomePage = () => (
  <div className="min-h-screen bg-[#E3E7E0] text-[#2A3324]">
    <div className="pointer-events-none fixed inset-0 z-0 flex w-full justify-center">
      <div className="mx-auto flex h-full w-full max-w-7xl justify-between border-x border-[#C4CFC0]/70 px-4 sm:px-6 lg:px-8">
        <div className="hidden h-full w-1/3 border-r border-[#C4CFC0]/70 md:block"></div>
        <div className="hidden h-full w-1/3 border-r border-[#C4CFC0]/70 md:block"></div>
      </div>
    </div>

    <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <header className="flex items-start justify-between border-b border-[#C4CFC0] py-6">
        <a href="/" className="font-editorial text-3xl leading-none md:text-4xl">Ummah Directory</a>
        <nav className="hidden flex-wrap gap-x-4 gap-y-2 text-sm uppercase tracking-[0.22em] text-[#2A3324]/70 md:flex">
          <a href="/search" className="hover:text-[#2A3324]">Search</a><span>/</span>
          <a href="/about" className="hover:text-[#2A3324]">About</a><span>/</span>
          <a href="/category/food-and-beverage" className="hover:text-[#2A3324]">Food</a><span>/</span>
          <a href="/category/mosque-musalla" className="hover:text-[#2A3324]">Mosques</a>
        </nav>
      </header>

      <section className="py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_320px] md:items-end">
          <div>
            <h1 className="font-editorial text-6xl font-normal leading-none tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
              Muslim & Halal <br /><span className="italic">businesses</span> across Australia.
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-[#2A3324]/74">Find Muslim-owned and Halal-friendly businesses across food, mosques, tradies, education, medical, clothing, professional services, events, charities, and more.</p>
          </div>
          <form action="/search" className="bg-[#D5DBD1] p-6 md:p-8">
            <label className="block text-xs uppercase tracking-[0.22em] text-[#2A3324]/60" htmlFor="home-search">Find a business</label>
            <input id="home-search" name="q" placeholder="halal restaurant melbourne" className="mt-5 w-full border-b border-[#2A3324]/30 bg-transparent py-3 text-lg outline-none placeholder:text-[#2A3324]/40 focus:border-[#2A3324]" />
            <button className="mt-7 bg-[#2A3324] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[#E3E7E0] transition-colors hover:bg-[#5C715E]">Search directory</button>
          </form>
        </div>

        <div className="mt-12 grid border-y border-[#C4CFC0] md:grid-cols-4">
          {[[sourceMeta.totalListings, 'Business listings'], [sourceMeta.totalCategories, 'Categories'], ['2003', 'Printed catalogue began'], ['AU', 'Community directory']].map(([value, label]) => (
            <div key={label} className="border-b border-[#C4CFC0] py-6 md:border-b-0 md:border-r md:px-7 md:last:border-r-0">
              <div className="font-editorial text-4xl">{value}</div>
              <div className="mt-1 text-sm text-[#2A3324]/58">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#C4CFC0] py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-[#2A3324]/60">Popular categories</span>
            <h2 className="mt-5 font-editorial text-5xl leading-none md:text-7xl">Community sections.</h2>
          </div>
          <a href="/search" className="hidden border-b border-[#2A3324] pb-1 text-sm uppercase tracking-[0.22em] md:block">Search all</a>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map(category => (
            <a key={category.slug} href={`/category/${category.slug}`} className="group border-t-2 border-[#2A3324] bg-[#D5DBD1] p-6 transition-colors hover:bg-[#CDD5C8] md:p-8">
              <div className="h-52 overflow-hidden bg-[#2A3324]">
                <SafeImage src={category.image} alt={category.title} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
              </div>
              <h3 className="mt-7 font-editorial text-4xl leading-tight">{category.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#2A3324]/68">{category.description}</p>
              <div className="mt-6 text-xs uppercase tracking-[0.2em] text-[#2A3324]/55">{category.count} listings</div>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-[#C4CFC0] py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[0.75fr_1fr]">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-[#2A3324]/60">The Ummah Directory Promise</span>
            <h2 className="mt-5 font-editorial text-5xl leading-tight md:text-6xl">Support Ummah through local commerce.</h2>
            <div className="mt-8 h-72 overflow-hidden bg-[#2A3324]">
              <SafeImage src={featured[0]?.image} alt={featured[0]?.title || 'Ummah Directory listing'} className="h-full w-full object-cover" />
            </div>
          </div>
          <p className="whitespace-pre-line text-lg leading-9 text-[#2A3324]/74">{ummahAbout}</p>
        </div>
      </section>

      <section className="border-t border-[#C4CFC0] py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-[#2A3324]/60">Featured listings</span>
            <h2 className="mt-5 font-editorial text-5xl leading-none md:text-7xl">Featured businesses.</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {[...partnerListings, ...featured].slice(0, 8).map(listing => (
            <a key={listing.id} href={`/listing/${listing.slug}`} className={`group relative bg-[#D5DBD1] ${listing.approvalBadge ? 'ring-1 ring-[#9B7C43]/45' : ''}`}>
              {listing.approvalBadge && (
                <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-[#9B7C43]/55 bg-[#E3E7E0]/92 text-[#9B7C43]" aria-label={`${listing.approvalBadge} approved listing`}>
                  <iconify-icon icon="lucide:badge-check" class="h-4 w-4"></iconify-icon>
                </div>
              )}
              <div className="h-56 overflow-hidden bg-[#2A3324]">
                <SafeImage src={listing.image} alt={listing.title} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-[#2A3324]/50">{listing.region}</div>
                <h3 className="mt-2 font-editorial text-3xl leading-tight">{listing.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#2A3324]/66">{listing.location}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default HomePage;
