import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import { allCategories } from '../data/travelData';
import SafeImage from '../components/SafeImage';

const API_BASE_URL = 'https://aitest.techrealm.online';

const emptyForm = {
  title: '',
  status_badge: 'Local Listing',
  tagline: '',
  address: '',
  email: '',
  phone: '',
  description: '',
  image: '',
  gallery: [],
  website: '',
  google_maps_url: '',
  rating: '',
  external_review_count: '',
  opening_hours: [],
  hours_status: '',
  business_status: '',
  latitude: '',
  longitude: '',
  place_id: '',
  google_categories: [],
  is_claimed: false,
  is_verified: false,
  review_summary: '',
  featured_reviews: [],
  service_options: {},
  price_label: '',
  google_place: {},
  category_ids: [],
  category_names: [],
  is_featured: false,
  is_hidden: false,
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm text-[#1F3E3D]/70">{label}</span>
    {children}
  </label>
);

const inputClass = 'w-full border border-[#1F3E3D]/18 bg-[#F8F4EC] px-3 py-3 text-sm text-[#1F3E3D] outline-none transition-colors focus:border-[#9B7C43]';

const enrichmentSteps = [
  'Starting live place lookup',
  'Checking likely business matches',
  'Reading public address and contact fields',
  'Collecting hours, rating, photos, and map details',
  'Matching the best local category',
  'Writing a clean directory description',
  'Preparing the editable listing form',
];

const DraftProgressOverlay = ({ active, stepIndex, usePlaces }) => {
  if (!active) return null;

  const currentStep = enrichmentSteps[stepIndex % enrichmentSteps.length];
  const visibleSteps = enrichmentSteps.slice(0, Math.min(stepIndex + 1, enrichmentSteps.length));
  const progress = Math.min(92, 18 + stepIndex * 12);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#151B18]/68 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-[#1F3E3D]/18 bg-[#F8F4EC] text-[#1F3E3D] shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
        <div className="border-b border-[#1F3E3D]/12 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serifDisplay text-3xl font-light">Building the listing</h2>
              <p className="mt-2 text-sm leading-6 text-[#1F3E3D]/66">
                {usePlaces
                  ? 'Live Google Maps enrichment can take a moment. Keep this open while we gather the richer fields.'
                  : 'Drafting copy and category details from the information you entered.'}
              </p>
            </div>
            <div className="mt-1 h-9 w-9 shrink-0 border border-[#1F3E3D]/16 bg-[#EFE9DE]">
              <div className="h-full w-full animate-pulse bg-[#C8A96A]"></div>
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="mb-4 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium">{currentStep}</span>
            <span className="text-[#1F3E3D]/52">usually 20-60s</span>
          </div>
          <div className="h-2 bg-[#1F3E3D]/10">
            <div
              className="h-full bg-[#9B7C43] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="mt-5 space-y-3">
            {visibleSteps.map((step, index) => {
              const isCurrent = index === visibleSteps.length - 1;
              return (
                <div key={step} className="flex items-center gap-3 text-sm">
                  <span className={`h-2.5 w-2.5 shrink-0 ${isCurrent ? 'animate-pulse bg-[#9B7C43]' : 'bg-[#1F3E3D]'}`}></span>
                  <span className={isCurrent ? 'text-[#1F3E3D]' : 'text-[#1F3E3D]/58'}>{step}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-5 border-t border-[#1F3E3D]/12 pt-4 text-xs leading-5 text-[#1F3E3D]/58">
            We will open the editable form as soon as the draft returns. If the place lookup times out, the page will still keep any AI copy it can generate.
          </p>
        </div>
      </div>
    </div>
  );
};

const AddListingPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState(allCategories);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLocation, setAiLocation] = useState('Australia');
  const [usePlaces, setUsePlaces] = useState(true);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [created, setCreated] = useState(null);
  const [aiStatus, setAiStatus] = useState({ groq: false, apify: false });
  const [draftStep, setDraftStep] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('categories unavailable')))
      .then(data => setCategories(data.data || allCategories))
      .catch(() => setCategories(allCategories));
    fetch(`${API_BASE_URL}/api/ai/status`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('AI status unavailable')))
      .then(setAiStatus)
      .catch(() => setAiStatus({ groq: false, apify: false }));
  }, []);

  useEffect(() => {
    if (!loadingDraft) {
      setDraftStep(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setDraftStep(current => Math.min(current + 1, enrichmentSteps.length - 1));
    }, 2400);

    return () => window.clearInterval(interval);
  }, [loadingDraft]);

  const selectedCategory = useMemo(() => {
    const id = Number(form.category_ids[0]);
    return categories.find(category => Number(category.id) === id);
  }, [categories, form.category_ids]);

  const update = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const applyDraft = draft => {
    const website = draft.external_links?.find(link => /website/i.test(link.label || ''))?.url || '';
    setForm(current => ({
      ...current,
      ...draft,
      website,
      status_badge: draft.status_badge || 'Local Listing',
      category_ids: draft.category_ids || [],
      category_names: draft.category_names || [],
      gallery: draft.gallery || [],
      opening_hours: draft.opening_hours || [],
      google_categories: draft.google_categories || [],
      featured_reviews: draft.featured_reviews || [],
      service_options: draft.service_options || {},
      google_place: draft.google_place || {},
      rating: draft.rating ?? '',
      external_review_count: draft.external_review_count ?? '',
      latitude: draft.latitude ?? '',
      longitude: draft.longitude ?? '',
    }));
  };

  const draftWithAi = async () => {
    setLoadingDraft(true);
    setDraftStep(0);
    setMessage('');
    setCreated(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/listing-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiQuery || form.title,
          location: aiLocation,
          use_places: usePlaces,
          max_results: 3,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not draft listing');
      applyDraft(data.draft);
      const modeNote = data.ai_mode === 'groq'
        ? 'Groq polished the draft.'
        : data.ai_mode === 'rate-limited'
          ? data.ai_error
          : 'Groq is not connected, so this used local fallback copy.';
      const placeNote = data.place_mode === 'apify' ? ' Apify place data was found and rich fields were added.' : data.place_error ? ` Place lookup failed: ${data.place_error}` : data.place_mode === 'missing-token' ? ' Add APIFY_TOKEN to enable live Google Maps lookup.' : '';
      setMessage(`Draft filled. ${modeNote}${placeNote} Review it before publishing.`);
    } catch (error) {
      setMessage(error.message || 'Could not draft listing');
    } finally {
      setLoadingDraft(false);
    }
  };

  const submit = async event => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setCreated(null);
    const externalLinks = form.website ? [{ label: 'Website', url: form.website }] : [];
    const username = localStorage.getItem('ummahUser') || '';
    const payload = {
      ...form,
      external_links: externalLinks,
      category_names: selectedCategory ? [selectedCategory.name] : form.category_names,
      created_by: username,
      gallery: form.gallery,
      opening_hours: form.opening_hours,
      google_categories: form.google_categories,
      featured_reviews: form.featured_reviews,
      service_options: form.service_options,
      google_place: form.google_place,
      google_maps_url: form.google_maps_url,
      rating: form.rating,
      external_review_count: form.external_review_count,
      hours_status: form.hours_status,
      business_status: form.business_status,
      latitude: form.latitude,
      longitude: form.longitude,
      place_id: form.place_id,
      is_claimed: form.is_claimed,
      is_verified: form.is_verified,
      review_summary: form.review_summary,
      price_label: form.price_label,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.join(', ') || data.error || 'Could not create listing');
      setCreated(data);
      setMessage('Listing added.');
    } catch (error) {
      setMessage(error.message || 'Could not create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFE9DE] text-[#1F3E3D]">
      <header className="border-b border-[#1F3E3D]/12 px-6 py-5 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="font-serifDisplay text-3xl font-light">Ummah Directory</a>
          <nav className="flex items-center gap-5 text-sm text-[#1F3E3D]/70">
            <a href="/" className="hover:text-[#1F3E3D]">Home</a>
            <a href="/search" className="hover:text-[#1F3E3D]">Search</a>
            <a href="/about" className="hover:text-[#1F3E3D]">About</a>
          </nav>
        </div>
      </header>

      <main className="px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="h-fit border border-[#1F3E3D]/14 bg-[#F8F4EC] p-6 lg:sticky lg:top-6">
            <h1 className="font-serifDisplay text-4xl font-light">Add a listing</h1>
            <p className="mt-4 text-sm leading-7 text-[#1F3E3D]/66">
              Add the business details directly, or start with AI to draft the profile from a business name and location.
            </p>

            <div className="mt-7 space-y-4 border-t border-[#1F3E3D]/12 pt-6">
              <Field label="Business name or search query">
                <input className={inputClass} value={aiQuery} onChange={event => setAiQuery(event.target.value)} placeholder="ZUHD store, halal butcher, barber..." />
              </Field>
              <Field label="Location">
                <input className={inputClass} value={aiLocation} onChange={event => setAiLocation(event.target.value)} placeholder="Melbourne VIC" />
              </Field>
              <label className="flex items-center gap-3 text-sm text-[#1F3E3D]/72">
                <input type="checkbox" checked={usePlaces} onChange={event => setUsePlaces(event.target.checked)} />
                Use Google Maps place lookup when available
              </label>
              <div className="border border-[#1F3E3D]/12 bg-[#EFE9DE] p-3 text-xs leading-5 text-[#1F3E3D]/66">
                Groq copy: {aiStatus.groq ? 'connected' : 'not connected'} · Apify place lookup: {aiStatus.apify ? 'connected' : 'missing APIFY_TOKEN'}
              </div>
              <button
                type="button"
                onClick={draftWithAi}
                disabled={loadingDraft || (!aiQuery && !form.title)}
                className="w-full bg-[#1F3E3D] px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingDraft ? 'Drafting listing...' : 'Autofill with AI'}
              </button>
              {loadingDraft && (
                <div className="border border-[#1F3E3D]/12 bg-[#EFE9DE] p-3 text-sm leading-6 text-[#1F3E3D]/64">
                  Live enrichment is running. A progress window will stay open until the editable draft is ready.
                </div>
              )}
            </div>
          </aside>

          <section className="border border-[#1F3E3D]/14 bg-[#F8F4EC] p-6 md:p-8">
            <form onSubmit={submit} className="space-y-7">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Business name">
                  <input className={inputClass} required value={form.title} onChange={event => update('title', event.target.value)} />
                </Field>
                <Field label="Category">
                  <select
                    className={inputClass}
                    value={form.category_ids[0] || ''}
                    onChange={event => update('category_ids', event.target.value ? [Number(event.target.value)] : [])}
                  >
                    <option value="">Choose category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Short summary">
                <input className={inputClass} value={form.tagline} onChange={event => update('tagline', event.target.value)} />
              </Field>

              <Field label="Description">
                <textarea className={`${inputClass} min-h-40`} value={form.description} onChange={event => update('description', event.target.value)} />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Address">
                  <input className={inputClass} value={form.address} onChange={event => update('address', event.target.value)} />
                </Field>
                <Field label="Phone">
                  <input className={inputClass} value={form.phone} onChange={event => update('phone', event.target.value)} />
                </Field>
                <Field label="Email">
                  <input className={inputClass} type="email" value={form.email} onChange={event => update('email', event.target.value)} />
                </Field>
                <Field label="Website">
                  <input className={inputClass} value={form.website} onChange={event => update('website', event.target.value)} />
                </Field>
              </div>

              <Field label="Image URL">
                <input className={inputClass} value={form.image} onChange={event => update('image', event.target.value)} />
              </Field>

              {form.image && (
                <figure className="h-72 overflow-hidden bg-[#1F3E3D]">
                  <SafeImage src={form.image} alt={form.title || 'Listing preview'} className="h-full w-full object-cover" />
                </figure>
              )}

              <section className="border-t border-[#1F3E3D]/12 pt-7">
                <h2 className="font-serifDisplay text-3xl font-light">Place data</h2>
                <p className="mt-2 text-sm leading-6 text-[#1F3E3D]/62">
                  These fields are filled from Apify Google Maps lookup when `APIFY_TOKEN` is configured.
                </p>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Google Maps URL">
                    <input className={inputClass} value={form.google_maps_url} onChange={event => update('google_maps_url', event.target.value)} />
                  </Field>
                  <Field label="Hours status">
                    <input className={inputClass} value={form.hours_status} onChange={event => update('hours_status', event.target.value)} />
                  </Field>
                  <Field label="Rating">
                    <input className={inputClass} value={form.rating} onChange={event => update('rating', event.target.value)} />
                  </Field>
                  <Field label="Review count">
                    <input className={inputClass} value={form.external_review_count} onChange={event => update('external_review_count', event.target.value)} />
                  </Field>
                  <Field label="Latitude">
                    <input className={inputClass} value={form.latitude} onChange={event => update('latitude', event.target.value)} />
                  </Field>
                  <Field label="Longitude">
                    <input className={inputClass} value={form.longitude} onChange={event => update('longitude', event.target.value)} />
                  </Field>
                  <Field label="Business status">
                    <input className={inputClass} value={form.business_status} onChange={event => update('business_status', event.target.value)} />
                  </Field>
                  <Field label="Place ID">
                    <input className={inputClass} value={form.place_id} onChange={event => update('place_id', event.target.value)} />
                  </Field>
                </div>

                {form.opening_hours?.length > 0 && (
                  <div className="mt-5 border border-[#1F3E3D]/12">
                    {form.opening_hours.map(item => (
                      <div key={`${item.day}-${item.hours}`} className="flex justify-between gap-4 border-b border-[#1F3E3D]/10 px-4 py-3 text-sm last:border-b-0">
                        <span className="text-[#1F3E3D]/58">{item.day || 'Hours'}</span>
                        <span className="text-right">{item.hours || item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Google categories">
                    <textarea className={`${inputClass} min-h-24`} value={(form.google_categories || []).join('\n')} onChange={event => update('google_categories', event.target.value.split('\n').map(item => item.trim()).filter(Boolean))} />
                  </Field>
                  <Field label="Review summary">
                    <textarea className={`${inputClass} min-h-24`} value={form.review_summary} onChange={event => update('review_summary', event.target.value)} />
                  </Field>
                </div>

                <div className="mt-5 flex flex-wrap gap-5 text-sm text-[#1F3E3D]/72">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_claimed} onChange={event => update('is_claimed', event.target.checked)} />
                    Claimed on Google
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_verified} onChange={event => update('is_verified', event.target.checked)} />
                    Verified on Google
                  </label>
                </div>
              </section>

              <div className="flex flex-col gap-3 border-t border-[#1F3E3D]/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-[#1F3E3D]/66">{message}</div>
                <button type="submit" disabled={submitting} className="bg-[#9B7C43] px-5 py-3 text-sm text-white disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add listing'}
                </button>
              </div>

              {created && (
                <div className="border border-[#1F3E3D]/14 bg-[#EFE9DE] p-5 text-sm text-[#1F3E3D]/74">
                  <p className="font-medium text-[#1F3E3D]">{created.title} is now in the local directory.</p>
                  <a className="mt-2 inline-block border-b border-[#1F3E3D]/30 pb-1" href={`/listing/${created.slug}`}>Open listing page</a>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>

      <DraftProgressOverlay active={loadingDraft} stepIndex={draftStep} usePlaces={usePlaces} />
      <Footer />
    </div>
  );
};

export default AddListingPage;
