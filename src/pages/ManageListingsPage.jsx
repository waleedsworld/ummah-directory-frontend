import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import SafeImage from '../components/SafeImage';
import { allCategories } from '../data/travelData';

const API_BASE_URL = 'https://aitest.techrealm.online';

const inputClass = 'w-full border border-[#1F3E3D]/18 bg-[#F8F4EC] px-3 py-3 text-sm text-[#1F3E3D] outline-none transition-colors focus:border-[#9B7C43]';

const emptyEdit = {
  id: '',
  title: '',
  tagline: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  image: '',
  gallery: [],
  category_ids: [],
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
  is_hidden: false,
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm text-[#1F3E3D]/68">{label}</span>
    {children}
  </label>
);

const ManageListingsPage = () => {
  const [username] = useState(() => localStorage.getItem('ummahUser') || '');
  const [categories, setCategories] = useState(allCategories);
  const [listings, setListings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [form, setForm] = useState(emptyEdit);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeListing = useMemo(
    () => listings.find(listing => String(listing.id) === String(activeId)),
    [activeId, listings],
  );

  const loadListings = () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE_URL}/api/listings?created_by=${encodeURIComponent(username)}&include_hidden=1&per_page=200&sort=updated`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Could not load listings')))
      .then(data => {
        const items = data.data || [];
        setListings(items);
        const first = items[0];
        if (first && !activeId) setActiveId(String(first.id));
      })
      .catch(error => setMessage(error.message || 'Could not load listings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('categories unavailable')))
      .then(data => setCategories(data.data || allCategories))
      .catch(() => setCategories(allCategories));
  }, []);

  useEffect(() => {
    loadListings();
  }, [username]);

  useEffect(() => {
    if (!activeListing) {
      setForm(emptyEdit);
      return;
    }
    const website = activeListing.external_links?.find(link => /website/i.test(link.label || ''))?.url || '';
    setForm({
      id: activeListing.id,
      title: activeListing.title || '',
      tagline: activeListing.tagline || '',
      description: activeListing.description || '',
      address: activeListing.address || '',
      phone: activeListing.phone || '',
      email: activeListing.email || '',
      website,
      image: activeListing.image || '',
      gallery: activeListing.gallery || [],
      category_ids: activeListing.category_ids || [],
      google_maps_url: activeListing.google_maps_url || '',
      rating: activeListing.rating ?? '',
      external_review_count: activeListing.external_review_count ?? '',
      opening_hours: activeListing.opening_hours || [],
      hours_status: activeListing.hours_status || '',
      business_status: activeListing.business_status || '',
      latitude: activeListing.latitude ?? '',
      longitude: activeListing.longitude ?? '',
      place_id: activeListing.place_id || '',
      google_categories: activeListing.google_categories || [],
      is_claimed: Boolean(activeListing.is_claimed),
      is_verified: Boolean(activeListing.is_verified),
      review_summary: activeListing.review_summary || '',
      featured_reviews: activeListing.featured_reviews || [],
      service_options: activeListing.service_options || {},
      price_label: activeListing.price_label || '',
      google_place: activeListing.google_place || {},
      is_hidden: Boolean(activeListing.is_hidden),
    });
  }, [activeListing]);

  const update = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const selectedCategory = useMemo(() => {
    const id = Number(form.category_ids?.[0]);
    return categories.find(category => Number(category.id) === id);
  }, [categories, form.category_ids]);

  const save = async event => {
    event.preventDefault();
    if (!form.id) return;
    setSaving(true);
    setMessage('');
    const payload = {
      title: form.title,
      tagline: form.tagline,
      description: form.description,
      address: form.address,
      phone: form.phone,
      email: form.email,
      image: form.image,
      category_ids: form.category_ids,
      category_names: selectedCategory ? [selectedCategory.name] : activeListing?.category_names || [],
      external_links: form.website ? [{ label: 'Website', url: form.website }] : [],
      is_hidden: form.is_hidden,
      created_by: username,
      gallery: form.gallery,
      google_maps_url: form.google_maps_url,
      rating: form.rating,
      external_review_count: form.external_review_count,
      opening_hours: form.opening_hours,
      hours_status: form.hours_status,
      business_status: form.business_status,
      latitude: form.latitude,
      longitude: form.longitude,
      place_id: form.place_id,
      google_categories: form.google_categories,
      is_claimed: form.is_claimed,
      is_verified: form.is_verified,
      review_summary: form.review_summary,
      featured_reviews: form.featured_reviews,
      service_options: form.service_options,
      price_label: form.price_label,
      google_place: form.google_place,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/listings/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save listing');
      setListings(current => current.map(item => String(item.id) === String(form.id) ? data : item));
      setMessage('Listing updated.');
    } catch (error) {
      setMessage(error.message || 'Could not save listing');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!form.id) return;
    const ok = window.confirm('Delete this listing from the local directory?');
    if (!ok) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/listings/${form.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete listing');
      const next = listings.filter(item => String(item.id) !== String(form.id));
      setListings(next);
      setActiveId(next[0] ? String(next[0].id) : '');
      setMessage('Listing deleted.');
    } catch (error) {
      setMessage(error.message || 'Could not delete listing');
    } finally {
      setSaving(false);
    }
  };

  if (!username) {
    return (
      <div className="min-h-screen bg-[#EFE9DE] text-[#1F3E3D]">
        <main className="mx-auto max-w-3xl px-6 py-16 md:px-12">
          <a href="/" className="font-serifDisplay text-4xl font-light">Ummah Directory</a>
          <section className="mt-10 border border-[#1F3E3D]/14 bg-[#F8F4EC] p-7">
            <h1 className="font-serifDisplay text-5xl font-light">Manage listings</h1>
            <p className="mt-4 leading-7 text-[#1F3E3D]/68">Login first, then you can edit, hide, or delete listings created from your profile.</p>
            <a href="/profile" className="mt-6 inline-block bg-[#1F3E3D] px-5 py-3 text-sm text-white">Login or create profile</a>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFE9DE] text-[#1F3E3D]">
      <header className="border-b border-[#1F3E3D]/12 px-6 py-5 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="font-serifDisplay text-3xl font-light">Ummah Directory</a>
          <nav className="flex items-center gap-5 text-sm text-[#1F3E3D]/70">
            <a href="/profile" className="hover:text-[#1F3E3D]">Profile</a>
            <a href="/add-listing" className="hover:text-[#1F3E3D]">Add listing</a>
            <a href="/search" className="hover:text-[#1F3E3D]">Search</a>
          </nav>
        </div>
      </header>

      <main className="px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="h-fit border border-[#1F3E3D]/14 bg-[#F8F4EC] p-5 lg:sticky lg:top-6">
            <div className="flex items-end justify-between gap-4 border-b border-[#1F3E3D]/12 pb-4">
              <div>
                <h1 className="font-serifDisplay text-4xl font-light">Manage listings</h1>
                <p className="mt-1 text-sm text-[#1F3E3D]/58">@{username}</p>
              </div>
              <a href="/add-listing" className="border border-[#1F3E3D]/18 px-3 py-2 text-xs">New</a>
            </div>

            <div className="mt-4 space-y-2">
              {loading && <p className="text-sm text-[#1F3E3D]/60">Loading listings...</p>}
              {!loading && listings.length === 0 && (
                <div className="text-sm leading-6 text-[#1F3E3D]/64">
                  <p>No listings created from this profile yet.</p>
                  <a href="/add-listing" className="mt-3 inline-block border-b border-[#1F3E3D]/30 pb-1">Add your first listing</a>
                </div>
              )}
              {listings.map(listing => (
                <button
                  key={listing.id}
                  type="button"
                  onClick={() => setActiveId(String(listing.id))}
                  className={`block w-full border p-3 text-left transition-colors ${String(activeId) === String(listing.id) ? 'border-[#9B7C43] bg-[#EFE9DE]' : 'border-[#1F3E3D]/10 hover:border-[#1F3E3D]/28'}`}
                >
                  <span className="block text-sm font-medium">{listing.title}</span>
                  <span className="mt-1 block text-xs text-[#1F3E3D]/55">{listing.is_hidden ? 'Hidden' : 'Visible'} · {listing.address || 'No address'}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="border border-[#1F3E3D]/14 bg-[#F8F4EC] p-6 md:p-8">
            {activeListing ? (
              <form onSubmit={save} className="space-y-6">
                <div className="flex flex-col gap-4 border-b border-[#1F3E3D]/12 pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="font-serifDisplay text-5xl font-light">{activeListing.title}</h2>
                    <p className="mt-2 text-sm text-[#1F3E3D]/58">Edit the public listing details.</p>
                  </div>
                  <a href={`/listing/${activeListing.slug || activeListing.id}`} className="w-fit border border-[#1F3E3D]/18 px-4 py-2 text-sm">View page</a>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Business name">
                    <input className={inputClass} value={form.title} onChange={event => update('title', event.target.value)} required />
                  </Field>
                  <Field label="Category">
                    <select
                      className={inputClass}
                      value={form.category_ids?.[0] || ''}
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

                <label className="flex items-center gap-3 border-y border-[#1F3E3D]/12 py-4 text-sm text-[#1F3E3D]/72">
                  <input type="checkbox" checked={form.is_hidden} onChange={event => update('is_hidden', event.target.checked)} />
                  Hide this listing from public directory pages
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#1F3E3D]/64">{message}</p>
                  <div className="flex gap-3">
                    <button type="button" onClick={remove} disabled={saving} className="border border-[#8A2D23]/30 px-5 py-3 text-sm text-[#8A2D23] disabled:opacity-50">Delete</button>
                    <button type="submit" disabled={saving} className="bg-[#1F3E3D] px-5 py-3 text-sm text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="py-16 text-center">
                <h2 className="font-serifDisplay text-5xl font-light">No listing selected</h2>
                <p className="mt-3 text-[#1F3E3D]/62">Choose a listing from the left, or create a new one.</p>
                <a href="/add-listing" className="mt-6 inline-block bg-[#1F3E3D] px-5 py-3 text-sm text-white">Add listing</a>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageListingsPage;
