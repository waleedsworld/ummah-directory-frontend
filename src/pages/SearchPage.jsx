import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import { API_BASE_URL, categories, listings } from '../data/travelData';
import SafeImage from '../components/SafeImage';

const params = new URLSearchParams(window.location.search);
const query = params.get('q') || '';
const categorySlug = params.get('category') || '';
const contactFilter = params.get('contact') || '';

const synonymGroups = [
  ['barber', 'haircut', 'fade', 'grooming', 'hairdresser', 'beauty'],
  ['halal', 'restaurant', 'food', 'takeaway', 'butcher', 'grocery', 'cafe'],
  ['mosque', 'masjid', 'prayer', 'jummah', 'jumuah', 'musalla'],
  ['doctor', 'medical', 'clinic', 'dentist', 'chemist', 'health'],
  ['accountant', 'lawyer', 'finance', 'professional', 'consultant'],
  ['school', 'education', 'tutor', 'learning', 'college'],
];

const tokenize = value => String(value || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

const expandTerms = value => {
  const terms = new Set(tokenize(value));
  synonymGroups.forEach(group => {
    if (group.some(term => terms.has(term))) group.forEach(term => terms.add(term));
  });
  return [...terms].filter(term => term.length > 2);
};

const scoreListing = (listing, terms) => {
  if (!terms.length) return 1;
  const title = tokenize(listing.title);
  const categoryText = tokenize(listing.category_names?.join(' '));
  const location = tokenize(listing.address);
  const blob = tokenize([listing.title, listing.summary, listing.details, listing.address, listing.phone, listing.email, listing.category_names?.join(' ')].join(' '));
  return terms.reduce((score, term) => {
    if (title.some(item => item.includes(term))) score += 6;
    if (categoryText.some(item => item.includes(term))) score += 4;
    if (location.some(item => item.includes(term))) score += 3;
    if (blob.some(item => item.includes(term))) score += 1;
    return score;
  }, 0);
};

const localSmartSearch = (q, category, contact) => {
  const terms = expandTerms(q);
  const ranked = listings
    .filter(listing => !category || listing.category === category)
    .filter(listing => contact !== 'phone' || (listing.phone && listing.phone !== 'Not listed'))
    .filter(listing => contact !== 'email' || listing.email)
    .map(listing => ({ listing, score: scoreListing(listing, terms) }))
    .filter(item => !q || item.score > 0)
    .sort((a, b) => b.score - a.score || a.listing.title.localeCompare(b.listing.title))
    .map(item => item.listing)
    .slice(0, 96);

  return ranked;
};

const suggestionSeeds = query
  ? ['halal food Melbourne', 'barber near Coburg', 'mosque near me', 'butcher Preston', 'accountant Melbourne']
  : ['halal food', 'mosque', 'barber', 'doctor', 'Islamic school'];

const SearchPage = () => {
  const [smartData, setSmartData] = useState(null);
  const q = query.toLowerCase().trim();
  const activeCategory = categories.find(category => category.slug === categorySlug);
  const localResults = useMemo(() => localSmartSearch(q, categorySlug, contactFilter), [q]);

  useEffect(() => {
    const controller = new AbortController();
    const search = new URLSearchParams({ q: query, limit: '12' });
    fetch(`${API_BASE_URL}/api/smart-search?${search}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error('smart search unavailable')))
      .then(setSmartData)
      .catch(() => setSmartData(null));
    return () => controller.abort();
  }, []);

  const sidebarCategories = categories.map(category => ({
    ...category,
    href: `/search?${new URLSearchParams({ q: query, category: category.slug }).toString()}`,
  }));
  const suggestions = smartData?.suggestions?.length ? smartData.suggestions : suggestionSeeds;
  const sidebarMatches = smartData?.categories || [];

  return (
    <div className="min-h-screen bg-[#E3E7E0] text-[#2A3324]">
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:px-12 md:py-14 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit border border-[#C4CFC0] bg-[#D5DBD1] p-5 lg:sticky lg:top-6">
          <a href="/" className="font-editorial text-3xl">Ummah Directory</a>
          <form className="mt-6 space-y-4">
            <input name="q" defaultValue={query} placeholder="Service, suburb, business..." className="w-full border border-[#2A3324]/18 bg-[#E3E7E0] px-3 py-3 text-sm outline-none focus:border-[#2A3324]" />
            <select name="category" defaultValue={categorySlug} className="w-full border border-[#2A3324]/18 bg-[#E3E7E0] px-3 py-3 text-sm outline-none focus:border-[#2A3324]">
              <option value="">All categories</option>
              {categories.map(category => <option key={category.slug} value={category.slug}>{category.title}</option>)}
            </select>
            <select name="contact" defaultValue={contactFilter} className="w-full border border-[#2A3324]/18 bg-[#E3E7E0] px-3 py-3 text-sm outline-none focus:border-[#2A3324]">
              <option value="">Any contact method</option>
              <option value="phone">Phone listed</option>
              <option value="email">Email listed</option>
            </select>
            <button className="w-full bg-[#2A3324] px-4 py-3 text-sm text-[#E3E7E0]">Search</button>
          </form>

          <div className="mt-7 border-t border-[#2A3324]/14 pt-5">
            <div className="text-sm text-[#2A3324]/58">Smart suggestions</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map(item => (
                <a key={item} href={`/search?q=${encodeURIComponent(item)}`} className="border border-[#2A3324]/16 bg-[#E3E7E0] px-3 py-2 text-xs hover:border-[#2A3324]">{item}</a>
              ))}
            </div>
          </div>

          {sidebarMatches.length > 0 && (
            <div className="mt-7 border-t border-[#2A3324]/14 pt-5">
              <div className="text-sm text-[#2A3324]/58">Detected category intent</div>
              <div className="mt-3 space-y-2">
                {sidebarMatches.slice(0, 4).map(category => (
                  <a key={category.slug} href={`/category/${category.slug}`} className="block border-b border-[#2A3324]/12 pb-2 text-sm hover:text-[#5C715E]">{category.name}</a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 border-t border-[#2A3324]/14 pt-5">
            <div className="text-sm text-[#2A3324]/58">Browse categories</div>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
              {sidebarCategories.map(category => (
                <a key={category.slug} href={category.href} className={`block border-b border-[#2A3324]/10 pb-2 text-sm ${category.slug === categorySlug ? 'text-[#2A3324]' : 'text-[#2A3324]/66 hover:text-[#2A3324]'}`}>
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <section>
          <nav className="border-b border-[#C4CFC0] pb-6 text-sm uppercase tracking-[0.22em] text-[#2A3324]/65"><a href="/">Home</a> / Search</nav>
          <section className="py-12">
            <h1 className="font-editorial text-6xl leading-none md:text-8xl">Search the directory.</h1>
            <p className="mt-6 max-w-2xl text-[#2A3324]/66">
              {smartData?.answer || 'Results are ranked by service words, category intent, location hints, and available contact details.'}
            </p>
            <p className="mt-4 text-[#2A3324]/65">
              Showing {localResults.length} result{localResults.length === 1 ? '' : 's'}
              {query ? ` for "${query}"` : ''}
              {activeCategory ? ` in ${activeCategory.title}` : ''}.
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {localResults.map(listing => (
              <a key={listing.id} href={`/listing/${listing.slug}`} className={`group border-t pt-5 ${listing.approvalBadge ? 'border-[#9B7C43]' : 'border-[#C4CFC0]'}`}>
                <div className="h-56 overflow-hidden bg-[#2A3324]"><SafeImage src={listing.image} alt={listing.title} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" /></div>
                <div className="py-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#2A3324]/50">
                    {listing.approvalBadge && (
                      <span className="inline-flex items-center gap-1 border border-[#9B7C43]/45 px-2 py-0.5 text-[#2A3324]/70" aria-label={`${listing.approvalBadge} approved listing`}>
                        <iconify-icon icon="lucide:badge-check" class="h-3 w-3 text-[#9B7C43]"></iconify-icon>
                        Approved
                      </span>
                    )}
                    <span>{listing.region}</span>
                  </div>
                  <h2 className="mt-2 font-editorial text-4xl leading-tight">{listing.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#2A3324]/66">{listing.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#2A3324]/58">
                    <span>{listing.phone && listing.phone !== 'Not listed' ? 'Phone listed' : 'No phone listed'}</span>
                    <span>{listing.email ? 'Email listed' : 'No email listed'}</span>
                  </div>
                </div>
              </a>
            ))}
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
