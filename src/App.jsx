import React from 'react';
import Hero from './components/Hero';
import HiddenGems from './components/HiddenGems';
import LandingAssistantReveal from './components/LandingAssistantReveal';
import PromiseSection from './components/PromiseSection';
import Destinations from './components/Destinations';
import Newsletter from './components/Newsletter';
import Spotlight from './components/Spotlight';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import ListingPage from './pages/ListingPage';
import AddListingPage from './pages/AddListingPage';
import ManageListingsPage from './pages/ManageListingsPage';
import ProfilePage from './pages/ProfilePage';
import ChatbotWidget from './components/ChatbotWidget';
import AppLoader from './components/AppLoader';
import MobileNav from './components/MobileNav';

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const [, type, slug] = path.split('/');
  const isHome = path === '/';

  let page;
  if (type === 'category' && slug) page = <CategoryPage slug={slug} />;
  else if (type === 'listing' && slug) page = <ListingPage slug={slug} />;
  else if (type === 'about') page = <AboutPage />;
  else if (type === 'search') page = <SearchPage />;
  else if (type === 'add-listing') page = <AddListingPage />;
  else if (type === 'manage-listings') page = <ManageListingsPage />;
  else if (type === 'profile') page = <ProfilePage username={slug} />;
  else page = (
    <div className="w-full">
      <Hero />
      <LandingAssistantReveal />
      <HiddenGems />
      <PromiseSection />
      <Destinations />
      <Newsletter />
      <Spotlight />
      <Footer />
    </div>
  );

  const chatContext = type === 'listing' && slug
    ? { type: 'listing', slug }
    : type === 'category' && slug
      ? { type: 'category', slug }
      : { type: isHome ? 'home' : type || 'page', slug: slug || '' };

  return (
    <>
      <AppLoader />
      <MobileNav />
      {!isHome && <div className="h-16 bg-[#EFE9DE] md:hidden"></div>}
      {page}
      <ChatbotWidget pageContext={chatContext} />
    </>
  );
}

export default App;
