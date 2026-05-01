import React, { useState } from 'react';

const API_BASE_URL = 'https://aitest.techrealm.online';
const ASSISTANT_CONNECTION_MESSAGE = 'The directory assistant is reconnecting right now. Please try again in a moment.';

const resultIntro = data => {
  const count = data.listings?.length || 0;
  if (data.answer) return data.answer;
  if (!count) return 'Here are the closest matches I found.';
  return `I found ${count} matching listing${count === 1 ? '' : 's'}. Open a card below to see the full directory page, contact details, map, and comments.`;
};

const ListingResultCard = ({ listing }) => (
  <a
    href={`/listing/${listing.slug || listing.id}`}
    className="group block border border-[#1F3E3D]/14 bg-[#FBF8F1] p-3 transition-colors hover:border-[#9B7C43] hover:bg-white"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium leading-5 text-[#1F3E3D]">{listing.title}</div>
        <div className="mt-1 line-clamp-2 text-xs leading-5 text-[#1F3E3D]/62">
          {listing.address || listing.category_names?.join(', ') || 'Directory listing'}
        </div>
      </div>
      <span className="shrink-0 border border-[#1F3E3D]/14 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#1F3E3D]/70 group-hover:border-[#9B7C43] group-hover:text-[#1F3E3D]">
        Open
      </span>
    </div>
    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#1F3E3D]/58">
      {listing.phone && <span className="border border-[#1F3E3D]/10 px-2 py-1">Phone</span>}
      {listing.email && <span className="border border-[#1F3E3D]/10 px-2 py-1">Email</span>}
      {listing.category_names?.[0] && <span className="border border-[#1F3E3D]/10 px-2 py-1">{listing.category_names[0]}</span>}
    </div>
  </a>
);

const contextStarters = pageContext => {
  if (pageContext?.type === 'listing') {
    return ['What is best about this listing?', 'What should I confirm before visiting?', 'Summarise this place'];
  }
  if (pageContext?.type === 'category') {
    return ['What is best in this category?', 'Which listings should I start with?', 'What should I compare first?'];
  }
  return ['Find halal food near me', 'Tell me about Ummah Directory', 'Find a mosque nearby'];
};

const ChatbotWidget = ({ pageContext = {} }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ask me for a business, service, mosque, shop, or local category in Ummah Directory.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const starters = contextStarters(pageContext);

  const sendText = async textValue => {
    const text = textValue.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: nextMessages.map(({ role, content }) => ({ role, content })),
          page_context: pageContext,
        }),
      });
      const data = await res.json();
      if (!res.ok && !data.answer) throw new Error(data.error || 'Assistant unavailable');
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

  const send = async event => {
    event.preventDefault();
    sendText(input);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-[80] text-[#1F3E3D] md:inset-x-auto md:bottom-5 md:right-5">
      {open && (
        <div className="mb-3 max-h-[calc(100vh-6.5rem)] w-full overflow-hidden border border-[#1F3E3D]/18 bg-[#F8F4EC] shadow-[0_8px_24px_rgba(31,62,61,0.18)] md:w-[min(380px,calc(100vw-40px))]">
          <div className="flex items-center justify-between border-b border-[#1F3E3D]/12 px-4 py-3">
            <div>
              <div className="font-oswald text-xl uppercase leading-none tracking-tight">Directory assistant</div>
              <div className="text-xs text-[#1F3E3D]/58">Searches the local directory</div>
            </div>
            <button className="text-sm text-[#1F3E3D]/60 hover:text-[#1F3E3D]" onClick={() => setOpen(false)}>Close</button>
          </div>

          <div className="max-h-[calc(100vh-15rem)] space-y-3 overflow-y-auto px-3 py-3 md:max-h-[420px] md:px-4 md:py-4">
            <div className="flex flex-wrap gap-2">
              {starters.map(starter => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => sendText(starter)}
                  className="border border-[#1F3E3D]/12 bg-[#EFE9DE] px-2.5 py-1.5 text-left text-xs text-[#1F3E3D]/68 hover:border-[#9B7C43] hover:text-[#1F3E3D]"
                >
                  {starter}
                </button>
              ))}
            </div>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'ml-6 text-right md:ml-8' : 'mr-3 md:mr-6'}>
                <div className={`inline-block max-w-full border px-3 py-2 text-sm leading-6 ${message.role === 'user' ? 'border-[#1F3E3D]/18 bg-[#1F3E3D] text-white' : 'border-[#1F3E3D]/12 bg-[#EFE9DE] text-[#1F3E3D]/76'}`}>
                  {message.content}
                </div>
                {message.listings?.length > 0 && (
                  <div className="mt-2 space-y-2 text-left">
                    {message.listings.slice(0, 4).map(listing => (
                      <ListingResultCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="mr-6 inline-flex items-center gap-2 border border-[#1F3E3D]/12 bg-[#EFE9DE] px-3 py-2">
                <span className="h-2 w-2 animate-pulse bg-[#9B7C43]"></span>
                <span className="h-2 w-2 animate-pulse bg-[#9B7C43] [animation-delay:140ms]"></span>
                <span className="h-2 w-2 animate-pulse bg-[#9B7C43] [animation-delay:280ms]"></span>
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex border-t border-[#1F3E3D]/12">
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              className="min-w-0 flex-1 bg-[#F8F4EC] px-4 py-3 text-sm outline-none"
              placeholder="Need a halal shop near Preston?"
            />
            <button className="border-l border-[#1F3E3D]/12 bg-[#1F3E3D] px-4 text-sm text-white disabled:opacity-50" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(value => !value)}
        className="ml-auto block border border-[#1F3E3D]/18 bg-[#1F3E3D] px-5 py-3 text-sm text-white shadow-[0_6px_18px_rgba(31,62,61,0.22)]"
      >
        Ask directory
      </button>
    </div>
  );
};

export default ChatbotWidget;
