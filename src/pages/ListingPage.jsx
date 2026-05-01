import React, { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import { getCategoryForListing, getListing, listings, normalizeApiListing } from '../data/travelData';
import SafeImage from '../components/SafeImage';

const API_BASE_URL = 'http://127.0.0.1:5051';

const GuideLabel = ({ children, light = false }) => (
  <div className={`font-oswald text-[11px] uppercase tracking-[0.24em] ${light ? 'text-white/72' : 'text-[#9B7C43]'}`}>{children}</div>
);

const FactRow = ({ label, value }) => (
  <div className="grid grid-cols-[112px_1fr] gap-4 border-b border-[#1F3E3D]/12 py-3 text-sm last:border-b-0">
    <div className="text-[#1F3E3D]/48">{label}</div>
    <div className="text-[#1F3E3D]/82">{value}</div>
  </div>
);

const TextList = ({ items }) => (
  <ul className="space-y-3">
    {items.map(item => (
      <li key={item} className="grid grid-cols-[18px_1fr] gap-3 text-sm leading-relaxed text-[#1F3E3D]/72">
        <span className="mt-2 h-px bg-[#C8A96A]"></span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const ContactButton = ({ href, children, disabled = false }) => {
  const classes = `flex items-center justify-center border px-4 py-3 text-sm transition-colors ${
    disabled
      ? 'cursor-not-allowed border-[#1F3E3D]/10 text-[#1F3E3D]/34'
      : 'border-[#1F3E3D]/18 text-[#1F3E3D] hover:border-[#9B7C43] hover:text-[#9B7C43]'
  }`;

  if (disabled) return <span className={classes}>{children}</span>;
  return <a className={classes} href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noreferrer' : undefined}>{children}</a>;
};

const StoryBlock = ({ block, reversed = false }) => (
  <section className={`page-reveal grid gap-8 border-t border-[#1F3E3D]/12 pt-10 md:grid-cols-2 md:items-center ${reversed ? 'md:[&>div:first-child]:order-2' : ''}`}>
    <div>
      <GuideLabel>{block.kicker}</GuideLabel>
      <h2 className="mt-3 font-serifDisplay text-4xl font-light leading-tight text-[#1F3E3D] md:text-5xl">{block.title}</h2>
      <p className="mt-5 text-base leading-8 text-[#1F3E3D]/72">{block.body}</p>
    </div>
    <figure className="overflow-hidden bg-[#0B101A]">
      <SafeImage src={block.image} alt={block.title} className="h-[340px] w-full object-cover transition-transform duration-[1600ms] hover:scale-105 md:h-[460px]" />
    </figure>
  </section>
);

const ListingPage = ({ slug }) => {
  const staticListing = getListing(slug);
  const [remoteListing, setRemoteListing] = useState(null);
  const [missing, setMissing] = useState(false);
  const [social, setSocial] = useState({ counts: {}, user_actions: {} });
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const listing = staticListing || remoteListing || listings[0];
  const category = getCategoryForListing(listing);
  const revealRef = useRef(null);
  const username = typeof window !== 'undefined' ? localStorage.getItem('ummahUser') : '';

  useEffect(() => {
    setRemoteListing(null);
    setMissing(false);
    if (staticListing) return;
    fetch(`${API_BASE_URL}/api/listings/slug/${slug}`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('not found')))
      .then(data => setRemoteListing(normalizeApiListing(data)))
      .catch(() => setMissing(true));
  }, [slug, staticListing]);

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
  }, [listing.slug]);

  useEffect(() => {
    if (!listing?.id) return;
    fetch(`${API_BASE_URL}/api/listings/${listing.id}/social?username=${encodeURIComponent(username || '')}`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('social unavailable')))
      .then(setSocial)
      .catch(() => setSocial({ counts: {}, user_actions: {} }));
    fetch(`${API_BASE_URL}/api/listings/${listing.id}/comments`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('comments unavailable')))
      .then(data => setComments(data.data || []))
      .catch(() => setComments([]));
  }, [listing.id, username]);

  if (!staticListing && !remoteListing && !missing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EFE9DE] px-6 text-[#1F3E3D]">
        <div className="border border-[#1F3E3D]/14 bg-[#F8F4EC] p-8 text-center">
          <div className="font-serifDisplay text-3xl font-light">Opening listing...</div>
          <p className="mt-3 text-sm text-[#1F3E3D]/64">Checking the local directory.</p>
        </div>
      </div>
    );
  }

  const related = listings.filter(item => item.category === listing.category && item.slug !== listing.slug).slice(0, 3);
  const articleBlocks = [
    {
      kicker: 'Sense of place',
      title: `How ${listing.title} is listed`,
      body: `${listing.detailsParagraphs?.[0] || listing.details} This profile is most useful when the contact details, service categories, and location are read together before making an enquiry.`,
      image: listing.gallery[1] || listing.image,
    },
    {
      kicker: 'How to read the listing',
      title: 'How to use this listing',
      body: 'Start with the contact fields, compare service categories, and confirm hours or Halal-specific details directly with the business.',
      image: listing.gallery[2] || listing.image,
    },
  ];
  const guideCards = [
    { title: `${listing.region} contact guide`, type: 'Guide', text: 'Check phone, email, address, and category tags before making an enquiry.' },
    { title: `More services near ${listing.location}`, type: 'Location', text: 'Compare nearby businesses, service categories, and contact options.' },
    { title: `${category.title} seasonal brief`, type: 'Blog', text: 'Useful timing, contact, and service notes for this part of the directory.' },
  ];
  const hasAddress = listing.address && listing.address !== 'Address not listed';
  const contactActions = [
    { label: 'Call', href: listing.phone && listing.phone !== 'Not listed' ? `tel:${listing.phone.replace(/[^\d+]/g, '')}` : '', disabled: !listing.phone || listing.phone === 'Not listed' },
    { label: 'Email', href: listing.email ? `mailto:${listing.email}` : '', disabled: !listing.email },
    { label: 'Website', href: listing.website, disabled: !listing.website },
    { label: 'Directions', href: listing.mapDirectionsUrl, disabled: !hasAddress },
  ];
  const markAction = async action => {
    if (!username) {
      window.location.href = '/profile';
      return;
    }
    await fetch(`${API_BASE_URL}/api/user-actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, listing_id: listing.id, action }),
    });
    if (action === 'share' && navigator.share) {
      navigator.share({ title: listing.title, url: window.location.href }).catch(() => {});
    } else if (action === 'share') {
      navigator.clipboard?.writeText(window.location.href);
    }
    const res = await fetch(`${API_BASE_URL}/api/listings/${listing.id}/social?username=${encodeURIComponent(username)}`);
    if (res.ok) setSocial(await res.json());
  };

  const postComment = async event => {
    event.preventDefault();
    if (!username) {
      window.location.href = '/profile';
      return;
    }
    const text = comment.trim();
    if (!text) return;
    const res = await fetch(`${API_BASE_URL}/api/listings/${listing.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, comment: text }),
    });
    if (res.ok) {
      const item = await res.json();
      setComments(current => [...current, item]);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-[#EFE9DE] text-[#1F3E3D]" ref={revealRef}>
      <header className="relative min-h-screen overflow-hidden bg-[#0B101A] text-white">
        <SafeImage
          src={listing.image}
          alt={listing.title}
          className="absolute inset-0 h-full w-full object-cover listing-hero-image"
          loading="eager"
          fetchPriority="high"
          data-critical-image="true"
        />
        <div className="absolute inset-0 bg-[#5A3E27]/12 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/4 to-black/42"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/18 via-transparent to-black/8"></div>

        <nav className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-7 md:px-12 lg:px-14">
          <a href="/" className="font-serifDisplay text-2xl font-light tracking-wide text-white md:text-4xl">Ummah.</a>
          <div className="hidden items-center gap-7 text-sm text-white/82 md:flex">
            <a href="/" className="transition-colors hover:text-white">Home</a>
            <a href={`/category/${category.slug}`} className="transition-colors hover:text-white">{category.title}</a>
            <a href="#directory" className="transition-colors hover:text-white">Directory</a>
            <a href="#field-notes" className="transition-colors hover:text-white">Guide</a>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-28 md:px-12 lg:px-14">
          <div className="page-reveal mx-auto max-w-5xl text-center">
            <GuideLabel light>{listing.region} directory guide</GuideLabel>
            <h1 className="mt-8 font-serifDisplay text-5xl font-light italic leading-[1.08] tracking-wide text-white md:text-7xl lg:text-8xl">
              {listing.title} in {listing.location}
            </h1>
            {listing.approvalBadge && (
              <div className="mx-auto mt-5 flex w-fit items-center gap-2 border border-white/35 bg-black/18 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/86 backdrop-blur-sm" aria-label={`${listing.approvalBadge} approved listing`}>
                <iconify-icon icon="lucide:badge-check" class="h-3.5 w-3.5 text-[#C8A96A]"></iconify-icon>
                Approved listing
              </div>
            )}
            <div className="mx-auto mt-5 h-px max-w-xl bg-white/72"></div>
            <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-8 text-white/84 md:text-lg">{listing.summary}</p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/72 md:flex">
          <div className="h-1 w-12 rounded-full bg-white/60"></div>
          <span className="font-oswald text-[10px] uppercase tracking-[0.24em]">Scroll the details</span>
        </div>
      </header>

      <main>
        <section className="bg-[#EFE9DE] px-6 py-12 md:px-12 lg:px-14">
          <div className="mx-auto grid max-w-7xl border-y border-[#1F3E3D]/18 md:grid-cols-4">
            {[
              ['Rating', `${listing.rating}/5`],
              ['Reviews', listing.reviews],
              ['Contact', listing.status],
              ['Category', listing.region],
            ].map(([label, value]) => (
              <div key={label} className="page-reveal border-b border-[#1F3E3D]/12 py-6 md:border-b-0 md:border-r md:px-8 md:last:border-r-0">
                <div className="text-sm text-[#1F3E3D]/52">{label}</div>
                <div className="mt-1 font-serifDisplay text-3xl font-light text-[#1F3E3D]">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="directory" className="px-6 pb-16 md:px-12 lg:px-14">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <article className="space-y-12">
              <section className="page-reveal border-t border-[#1F3E3D]/12 pt-10">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ['like', social.user_actions?.like ? 'Liked' : 'Like', social.counts?.likes || 0],
                    ['visited', social.user_actions?.visited ? 'Seen' : 'Mark seen', social.counts?.visited || 0],
                    ['share', 'Share', social.counts?.shares || 0],
                  ].map(([action, label, count]) => (
                    <button key={action} onClick={() => markAction(action)} className="border border-[#1F3E3D]/14 bg-[#F8F4EC] px-5 py-4 text-left transition-colors hover:border-[#9B7C43]">
                      <span className="block font-serifDisplay text-3xl font-light">{count}</span>
                      <span className="text-sm text-[#1F3E3D]/62">{label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="page-reveal border-t border-[#1F3E3D]/12 pt-10">
                <div className="grid gap-10 md:grid-cols-[0.8fr_1fr]">
                  <div>
                    <GuideLabel>Directory details</GuideLabel>
                    <h2 className="mt-3 font-serifDisplay text-4xl font-light leading-tight md:text-5xl">The useful bits, without the brochure voice.</h2>
                    <p className="mt-5 leading-8 text-[#1F3E3D]/68">Opening times, access notes, tradeoffs, and nearby anchors come first so the page works like a real listing before it becomes a community story.</p>
                  </div>
                  <div className="bg-[#F8F4EC] p-6 md:p-8">
                    <FactRow label="Address" value={listing.address} />
                    <FactRow label="Phone" value={listing.phone} />
                    <FactRow label="Email" value={listing.email || 'Not listed'} />
                    <FactRow label="Website" value={listing.website ? 'Available' : 'Not listed'} />
                    <FactRow label="Category" value={listing.region} />
                    {listing.hoursStatus && <FactRow label="Hours now" value={listing.hoursStatus} />}
                    {listing.businessStatus && <FactRow label="Business status" value={listing.businessStatus} />}
                    {listing.coordinates !== 'Location not mapped' && <FactRow label="Coordinates" value={listing.coordinates} />}
                    {listing.isClaimed && <FactRow label="Google listing" value={listing.isVerified ? 'Claimed and verified' : 'Claimed'} />}
                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      {contactActions.map(action => (
                        <ContactButton key={action.label} href={action.href} disabled={action.disabled}>{action.label}</ContactButton>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {hasAddress && (
                <section className="page-reveal border-t border-[#1F3E3D]/12 pt-10">
                  <div className="grid gap-6 md:grid-cols-[0.72fr_1fr] md:items-start">
                    <div>
                      <GuideLabel>Map</GuideLabel>
                      <h2 className="mt-3 font-serifDisplay text-4xl font-light leading-tight md:text-5xl">Location view</h2>
                      <p className="mt-5 leading-8 text-[#1F3E3D]/68">Use the map as a quick orientation point, then confirm the address and opening hours directly with the business before travelling.</p>
                    </div>
                    <div className="overflow-hidden border border-[#1F3E3D]/12 bg-[#F8F4EC]">
                      <iframe
                        title={`${listing.title} map`}
                        src={listing.mapEmbedUrl}
                        className="h-[360px] w-full border-0 md:h-[430px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                      <div className="flex items-center justify-between gap-4 border-t border-[#1F3E3D]/12 px-5 py-4 text-sm">
                        <span className="text-[#1F3E3D]/68">{listing.address}</span>
                        <a href={listing.mapDirectionsUrl} target="_blank" rel="noreferrer" className="shrink-0 border-b border-[#1F3E3D]/30 pb-1 text-[#1F3E3D] hover:text-[#9B7C43]">Open map</a>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <section className="grid gap-8 border-t border-[#1F3E3D]/12 pt-10 md:grid-cols-2">
                <div className="page-reveal">
                  <GuideLabel>What's good</GuideLabel>
                  <h2 className="mt-3 font-serifDisplay text-4xl font-light">Why shortlist it</h2>
                  <div className="mt-6"><TextList items={listing.good} /></div>
                </div>
                <div className="page-reveal">
                  <GuideLabel>Reality check</GuideLabel>
                  <h2 className="mt-3 font-serifDisplay text-4xl font-light">What to know first</h2>
                  <div className="mt-6"><TextList items={listing.bad} /></div>
                </div>
              </section>

              {(listing.reviewSummary || listing.featuredReviews.length > 0 || listing.googleCategories.length > 0) && (
                <section className="page-reveal border-t border-[#1F3E3D]/12 pt-10">
                  <div className="grid gap-8 md:grid-cols-[0.72fr_1fr]">
                    <div>
                      <GuideLabel>Google place signals</GuideLabel>
                      <h2 className="mt-3 font-serifDisplay text-4xl font-light leading-tight md:text-5xl">What the place data adds.</h2>
                      <p className="mt-5 leading-8 text-[#1F3E3D]/68">When a listing is created from Google Maps data, this section keeps the practical signals visible without turning the page into a raw scrape dump.</p>
                    </div>
                    <div className="space-y-4">
                      {listing.reviewSummary && (
                        <div className="border border-[#1F3E3D]/12 bg-[#F8F4EC] p-5">
                          <div className="text-sm text-[#1F3E3D]/52">Review summary</div>
                          <p className="mt-2 leading-7 text-[#1F3E3D]/74">{listing.reviewSummary}</p>
                        </div>
                      )}
                      {listing.googleCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {listing.googleCategories.slice(0, 8).map(item => (
                            <span key={item} className="border border-[#1F3E3D]/12 bg-[#F8F4EC] px-3 py-2 text-sm text-[#1F3E3D]/70">{item}</span>
                          ))}
                        </div>
                      )}
                      {listing.featuredReviews.slice(0, 3).map(review => (
                        <blockquote key={`${review.author}-${review.text}`} className="border-l-2 border-[#9B7C43] bg-[#F8F4EC] p-5">
                          <div className="text-sm text-[#1F3E3D]/56">{review.author || 'Google reviewer'} · {review.rating || 'Rating'} stars</div>
                          <p className="mt-2 text-sm leading-7 text-[#1F3E3D]/74">{review.text}</p>
                        </blockquote>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              <section className="page-reveal border-t border-[#1F3E3D]/12 pt-10">
                <GuideLabel>Visual notes</GuideLabel>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {listing.gallery.map((image, index) => (
                    <figure key={image} className={`overflow-hidden bg-[#0B101A] ${index === 0 ? 'sm:col-span-2 h-[360px] md:h-[540px]' : 'h-72'}`}>
                      <SafeImage src={image} alt={`${listing.title} view ${index + 1}`} className="h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-105" />
                    </figure>
                  ))}
                </div>
              </section>

              <section className="page-reveal border-t border-[#1F3E3D]/12 pt-10">
                <div className="grid gap-8 md:grid-cols-[0.72fr_1fr]">
                  <div>
                    <GuideLabel>Community comments</GuideLabel>
                    <h2 className="mt-3 font-serifDisplay text-4xl font-light leading-tight md:text-5xl">Notes from people who opened this listing.</h2>
                    <p className="mt-5 leading-8 text-[#1F3E3D]/68">Local profiles can leave practical notes, questions, and visit context for other users.</p>
                  </div>
                  <div>
                    <form onSubmit={postComment} className="border border-[#1F3E3D]/12 bg-[#F8F4EC] p-4">
                      <textarea value={comment} onChange={event => setComment(event.target.value)} className="min-h-28 w-full bg-transparent text-sm outline-none" placeholder={username ? 'Leave a community note...' : 'Login to leave a comment'}></textarea>
                      <button className="mt-3 bg-[#1F3E3D] px-4 py-2 text-sm text-white">Post comment</button>
                    </form>
                    <div className="mt-4 space-y-3">
                      {comments.slice(-6).reverse().map(item => (
                        <div key={item.id} className="border border-[#1F3E3D]/12 bg-[#F8F4EC] p-4">
                          <a href={`/profile/${item.username}`} className="text-sm font-medium text-[#1F3E3D]">@{item.username}</a>
                          <p className="mt-2 text-sm leading-6 text-[#1F3E3D]/70">{item.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              <div className="page-reveal bg-[#1F3E3D] p-7 text-white">
                <GuideLabel light>At a glance</GuideLabel>
                <h3 className="mt-3 font-serifDisplay text-3xl font-light">{listing.location}</h3>
                <div className="mt-6 space-y-3 text-sm leading-7 text-white/74">
                  <p>{category.description}</p>
                  <p>{listing.insiderTips[0]}</p>
                </div>
              </div>

              <div className="page-reveal bg-[#F8F4EC] p-7">
                <GuideLabel>Opening times</GuideLabel>
                <div className="mt-4">
                  {listing.openingTimes.map(item => {
                    const [label, value] = item.split(': ');
                    return <FactRow key={item} label={label} value={value || item} />;
                  })}
                </div>
              </div>

              <div className="page-reveal bg-[#F8F4EC] p-7">
                <GuideLabel>Best for</GuideLabel>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3 text-sm text-[#1F3E3D]/76">
                  {listing.bestFor.map(item => <span key={item}>{item}</span>)}
                </div>
              </div>

              <div className="page-reveal bg-[#F8F4EC] p-7">
                <GuideLabel>Also nearby</GuideLabel>
                <div className="mt-5"><TextList items={listing.nearby} /></div>
              </div>
            </aside>
          </div>
        </section>

        <section id="field-notes" className="border-t border-[#1F3E3D]/12 px-6 py-16 md:px-12 lg:px-14">
          <div className="mx-auto max-w-7xl space-y-12">
            <section className="page-reveal grid gap-8 md:grid-cols-[0.72fr_1fr] md:items-start">
              <div className="border-t border-[#1F3E3D]/18 pt-5">
                <GuideLabel>Field notes</GuideLabel>
                <h2 className="mt-4 font-serifDisplay text-4xl font-light leading-tight md:text-6xl">A directory entry that reads like a community guide.</h2>
              </div>
              <div className="space-y-6 text-lg leading-9 text-[#1F3E3D]/74">
                {(listing.detailsParagraphs || [listing.details]).slice(0, 3).map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p>This page is meant to help you decide with context, not pressure: what is listed, what details are available, how to contact the business, and what related services nearby may be useful.</p>
              </div>
            </section>

            {articleBlocks.map((block, index) => <StoryBlock key={block.title} block={block} reversed={index % 2 === 1} />)}
          </div>
        </section>

        <section className="bg-[#F8F4EC] px-6 py-16 md:px-12 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="page-reveal grid gap-8 md:grid-cols-[0.58fr_1fr] md:items-end">
              <div>
                <GuideLabel>Related reading</GuideLabel>
                <h2 className="mt-3 font-serifDisplay text-4xl font-light leading-tight md:text-6xl">Guides, locations, and nearby listings.</h2>
              </div>
              <p className="text-base leading-8 text-[#1F3E3D]/68">This listing sits inside a broader category, so the next step can be a practical guide, a nearby service, or another business in the same section.</p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {guideCards.map(card => (
                <article key={card.title} className="page-reveal border-t border-[#1F3E3D]/18 pt-5">
                  <GuideLabel>{card.type}</GuideLabel>
                  <h3 className="mt-3 font-serifDisplay text-3xl font-light leading-tight">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#1F3E3D]/66">{card.text}</p>
                </article>
              ))}
            </div>

            {related.length > 0 && (
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {related.map(item => (
                  <a key={item.slug} href={`/listing/${item.slug}`} className="page-reveal group block bg-[#EFE9DE]">
                    <div className="h-64 overflow-hidden bg-[#0B101A]">
                      <SafeImage src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <GuideLabel>Listing</GuideLabel>
                      <h3 className="mt-2 font-serifDisplay text-3xl font-light leading-tight">{item.title}</h3>
                      <p className="mt-2 text-sm text-[#1F3E3D]/62">{item.location}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ListingPage;
