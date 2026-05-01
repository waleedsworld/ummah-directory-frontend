import React from 'react';
import { categories, sourceMeta } from '../data/travelData';

const Footer = () => (
  <footer className="bg-[#1F3E3D] px-6 py-14 text-white md:px-12">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1fr_1fr]">
      <div>
        <h2 className="font-editorial text-4xl font-light">Ummah Directory</h2>
        <p className="mt-5 max-w-sm text-sm leading-7 text-white/68">An Australian Muslim community directory helping people discover Muslim-owned and Halal-friendly businesses, services, mosques, schools, charities, and community organisations.</p>
      </div>
      <div>
        <h3 className="font-oswald text-sm uppercase tracking-[0.22em] text-[#C8A96A]">Browse</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/72">
          {categories.slice(0, 8).map(category => <a key={category.slug} href={`/category/${category.slug}`} className="hover:text-[#C8A96A]">{category.title}</a>)}
        </div>
      </div>
      <div>
        <h3 className="font-oswald text-sm uppercase tracking-[0.22em] text-[#C8A96A]">Directory</h3>
        <div className="mt-5 space-y-3 text-sm text-white/72">
          <p>{sourceMeta.totalListings} listings</p>
          <p>{sourceMeta.totalCategories} categories</p>
          <p>Serving the Australian Muslim community</p>
          <a href="/add-listing" className="inline-block border-b border-white/30 pb-1 hover:text-[#C8A96A]">Add a listing</a>
          <a href="/about" className="inline-block border-b border-white/30 pb-1 hover:text-[#C8A96A]">About the mission</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
