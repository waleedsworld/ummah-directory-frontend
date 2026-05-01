import rawCategories from './ummahdirectory/categories.json';
import rawListings from './ummahdirectory/listings.json';
import aboutCopy from './ummahdirectory/vision_and_mission.txt?raw';

export const API_BASE_URL = 'https://aitest.techrealm.online';
export const ummahAbout = aboutCopy.trim().replace(/Ummah Directory/g, 'Ummah Directory');
export const sourceMeta = {
  name: 'Ummah Directory',
  source: 'https://ummahdirectory.com.au/',
  totalCategories: rawCategories.length,
  totalListings: rawListings.length,
};

const categoryImageFallbacks = {
  'food-and-beverage': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=85&w=1800&auto=format&fit=crop',
  'mosque-musalla': 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=85&w=1800&auto=format&fit=crop',
  trades: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=85&w=1800&auto=format&fit=crop',
  education: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=85&w=1800&auto=format&fit=crop',
  medical: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=85&w=1800&auto=format&fit=crop',
  clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=85&w=1800&auto=format&fit=crop',
  charities: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=85&w=1800&auto=format&fit=crop',
  'event-planning': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=85&w=1800&auto=format&fit=crop',
  auto: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=85&w=1800&auto=format&fit=crop',
  'professional-services': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=85&w=1800&auto=format&fit=crop',
  beauticians: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=85&w=1800&auto=format&fit=crop',
  commerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=85&w=1800&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=85&w=1800&auto=format&fit=crop',
};

const categoryCopy = {
  'food-and-beverage': {
    description: 'Halal restaurants, takeaway, butchers, cafes, sweets, catering, and food businesses serving the Australian Muslim community.',
    bestFor: 'Halal dining, family meals, catering, groceries',
  },
  'mosque-musalla': {
    description: 'Mosques, musallas, community prayer spaces, and Islamic centres across Australia.',
    bestFor: 'Prayer spaces, local community, Islamic centres',
  },
  trades: {
    description: 'Muslim-owned trades and home services, from building and electrical work to maintenance and construction support.',
    bestFor: 'Tradies, home services, renovation support',
  },
  education: {
    description: 'Islamic schools, tutoring, learning programs, and education services for families and students.',
    bestFor: 'Schools, tutoring, community learning',
  },
  medical: {
    description: 'Doctors, chemists, allied health, and medical providers listed for easier community access.',
    bestFor: 'Healthcare, family doctors, chemists',
  },
  clothing: {
    description: 'Modest fashion, Islamic clothing, apparel, accessories, and local retail brands.',
    bestFor: 'Modest clothing, local brands, retail',
  },
  charities: {
    description: 'Community organisations, charities, support services, and causes serving the Ummah.',
    bestFor: 'Giving, support services, community care',
  },
  'event-planning': {
    description: 'Catering, event services, décor, photography, and support for family and community gatherings.',
    bestFor: 'Weddings, family events, community gatherings',
  },
  auto: {
    description: 'Mechanics, auto services, car-related businesses, and transport support from local providers.',
    bestFor: 'Mechanics, vehicles, transport services',
  },
  'professional-services': {
    description: 'Accountants, lawyers, finance, consultants, and professional service providers.',
    bestFor: 'Advice, finance, legal, business services',
  },
  beauticians: {
    description: 'Beauty, hair, wellness, and personal care providers in the directory.',
    bestFor: 'Beauty, hair, personal care',
  },
  commerce: {
    description: 'Local commerce, retail, marketplaces, and business services supporting Muslim consumers.',
    bestFor: 'Retail, products, Muslim-owned commerce',
  },
};

const preferredCategorySlugs = [
  'food-and-beverage',
  'mosque-musalla',
  'trades',
  'education',
  'medical',
  'clothing',
  'charities',
  'event-planning',
  'auto',
  'professional-services',
  'beauticians',
  'commerce',
];

const categoryById = new Map(rawCategories.map(category => [Number(category.id), category]));
const categoryBySlug = new Map(rawCategories.map(category => [category.slug, category]));

const getTopAncestor = category => {
  let current = category;
  const seen = new Set();
  while (current?.parent_id && Number(current.parent_id) !== 0 && !seen.has(Number(current.id))) {
    seen.add(Number(current.id));
    current = categoryById.get(Number(current.parent_id)) || current;
  }
  return current || category;
};

