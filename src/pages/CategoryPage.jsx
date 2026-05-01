import React, { useEffect, useMemo, useRef } from 'react';
import Footer from '../components/Footer';
import { categories, getCategory, getListingsByCategory, listings as allListings } from '../data/travelData';
import SafeImage from '../components/SafeImage';

const MetaLine = ({ left, middle, right }) => (
  <div className="flex items-center justify-between border-y border-[#C4CFC0] py-4 text-xs uppercase tracking-[0.22em] text-[#2A3324]/68 md:text-sm">
    <span>{left}</span>
    <span className="hidden sm:block">{middle}</span>
    <span>{right}</span>
  </div>
);

const ArrowButton = ({ dark = false }) => (
  <span className={`inline-flex h-9 w-9 items-center justify-center ${dark ? 'bg-[#2A3324] text-[#E3E7E0]' : 'bg-[#D5DBD1] text-[#2A3324]'} transition-colors group-hover:bg-[#5C715E] group-hover:text-[#E3E7E0]`}>
    <iconify-icon icon="solar:arrow-right-linear" class="text-lg"></iconify-icon>
  </span>
);

const SectionKicker = ({ children }) => (
  <span className="block text-xs uppercase tracking-[0.22em] text-[#2A3324]/60">{children}</span>
);

const EditorialCard = ({ number, title, text, href = '#', image, type = 'Guide', items = [] }) => (
  <a href={href} className="page-reveal group flex h-full flex-col border-t-2 border-[#2A3324] bg-[#D5DBD1] p-6 transition-colors hover:bg-[#CDD5C8] md:p-8">
    <div className="flex items-start justify-between gap-6">
      <span className="text-base text-[#2A3324]/48">{number}</span>
      <span className="text-xs uppercase tracking-[0.22em] text-[#2A3324]/52">{type}</span>
    </div>
    {image && (
      <div className="mt-7 h-44 overflow-hidden bg-[#2A3324]">
        <SafeImage src={image} alt={title} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
      </div>
    )}
    {!image && items.length > 0 && (
      <div className="mt-7 border-y border-[#2A3324]/16 py-3">
        {items.slice(0, 4).map(item => (
          <div key={item} className="flex items-center justify-between gap-4 border-b border-[#2A3324]/10 py-3 text-sm last:border-b-0">
            <span className="text-[#2A3324]/58">Desk note</span>
            <span className="text-right text-[#2A3324]">{item}</span>
          </div>
        ))}
      </div>
    )}
    <h3 className="mt-7 font-editorial text-3xl font-normal leading-tight tracking-tight text-[#2A3324] md:text-4xl">{title}</h3>
    <p className="mt-6 text-base leading-7 text-[#2A3324]/70">{text}</p>
    <div className="mt-auto pt-8"><ArrowButton dark /></div>
  </a>
);

