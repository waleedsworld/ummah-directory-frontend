import React, { useEffect, useRef, useState } from 'react';

const API_BASE_URL = 'https://aitest.techrealm.online';
const ASSISTANT_CONNECTION_MESSAGE = 'The directory assistant is reconnecting right now. Please try again in a moment.';

const starters = [
  'I am in Coburg and want halal dinner',
  'Find a barber near Melbourne',
  'Where can I pray near Preston?',
  'Any Muslim accountants around me?',
];

const resultIntro = data => {
  const count = data.listings?.length || 0;
  if (data.answer) return data.answer;
  if (!count) return 'Here are the closest matches I found in the directory.';
  return `I found ${count} matching listing${count === 1 ? '' : 's'}. Open a card below for the full profile, contact details, map, and community notes.`;
};

const ListingResultCard = ({ listing }) => (
  <a
    href={`/listing/${listing.slug || listing.id}`}
    className="group grid min-h-32 border border-[#1F3E3D]/12 bg-[#F8F8F8] p-4 transition-colors hover:border-[#C8A96A] hover:bg-white"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-base font-medium leading-6 text-[#1F3E3D]">{listing.title}</div>
        <div className="mt-2 line-clamp-2 text-sm leading-6 text-[#1F3E3D]/62">
          {listing.address || listing.category_names?.join(', ') || 'Directory listing'}
        </div>
      </div>
      <span className="shrink-0 border border-[#1F3E3D]/14 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[#1F3E3D]/70 group-hover:border-[#C8A96A] group-hover:text-[#1F3E3D]">
        Open
      </span>
    </div>
    <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#1F3E3D]/56">
      {listing.phone && <span className="border border-[#1F3E3D]/10 px-2 py-1">Phone listed</span>}
      {listing.email && <span className="border border-[#1F3E3D]/10 px-2 py-1">Email listed</span>}
      {listing.category_names?.[0] && <span className="border border-[#1F3E3D]/10 px-2 py-1">{listing.category_names[0]}</span>}
    </div>
  </a>
);

const LandingAssistantReveal = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const transcriptRef = useRef(null);
  const mobileCardRef = useRef(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'You crossed the door. Ask naturally: “I’m in Preston and need a halal butcher”, “where can I pray near me?”, or “show me Muslim-owned tradies in Melbourne”.',
      listings: [],
    },
  ]);

  useEffect(() => {
    let frameId;
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.18 });
    if (mobileCardRef.current) mobileObserver.observe(mobileCardRef.current);

    const update = () => {
      if (!sectionRef.current || !cardRef.current) return;
      if (window.innerWidth < 768) {
        cardRef.current.style.opacity = '';
        cardRef.current.style.transform = '';
        sectionRef.current.style.setProperty('--gateway-wash', '0.55');
        return;
      }
      const rect = sectionRef.current.getBoundingClientRect();
      const view = window.innerHeight || document.documentElement.clientHeight;
      const raw = (view * 0.58 - rect.top) / (view * 1.55);
      const progress = Math.max(0, Math.min(1, raw));
      const eased = progress * progress * (3 - 2 * progress);
      const startBlank = Math.max(0, Math.min(1, (progress - 0.28) / 0.72));
      const reveal = startBlank * startBlank * (3 - 2 * startBlank);
      cardRef.current.style.opacity = reveal;
      cardRef.current.style.transform = `translate3d(${(-54 + reveal * 54).toFixed(2)}vw, ${(34 - reveal * 34).toFixed(2)}px, 0) rotateY(${(-48 + reveal * 48).toFixed(2)}deg) scale(${(0.88 + reveal * 0.12).toFixed(3)})`;
      sectionRef.current.style.setProperty('--gateway-wash', eased.toFixed(3));
    };

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      mobileObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const ask = async text => {
    const query = text.trim();
    if (!query || loading) return;
    const nextMessages = [...messages, { role: 'user', content: query, listings: [] }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      if (!res.ok && !data.answer) throw new Error(data.error || 'Assistant unavailable');
      setMode(data.mode || '');
      setMessages(current => [...current, {
        role: 'assistant',
        content: resultIntro(data),
        listings: data.listings || [],
      }]);
    } catch (error) {
      setMessages(current => [...current, {
        role: 'assistant',
        content: ASSISTANT_CONNECTION_MESSAGE,
        listings: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const submit = event => {
    event.preventDefault();
    ask(input);
  };

  return (
    <section ref={sectionRef} className="assistant-gateway relative z-20 bg-[#F4F4F5] md:h-[260vh]" style={{ '--gateway-wash': 0 }}>
      <div className="flex min-h-[140vh] items-start justify-center overflow-hidden px-4 pb-16 pt-[42vh] md:sticky md:top-0 md:h-screen md:min-h-0 md:items-center md:px-12 md:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(31,62,61,0.10),transparent_46%)] opacity-[var(--gateway-wash)]"></div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[#1F3E3D]/35"></div>

        <div ref={(node) => { cardRef.current = node; mobileCardRef.current = node; }} className="assistant-flip-card mobile-assistant-card relative w-full max-w-7xl border border-[#1F3E3D]/12 bg-[#ECEFEB] shadow-[0_30px_90px_rgba(31,62,61,0.14)] will-change-transform">
          <div className="grid min-h-[calc(100vh-7rem)] md:min-h-[68vh] lg:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="border-b border-[#1F3E3D]/12 p-4 lg:border-b-0 lg:border-r lg:p-8">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#1F3E3D] text-white md:h-12 md:w-12">
                  <iconify-icon icon="lucide:sparkles" class="h-5 w-5"></iconify-icon>
                </span>
                <div>
                  <div className="font-oswald text-xl uppercase leading-none tracking-tight text-[#1F3E3D] md:text-2xl">Ummah AI Search</div>
                  <div className="mt-1 text-xs text-[#1F3E3D]/58 md:text-sm">Ask the directory in plain English</div>
                  {mode && <div className="mt-1 text-xs text-[#1F3E3D]/42">{mode === 'groq' ? 'Live AI reasoning' : 'Local fallback search'}</div>}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#1F3E3D]/70 md:mt-8 md:leading-7">
                It can search listings, compare locations, surface contact details, and point you toward businesses or community places that fit what you ask.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 md:mt-8 md:block md:space-y-2">
                {starters.slice(0, 4).map(starter => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => ask(starter)}
                    className="block w-full border border-[#1F3E3D]/12 bg-[#F8F8F8] px-3 py-2 text-left text-xs leading-5 text-[#1F3E3D]/76 transition-colors hover:border-[#C8A96A] hover:text-[#1F3E3D] md:px-4 md:py-3 md:text-sm"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex min-h-[48vh] flex-col md:min-h-[68vh]">
              <div ref={transcriptRef} className="max-h-[52vh] flex-1 space-y-4 overflow-y-auto p-4 md:max-h-none md:space-y-5 md:p-8">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`assistant-message-${Math.min(index, 2)} ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[92%] px-4 py-3 text-sm leading-6 md:max-w-[86%] md:px-5 md:py-4 md:text-base md:leading-8 ${message.role === 'user' ? 'bg-[#1F3E3D] text-white' : 'bg-[#F8F8F8] text-[#1F3E3D]/78'}`}>
                      {message.content}
                    </div>
                    {message.listings?.length > 0 && (
                      <div className="mt-3 grid gap-3 text-left md:grid-cols-2">
                        {message.listings.slice(0, 4).map(listing => (
                          <ListingResultCard key={listing.id} listing={listing} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="inline-flex items-center gap-2 bg-[#F8F8F8] px-5 py-4">
                    <span className="h-2 w-2 animate-pulse bg-[#C8A96A]"></span>
                    <span className="h-2 w-2 animate-pulse bg-[#C8A96A] [animation-delay:150ms]"></span>
                    <span className="h-2 w-2 animate-pulse bg-[#C8A96A] [animation-delay:300ms]"></span>
                  </div>
                )}
              </div>

              <form onSubmit={submit} className="flex border-t border-[#1F3E3D]/12 bg-[#F8F8F8]">
                <input
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-[#1F3E3D] outline-none placeholder:text-[#1F3E3D]/38 md:px-5 md:py-5 md:text-base"
                  placeholder="Ask anything: barber near Coburg, mosque nearby, halal butcher..."
                />
                <button disabled={loading} className="bg-[#1F3E3D] px-5 text-sm text-white disabled:opacity-50 md:px-7 md:text-base">
                  Ask
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAssistantReveal;
