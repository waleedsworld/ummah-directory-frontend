import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';

const API_BASE_URL = 'https://aitest.techrealm.online';

const inputClass = 'w-full border border-[#1F3E3D]/18 bg-[#F8F4EC] px-3 py-3 text-sm outline-none focus:border-[#9B7C43]';

const ListingMini = ({ listing }) => (
  <a href={`/listing/${listing.slug || listing.id}`} className="block border border-[#1F3E3D]/12 bg-[#F8F4EC] p-3 hover:border-[#9B7C43]">
    <div className="text-sm font-medium text-[#1F3E3D]">{listing.title}</div>
    <div className="mt-1 text-xs text-[#1F3E3D]/58">{listing.address || listing.category_names?.join(', ')}</div>
  </a>
);

const ProfilePage = ({ username: routeUsername }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', display_name: '' });
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('ummahUser') || routeUsername || '');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const username = routeUsername || currentUser;
    if (!username) return;
    fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(username)}`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('profile not found')))
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [currentUser, routeUsername]);

  const visitedByState = useMemo(() => {
    const groups = new Map();
    (profile?.visited || []).forEach(listing => {
      const state = `${listing.address || 'Australia'}`.match(/\b(VIC|NSW|QLD|SA|WA|TAS|ACT|NT)\b/)?.[1] || 'AU';
      groups.set(state, (groups.get(state) || 0) + 1);
    });
    return [...groups.entries()];
  }, [profile]);

  const submit = async event => {
    event.preventDefault();
    setMessage('');
    const endpoint = mode === 'login' ? '/api/users/login' : '/api/users/register';
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not continue');
      localStorage.setItem('ummahUser', data.user.username);
      setCurrentUser(data.user.username);
      setMessage(mode === 'login' ? 'Signed in.' : 'Profile created.');
    } catch (error) {
      setMessage(error.message || 'Could not continue');
    }
  };

  const logout = () => {
    localStorage.removeItem('ummahUser');
    setCurrentUser('');
    setProfile(null);
  };

  if (!currentUser && !routeUsername) {
    return (
      <div className="min-h-screen bg-[#EFE9DE] text-[#1F3E3D]">
        <main className="mx-auto grid max-w-5xl gap-8 px-6 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-12">
          <section>
            <a href="/" className="font-serifDisplay text-4xl font-light">Ummah Directory</a>
            <h1 className="mt-10 font-serifDisplay text-6xl font-light leading-none">Create your local profile.</h1>
            <p className="mt-6 leading-8 text-[#1F3E3D]/68">Like listings, mark places as visited, leave comments, and build a public community trail of the businesses and places you have checked out.</p>
          </section>
          <form onSubmit={submit} className="border border-[#1F3E3D]/14 bg-[#F8F4EC] p-6">
            <div className="mb-5 flex gap-3 text-sm">
              <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? 'border-b border-[#1F3E3D] pb-1' : 'text-[#1F3E3D]/55'}>Login</button>
              <button type="button" onClick={() => setMode('register')} className={mode === 'register' ? 'border-b border-[#1F3E3D] pb-1' : 'text-[#1F3E3D]/55'}>Register</button>
            </div>
            <div className="space-y-4">
              <input className={inputClass} placeholder="Username" value={form.username} onChange={event => setForm({ ...form, username: event.target.value })} />
              {mode === 'register' && <input className={inputClass} placeholder="Display name" value={form.display_name} onChange={event => setForm({ ...form, display_name: event.target.value })} />}
              <input className={inputClass} placeholder="Password" type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} />
              <button className="w-full bg-[#1F3E3D] px-4 py-3 text-sm text-white">{mode === 'login' ? 'Login' : 'Create profile'}</button>
              <p className="text-sm text-[#1F3E3D]/60">{message}</p>
            </div>
          </form>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFE9DE] text-[#1F3E3D]">
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-12">
        <div className="flex items-start justify-between border-b border-[#1F3E3D]/14 pb-6">
          <a href="/" className="font-serifDisplay text-4xl font-light">Ummah Directory</a>
          {!routeUsername && <button onClick={logout} className="border border-[#1F3E3D]/18 px-4 py-2 text-sm">Logout</button>}
        </div>

        <section className="grid gap-8 py-10 lg:grid-cols-[360px_1fr]">
          <aside className="border border-[#1F3E3D]/14 bg-[#F8F4EC] p-6">
            <h1 className="font-serifDisplay text-5xl font-light">{profile?.user?.display_name || currentUser}</h1>
            <p className="mt-3 text-sm text-[#1F3E3D]/60">@{profile?.user?.username || currentUser}</p>
            {!routeUsername && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <a href="/manage-listings" className="bg-[#1F3E3D] px-4 py-3 text-center text-sm text-white">Manage listings</a>
                <a href="/add-listing" className="border border-[#1F3E3D]/18 px-4 py-3 text-center text-sm text-[#1F3E3D]">Add listing</a>
              </div>
            )}
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                ['Visited', profile?.stats?.visited || 0],
                ['Liked', profile?.stats?.liked || 0],
                ['Comments', profile?.stats?.comments || 0],
                ['Created', profile?.stats?.created_listings || 0],
              ].map(([label, value]) => (
                <div key={label} className="border border-[#1F3E3D]/12 p-4">
                  <div className="font-serifDisplay text-4xl">{value}</div>
                  <div className="text-xs text-[#1F3E3D]/55">{label}</div>
                </div>
              ))}
            </div>
          </aside>

          <section className="space-y-8">
            <div className="border border-[#1F3E3D]/14 bg-[#F8F4EC] p-6">
              <h2 className="font-serifDisplay text-4xl font-light">Visited map</h2>
              <div className="mt-5 grid min-h-64 grid-cols-4 gap-2 bg-[#E7DED0] p-4 md:grid-cols-8">
                {['WA', 'NT', 'SA', 'QLD', 'NSW', 'ACT', 'VIC', 'TAS'].map(state => {
                  const count = visitedByState.find(([key]) => key === state)?.[1] || 0;
                  return (
                    <div key={state} className={`flex min-h-20 flex-col justify-between border p-3 ${count ? 'border-[#9B7C43] bg-[#C8A96A]/30' : 'border-[#1F3E3D]/10 bg-[#F8F4EC]'}`}>
                      <span className="text-sm">{state}</span>
                      <span className="font-serifDisplay text-3xl">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 font-serifDisplay text-3xl font-light">Visited listings</h2>
                <div className="space-y-2">{(profile?.visited || []).slice(0, 8).map(listing => <ListingMini key={listing.id} listing={listing} />)}</div>
              </div>
              <div>
                <h2 className="mb-3 font-serifDisplay text-3xl font-light">Liked listings</h2>
                <div className="space-y-2">{(profile?.liked || []).slice(0, 8).map(listing => <ListingMini key={listing.id} listing={listing} />)}</div>
              </div>
            </div>

            <div className="border border-[#1F3E3D]/14 bg-[#F8F4EC] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-serifDisplay text-3xl font-light">Created listings</h2>
                  <p className="mt-1 text-sm text-[#1F3E3D]/58">Listings created from this profile.</p>
                </div>
                {!routeUsername && <a href="/manage-listings" className="w-fit border border-[#1F3E3D]/18 px-4 py-2 text-sm">Manage listings</a>}
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {(profile?.created_listings || []).slice(0, 6).map(listing => <ListingMini key={listing.id} listing={listing} />)}
                {(profile?.created_listings || []).length === 0 && (
                  <p className="text-sm text-[#1F3E3D]/60">No created listings yet.</p>
                )}
              </div>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