const ListingArchiveRow = ({ listing, index }) => (
  <a href={`/listing/${listing.slug}`} className="page-reveal group grid border-t border-[#C4CFC0] py-6 md:grid-cols-[90px_220px_minmax(0,1fr)_140px] md:items-center md:gap-8">
    <div className="mb-4 text-sm text-[#2A3324]/48 md:mb-0">{String(index + 1).padStart(2, '0')}</div>
    <div className="h-52 overflow-hidden bg-[#2A3324] md:h-32">
      <SafeImage src={listing.image} alt={listing.title} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
    </div>
    <div className="mt-5 md:mt-0">
      <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-[#2A3324]/50">
        {listing.approvalBadge && (
          <span className="inline-flex items-center gap-1 border border-[#9B7C43]/45 px-2 py-0.5 text-[#2A3324]/70" aria-label={`${listing.approvalBadge} approved listing`}>
            <iconify-icon icon="lucide:badge-check" class="h-3 w-3 text-[#9B7C43]"></iconify-icon>
            Approved
          </span>
        )}
        <span>{listing.region}</span>
        <span>{listing.duration}</span>
        <span>{listing.guests}</span>
      </div>
      <h3 className="font-editorial text-3xl font-normal leading-tight tracking-tight text-[#2A3324] md:text-4xl">{listing.title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#2A3324]/68">{listing.summary}</p>
    </div>
    <div className="mt-5 flex items-end justify-between gap-4 md:mt-0 md:flex-col md:items-end">
      <div className="text-right">
        <div className="text-xs uppercase tracking-[0.18em] text-[#2A3324]/45">Category</div>
        <div className="mt-1 font-editorial text-2xl text-[#2A3324]">{listing.price}</div>
      </div>
      <ArrowButton />
    </div>
  </a>
);

const listingFamilyKey = listing => {
  const title = `${listing.title || ''}`.toLowerCase();
  const familyPatterns = [
    'philliez',
    "mustafa's kebabs",
    'glenroy kebabs',
    'afghan master kebab',
    'ziyka',
    'burger road',
    'garlik kebabery',
  ];
  const family = familyPatterns.find(pattern => title.includes(pattern));
  return family || `${listing.title || ''}`.toLowerCase().replace(/\s+/g, ' ').trim();
};

const CategoryPage = ({ slug }) => {
  const category = getCategory(slug) || categories[0];
  const categoryListings = getListingsByCategory(category.slug);
  const revealRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12 });

    const nodes = revealRef.current?.querySelectorAll('.page-reveal') || [];
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [category.slug]);

  const leadListing = categoryListings[0] || allListings[0];
  const secondaryListings = categoryListings.slice(1);
  const archiveGroups = useMemo(() => {
    const groups = new Map();
    categoryListings.forEach(listing => {
      const key = listingFamilyKey(listing);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(listing);
    });

    return [...groups.values()].map(group => ({
      lead: group[0],
      branches: group.slice(1),
    }));
  }, [categoryListings]);
  const childCategoryCounts = useMemo(() => {
    const counts = new Map();
    categoryListings.forEach(listing => {
      (listing.category_names || []).forEach(name => {
        if (!name || name === category.title || name === 'Victoria' || name === 'New South Wales' || name === 'Australian Capital Territory') return;
        counts.set(name, (counts.get(name) || 0) + 1);
      });
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [category.title, categoryListings]);
  const imageStrip = [...new Map(categoryListings.filter(item => item.image).map(item => [item.image, item])).values()].slice(0, 6);

  const editorialBlocks = useMemo(() => {
    const uniqueByImage = [];
    const seenImages = new Set();
    categoryListings.forEach(listing => {
      const imageKey = listing.image || listing.title;
      if (seenImages.has(imageKey)) return;
      seenImages.add(imageKey);
      uniqueByImage.push(listing);
    });
    const contactReady = categoryListings.find(listing => listing.phone && listing.phone !== 'Not listed' && listing.email) || categoryListings.find(listing => listing.phone && listing.phone !== 'Not listed') || leadListing;
    const visualPick = uniqueByImage.find(listing => listing.slug !== contactReady.slug && listing.slug !== leadListing.slug) || uniqueByImage.find(listing => listing.slug !== contactReady.slug) || secondaryListings[0] || leadListing;
    const branchGroup = archiveGroups.find(group => group.branches.length > 0);
    const clusterItems = childCategoryCounts.length
      ? childCategoryCounts.slice(0, 4).map(([name, count]) => `${name}: ${count}`)
      : category.bestFor.split(',').map(item => item.trim()).filter(Boolean);

    return [
      {
        title: `${category.shortTitle || category.title} clusters at a glance`,
        text: childCategoryCounts.length
          ? `This desk card is generated from real listing subcategories, so it changes per category instead of repeating the same advice block.`
          : `${category.bestFor}. Use these service signals to narrow the page before opening individual listings.`,
        type: 'Cluster map',
        items: clusterItems,
        href: '#archive',
      },
      {
        title: `${contactReady.title} has direct contact details`,
        text: `${contactReady.location}. ${contactReady.phone && contactReady.phone !== 'Not listed' ? 'Phone is listed' : 'Phone is not listed'}${contactReady.email ? ' and email is available' : ''}, making it a useful first profile when you need a quick answer.`,
        type: 'Contact note',
        image: contactReady.image,
        href: `/listing/${contactReady.slug}`,
      },
      {
        title: branchGroup ? `${branchGroup.lead.title} and related branches` : `Open ${visualPick.title} next`,
        text: branchGroup
          ? `${branchGroup.branches.length} related branch${branchGroup.branches.length === 1 ? '' : 'es'} are grouped under one family, so the archive stays readable without repeating the same listing card.`
          : `${visualPick.summary} This card highlights a different listing instead of reusing the same category image.`,
        type: branchGroup ? 'Branch note' : 'Listing note',
        image: branchGroup ? '' : visualPick.image,
        items: branchGroup ? [branchGroup.lead.title, ...branchGroup.branches.map(branch => branch.title)].slice(0, 4) : [],
        href: `/listing/${branchGroup ? branchGroup.lead.slug : visualPick.slug}`,
      },
    ];
  }, [archiveGroups, category, categoryListings, childCategoryCounts, leadListing, secondaryListings]);

  const quickNotes = [
    ['Best texture', category.bestFor],
    ['Climate', category.climate],
    ['Directory view', `${categoryListings.length} listings, ${archiveGroups.length} grouped sections`],
    ['Top clusters', childCategoryCounts.slice(0, 3).map(([name]) => name).join(', ') || category.title],
  ];

  return (
    <div className="min-h-screen bg-[#E3E7E0] text-[#2A3324]" ref={revealRef}>
      <div className="pointer-events-none fixed inset-0 z-0 flex w-full justify-center">
        <div className="mx-auto flex h-full w-full max-w-7xl justify-between border-x border-[#C4CFC0]/70 px-4 sm:px-6 lg:px-8">
          <div className="hidden h-full w-1/3 border-r border-[#C4CFC0]/70 md:block"></div>
          <div className="hidden h-full w-1/3 border-r border-[#C4CFC0]/70 md:block"></div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between border-b border-[#C4CFC0] py-6">
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm uppercase tracking-[0.22em] text-[#2A3324]/70 md:text-base">
            <a href="/" className="transition-colors hover:text-[#2A3324]">Home</a>
            <span>/</span>
            {categories.map(item => (
              <React.Fragment key={item.slug}>
                <a href={`/category/${item.slug}`} className={`transition-colors hover:text-[#2A3324] ${item.slug === category.slug ? 'text-[#2A3324]' : ''}`}>{item.shortTitle}</a>
                <span className="last:hidden">/</span>
              </React.Fragment>
            ))}
          </nav>
          <a href="#archive" className="hidden text-[#5C715E] sm:block" aria-label="Jump to archive">
            <iconify-icon icon="solar:arrow-right-up-linear" class="text-4xl"></iconify-icon>
          </a>
        </header>

        <main>
          <section className="relative pb-12 pt-14 md:pb-16 md:pt-24">
            <div className="relative z-10 mb-12 flex flex-col justify-between gap-10 md:flex-row md:items-end">
              <h1 className="page-reveal w-full font-editorial text-6xl font-normal leading-none tracking-tight sm:text-7xl md:w-3/4 md:text-8xl lg:text-9xl">
                {category.title.split(' ')[0]} <br />
                <span className="italic">{category.title.split(' ').slice(1).join(' ') || 'Directory'}</span>
                <span className="hidden h-[2px] w-24 bg-[#2A3324] align-middle md:mb-4 md:ml-4 md:inline-block"></span> Guide
              </h1>

              <div className="page-reveal md:w-1/4 md:text-right">
                <a href="#archive" className="inline-block border-b border-[#2A3324] pb-1 text-sm uppercase tracking-[0.22em] transition-opacity hover:opacity-70">Browse Listings</a>
                <a href={`/listing/${leadListing.slug}`} className="group mt-7 block text-left md:text-right">
                  <div className="ml-auto h-36 w-44 overflow-hidden bg-[#2A3324] md:h-40 md:w-52">
                    <SafeImage src={leadListing.image} alt={leadListing.title} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#2A3324]/70">Featured listing: {leadListing.title}. {leadListing.location}.</p>
                </a>
              </div>
            </div>

            <MetaLine left={category.climate} middle={`${categoryListings.length} directory listings`} right={category.bestFor} />

            <a href={`/listing/${leadListing.slug}`} className="page-reveal group mt-4 block">
              <div className="relative h-[420px] overflow-hidden bg-[#2A3324] md:h-[640px] lg:h-[720px]">
                <SafeImage
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover page-hero-image transition-transform duration-[1600ms] group-hover:scale-[1.03]"
                  loading="eager"
                  fetchPriority="high"
                  data-critical-image="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A3324]/36 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#E3E7E0]">
                  <div>
                    <SectionKicker>Featured category</SectionKicker>
                    <p className="mt-2 max-w-xl text-lg leading-7 text-[#E3E7E0]/88">{category.description}</p>
                  </div>
                  <span className="hidden border-b border-[#E3E7E0] pb-1 text-sm uppercase tracking-[0.2em] md:block">Open first listing</span>
                </div>
              </div>
            </a>

            <div className="flex justify-between py-3 text-sm text-[#2A3324]/68">
              <span>Ummah Category Journal</span>
              <span>{category.title}</span>
            </div>
          </section>

          <section className="border-t border-[#C4CFC0] py-16 md:py-24">
            <div className="grid gap-12 md:grid-cols-12">
              <div className="page-reveal md:col-span-8">
                <h2 className="font-editorial text-4xl font-normal leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  {category.description} This page works like a compact community desk: category clusters, contact notes, business profiles, and grouped listings gathered in one place.
                </h2>
                <a href="#archive" className="mt-8 inline-block border-b border-[#2A3324] pb-1 text-sm uppercase tracking-[0.22em] transition-opacity hover:opacity-70">Browse listings</a>
              </div>
              <div className="page-reveal flex flex-col justify-between gap-8 md:col-span-4">
                <p className="text-lg leading-8 text-[#2A3324]/78">Use the page like a clean directory index: scan the subcategory clusters first, then compare listings by service type, address, phone availability, email availability, and profile details.</p>
                <div className="h-52 overflow-hidden bg-[#2A3324]">
                  <SafeImage src={leadListing.gallery?.[0] || leadListing.image} alt={leadListing.title} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-[#C4CFC0] py-16 md:py-24">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <SectionKicker>Community desk</SectionKicker>
                <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight tracking-tight md:text-6xl">Advice, articles, and service notes.</h2>
              </div>
              <a href="#archive" className="border-b border-[#2A3324] pb-1 text-sm uppercase tracking-[0.22em] transition-opacity hover:opacity-70">All listings</a>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {editorialBlocks.map((block, index) => (
                <EditorialCard key={block.title} number={String(index + 1).padStart(2, '0')} {...block} />
              ))}
            </div>
          </section>

          <section className="border-t border-[#C4CFC0] py-16 md:py-24">
            <div className="grid gap-16 lg:grid-cols-2">
              <div className="page-reveal flex flex-col justify-between">
                <p className="mb-12 text-lg leading-8 text-[#2A3324]/78 lg:pr-12">The page groups repeated brand families so multi-location businesses are easier to browse without making the page feel repetitive.</p>
                <div className="grid grid-cols-3 gap-2">
                  {imageStrip.map(item => (
                    <a key={item.image} href={`/listing/${item.slug}`} className="h-28 overflow-hidden bg-[#2A3324] md:h-32">
                      <SafeImage src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="page-reveal">
                <SectionKicker>Quick guide</SectionKicker>
                <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight tracking-tight md:text-5xl">What to know before choosing.</h2>
                <div className="mt-10 text-lg">
                  {quickNotes.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-8 border-t border-[#C4CFC0] py-5 last:border-b">
                      <span className="text-[#2A3324]/68">{label}</span>
                      <span className="max-w-xs text-right font-normal">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="archive" className="border-t border-[#C4CFC0] py-16 md:py-24">
            <div className="mb-10 flex items-end justify-between gap-8">
              <div>
                <SectionKicker>Business listings</SectionKicker>
                <h2 className="mt-5 font-editorial text-5xl font-normal leading-none tracking-tight md:text-7xl">Listings in this category.</h2>
              </div>
              <div className="hidden gap-2 md:flex">
                <button className="bg-[#2A3324] p-2 text-[#E3E7E0] transition-colors hover:bg-[#5C715E]" aria-label="Previous"><iconify-icon icon="solar:arrow-left-linear" class="text-xl"></iconify-icon></button>
                <button className="bg-[#2A3324] p-2 text-[#E3E7E0] transition-colors hover:bg-[#5C715E]" aria-label="Next"><iconify-icon icon="solar:arrow-right-linear" class="text-xl"></iconify-icon></button>
              </div>
            </div>

            <div>
              {archiveGroups.map(({ lead, branches }, index) => (
                <div key={lead.slug}>
                  <ListingArchiveRow listing={lead} index={index} />
                  {branches.length > 0 && (
                    <div className="page-reveal -mt-2 border-t border-[#C4CFC0]/50 pb-5 pl-0 md:ml-[90px] md:pl-[220px]">
                      <div className="bg-[#D5DBD1]/55 px-4 py-3 text-sm text-[#2A3324]/70">
                        <span className="font-normal text-[#2A3324]">{branches.length} related branch{branches.length === 1 ? '' : 'es'} grouped here:</span>
                        <span className="ml-2">
                          {branches.slice(0, 6).map(branch => (
                            <a key={branch.slug} href={`/listing/${branch.slug}`} className="mr-3 inline-block border-b border-[#2A3324]/20 hover:border-[#2A3324]">{branch.title}</a>
                          ))}
                          {branches.length > 6 && <span>+{branches.length - 6} more</span>}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