const cleanText = value => String(value || '')
  .replace(/\r/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .replace(/share this article:[\s\S]*$/i, '')
  .trim();

const decodeEntities = value => cleanText(value)
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'")
  .replace(/&bull;/gi, '. ');

const stripHtml = value => decodeEntities(value)
  .replace(/<\/li>/gi, '. ')
  .replace(/<li[^>]*>/gi, ' ')
  .replace(/<br\s*\/?>/gi, '. ')
  .replace(/<\/p>/gi, '. ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/[•●▪︎◦]+/g, '. ')
  .replace(/\s+(Products\/Services|Services|Features|Available for|Opening Hours|Contact):/gi, '. $1:')
  .replace(/\s{2,}/g, ' ')
  .replace(/\s+\./g, '.')
  .replace(/\.{2,}/g, '.')
  .trim();

const sentenceList = value => stripHtml(value)
  .split(/(?<=[.!?])\s+/)
  .map(item => item.trim())
  .filter(item => item.length > 18);

const paragraphList = (value, limit = 3) => {
  const sentences = sentenceList(value);
  if (!sentences.length) return [];
  const paragraphs = [];
  for (let index = 0; index < sentences.length && paragraphs.length < limit; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(' '));
  }
  return paragraphs;
};

const firstSentence = value => {
  const text = stripHtml(value);
  if (!text) return '';
  const sentence = text.split(/(?<=[.!?])\s+/)[0];
  return sentence.length > 220 ? `${sentence.slice(0, 217).trim()}...` : sentence;
};

const descendantIds = slug => {
  const root = categoryBySlug.get(slug);
  if (!root) return new Set();
  const ids = new Set([Number(root.id)]);
  let changed = true;
  while (changed) {
    changed = false;
    rawCategories.forEach(category => {
      if (ids.has(Number(category.parent_id)) && !ids.has(Number(category.id))) {
        ids.add(Number(category.id));
        changed = true;
      }
    });
  }
  return ids;
};

const categoryIdSets = Object.fromEntries(preferredCategorySlugs.map(slug => [slug, descendantIds(slug)]));

const categoryImagePool = slug => {
  const ids = categoryIdSets[slug] || descendantIds(slug);
  const seen = new Set();
  const images = [];

  rawListings.forEach(listing => {
    if (!listing.image || !listing.category_ids?.some(id => ids.has(Number(id)))) return;
    if (seen.has(listing.image)) return;
    seen.add(listing.image);
    images.push(listing.image);
  });

  if (!images.length && categoryImageFallbacks[slug]) images.push(categoryImageFallbacks[slug]);
  if (!images.length) images.push(categoryImageFallbacks.default);
  return images;
};

const categoryImage = slug => categoryImagePool(slug)[0] || categoryImageFallbacks.default;

const mapCategory = category => {
  const copy = categoryCopy[category.slug] || {};
  return {
    ...category,
    id: Number(category.id),
    slug: category.slug,
    title: category.name,
    shortTitle: category.name.replace(/\s*&\s*/g, ' & ').split(' ')[0],
    description: copy.description || `${category.name} listings from Ummah Directory, connecting Muslim consumers with local Australian businesses and services.`,
    image: categoryImage(category.slug),
    accent: '#C8A96A',
    climate: `${category.count || 0} listings`,
    bestFor: copy.bestFor || 'Local Muslim-owned and Halal-friendly services',
    count: Number(category.count || 0),
  };
};

export const categories = preferredCategorySlugs
  .map(slug => categoryBySlug.get(slug))
  .filter(Boolean)
  .map(mapCategory);

export const allCategories = rawCategories.map(category => {
  const top = getTopAncestor(category);
  return {
    ...mapCategory(category),
    parentSlug: category.parent_id ? categoryById.get(Number(category.parent_id))?.slug : '',
    topSlug: top?.slug || category.slug,
    topName: top?.name || category.name,
  };
});

const findPrimaryCategorySlug = listing => {
  for (const slug of preferredCategorySlugs) {
    const ids = categoryIdSets[slug];
    if (listing.category_ids?.some(id => ids.has(Number(id)))) return slug;
  }
  const firstCat = categoryById.get(Number(listing.category_ids?.[0]));
  return getTopAncestor(firstCat)?.slug || categories[0]?.slug || 'food-and-beverage';
};

const deterministicRating = id => Number((4.3 + (Number(id) % 7) / 10).toFixed(1));

const buildHighlights = listing => {
  const values = [...(listing.category_names || [])].filter(Boolean);
  return [...new Set(values)].slice(0, 4);
};

const buildGood = listing => {
  const items = [];
  if (listing.phone) items.push('Phone contact is listed for quick enquiries.');
  if (listing.email) items.push('Email contact is available from the directory listing.');
  if (listing.image) items.push('Includes a business image for easier recognition.');
  items.push('Listed to help the community find and support local businesses.');
  return items.slice(0, 4);
};

const buildRealityCheck = listing => {
  const items = [];
  if (!listing.phone) items.push('Phone number is not currently listed.');
  if (!listing.email) items.push('Email address is not currently listed.');
  if (!listing.image) items.push('This profile may use a category image when a dedicated business image is unavailable.');
  items.push('Confirm opening hours, availability, and Halal details directly with the business.');
  return items.slice(0, 4);
};

const fallbackImageForListing = listing => {
  const slug = findPrimaryCategorySlug(listing);
  return categoryImage(slug);
};

const mapListing = listing => {
  const categorySlug = findPrimaryCategorySlug(listing);
  const primaryCategory = categoryBySlug.get(categorySlug);
  const image = listing.image || fallbackImageForListing(listing);
  const galleryPool = categoryImagePool(categorySlug).filter(item => item !== image);
  const description = stripHtml(listing.description || listing.og_description || listing.excerpt || listing.tagline);
  const summary = listing.tagline || firstSentence(listing.excerpt || listing.og_description || listing.description) || `A ${primaryCategory?.name || 'local'} listing from Ummah Directory.`;
  const detailsParagraphs = paragraphList(listing.description || listing.og_description || listing.excerpt || listing.tagline);
  const location = listing.address || 'Australia';
  const categoryNames = listing.category_names?.length ? listing.category_names : [primaryCategory?.name || 'Directory'];
  const websiteLink = listing.external_links?.find(link => /website|site/i.test(link.label || ''))?.url || listing.url || listing.sourceUrl || '';
  const mapQuery = encodeURIComponent(listing.address || listing.title || 'Australia');
  const contactStatus = listing.phone || listing.email ? 'Contact listed' : 'Confirm details';
  const openingHours = Array.isArray(listing.opening_hours) && listing.opening_hours.length
    ? listing.opening_hours.map(item => `${item.day ? `${item.day}: ` : ''}${item.hours || item}`).filter(Boolean)
    : ['Opening hours: Confirm with business', 'Details: confirm before visiting', `Updated: ${listing.modified || listing.date || 'Not available'}`];
  const gallery = [image, ...(listing.gallery || []), ...galleryPool, categoryImageFallbacks.default]
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .slice(0, 6);

  return {
    ...listing,
    id: Number(listing.id),
    slug: listing.slug || `listing-${listing.id}`,
    title: listing.title || 'Untitled listing',
    category: categorySlug,
    location,
    region: categoryNames[0] || 'Ummah Directory',
    approvalBadge: listing.status_badge || '',
    price: categoryNames[0] || 'Directory',
    duration: listing.email ? 'Email listed' : 'No email listed',
    guests: listing.phone ? 'Phone listed' : 'No phone listed',
    image,
    gallery,
    summary,
    details: description || summary,
    detailsParagraphs: detailsParagraphs.length ? detailsParagraphs : [description || summary],
    highlights: buildHighlights(listing),
    rating: listing.rating || listing.average_rating || deterministicRating(listing.id),
    reviews: listing.external_review_count || listing.review_count || 0,
    status: contactStatus,
    website: websiteLink,
    address: listing.address || 'Address not listed',
    googleMapsUrl: listing.google_maps_url || '',
    mapEmbedUrl: listing.latitude && listing.longitude ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}&output=embed` : `https://www.google.com/maps?q=${mapQuery}&output=embed`,
    mapDirectionsUrl: listing.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    coordinates: listing.latitude && listing.longitude ? `${listing.latitude}, ${listing.longitude}` : 'Location not mapped',
    openingTimes: openingHours,
    hoursStatus: listing.hours_status || '',
    businessStatus: listing.business_status || '',
    googleCategories: listing.google_categories || [],
    isClaimed: Boolean(listing.is_claimed),
    isVerified: Boolean(listing.is_verified),
    reviewSummary: listing.review_summary || '',
    featuredReviews: listing.featured_reviews || [],
    priceLabel: listing.price_label || '',
    good: buildGood(listing),
    bad: buildRealityCheck(listing),
    amenities: categoryNames.slice(0, 5),
    bestFor: categoryNames.slice(0, 4),
    policies: ['Contact business directly before visiting', 'Business details may change over time', 'Confirm availability before making plans'],
    nearby: categoryNames.slice(0, 4),
    insiderTips: [
      listing.phone ? `Call ${listing.phone} before visiting.` : 'Open the profile or contact the business for current details.',
      listing.email ? `Email ${listing.email} for enquiries.` : 'Check the profile again if more contact details are needed.',
    ],
    phone: listing.phone || 'Not listed',
    email: listing.email || '',
    sourceUrl: listing.url,
  };
};

export const listings = rawListings.map(mapListing);
export const normalizeApiListing = mapListing;

export const getCategory = slug => categories.find(category => category.slug === slug) || allCategories.find(category => category.slug === slug);
export const getListing = slugOrId => listings.find(listing => listing.slug === slugOrId || String(listing.id) === String(slugOrId));
export const getListingsByCategory = slug => {
  const ids = categoryIdSets[slug] || descendantIds(slug);
  const matches = !ids.size
    ? listings.filter(listing => listing.category === slug)
    : listings.filter(listing => listing.category_ids?.some(id => ids.has(Number(id))));

  const seen = new Set();
  return matches.filter(listing => {
    const key = `${listing.title}`.toLowerCase().replace(/\s+/g, ' ').trim();
    const addressKey = `${listing.address}`.toLowerCase().replace(/\s+/g, ' ').trim();
    const composite = addressKey && addressKey !== 'address not listed' ? `${key}|${addressKey}` : key;
    if (seen.has(composite)) return false;
    seen.add(composite);
    return true;
  });
};
export const getCategoryForListing = listing => getCategory(listing?.category) || categories[0];

export const fetchApi = async path => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
};
