import React, { useState } from 'react';

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => {
    setSearchOpen(value => !value);
    setOpen(false);
  };

  const toggleMenu = () => {
    setOpen(value => !value);
    setSearchOpen(false);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[95] border-b border-white/10 bg-[#0B101A]/94 text-white backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <a href="/" className="font-oswald text-xl uppercase tracking-tight">Ummah</a>
        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleSearch} className="grid h-9 w-9 place-items-center border border-white/14" aria-label="Open search" aria-expanded={searchOpen}>
            <iconify-icon icon={searchOpen ? 'lucide:x' : 'lucide:search'} class="h-4 w-4"></iconify-icon>
          </button>
          <a href="/profile" className="grid h-9 w-9 place-items-center border border-white/14" aria-label="Profile">
            <iconify-icon icon="lucide:user" class="h-4 w-4"></iconify-icon>
          </a>
          <button type="button" onClick={toggleMenu} className="grid h-9 w-9 place-items-center border border-white/14" aria-label="Open menu" aria-expanded={open}>
            <iconify-icon icon={open ? 'lucide:x' : 'lucide:menu'} class="h-4 w-4"></iconify-icon>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/10 bg-[#0B101A] px-4 py-4">
          <form action="/search" method="get" className="flex border border-white/14 bg-white/5">
            <input
              autoFocus
              name="q"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/42"
              placeholder="Search halal food, barber, mosque..."
            />
            <button className="bg-[#C8A96A] px-4 text-sm text-[#1F3E3D]">Search</button>
          </form>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.14em] text-white/72">
            {['halal food Melbourne', 'barber Coburg', 'mosque Preston', 'doctor near me'].map(item => (
              <a key={item} href={`/search?q=${encodeURIComponent(item)}`} className="border border-white/10 px-3 py-2">
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-white/10 bg-[#0B101A] px-4 py-4">
          <form action="/search" className="flex border border-white/14 bg-white/5">
            <input name="q" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/42" placeholder="Search suburb or service" />
            <button className="bg-[#C8A96A] px-4 text-sm text-[#1F3E3D]">Go</button>
          </form>
          <nav className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <a href="/category/food-and-beverage" className="border border-white/10 px-3 py-3 text-white/78">Food & Beverage</a>
            <a href="/category/mosques-and-prayer-rooms" className="border border-white/10 px-3 py-3 text-white/78">Mosques</a>
            <a href="/add-listing" className="border border-white/10 px-3 py-3 text-white/78">Add listing</a>
            <a href="/manage-listings" className="border border-white/10 px-3 py-3 text-white/78">Manage listings</a>
            <a href="/profile" className="border border-white/10 px-3 py-3 text-white/78">Profile</a>
            <a href="/about" className="border border-white/10 px-3 py-3 text-white/78">About</a>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
