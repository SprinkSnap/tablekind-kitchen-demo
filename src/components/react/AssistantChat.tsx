import { useEffect, useId, useRef, useState } from 'react';
import { track } from '../../lib/analytics';

type Msg = { role: 'user' | 'assistant'; content: string };

const QUICK = [
  { label: 'Help me find a product', message: 'Help me find a product for my home' },
  { label: 'Shop by room', message: 'What do you recommend for the living room?' },
  { label: 'Find a gift', message: 'I need a gift idea under $75' },
  { label: 'Compare products', message: 'Compare throws and cushions' },
  { label: 'Explain the demo checkout', message: 'How does the demo checkout work?' },
  { label: 'Build a store like this', action: 'enquiry' as const },
];

const SAFE_FALLBACK =
  'I\'m an AI shopping assistant in a fictional store demonstration created by Che Xu Studio. I can help you browse products, use filters, try the demo cart and checkout, or connect you with Che Xu Studio about building a similar store. I can\'t process real orders or payments.';

export default function AssistantChat() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: SAFE_FALLBACK }]);
  const [busy, setBusy] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.querySelector<HTMLElement>('button, textarea')?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (!open) lastFocus.current?.focus();
    };
  }, [open]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    const next = [...messages, { role: 'user' as const, content: message }].slice(-8);
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/assistant/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: next.slice(0, -1) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || SAFE_FALLBACK },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: SAFE_FALLBACK }]);
    } finally {
      setBusy(false);
    }
  };

  const openEnquiry = () => {
    document.dispatchEvent(new CustomEvent('hp:open-enquiry'));
    setOpen(false);
  };

  return (
    <div className="assistant">
      {!open && (
        <button
          type="button"
          className="assistant__launch"
          onClick={() => {
            setOpen(true);
            track('chat_opened');
          }}
        >
          Ask the demo assistant
        </button>
      )}
      {open && (
        <div
          className="assistant__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          ref={panelRef}
        >
          <div className="assistant__head">
            <div>
              <h2 id={titleId}>Demo shopping assistant</h2>
              <p>
                AI shopping assistant in a fictional store demonstration created by Che Xu Studio.
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
              Close
            </button>
          </div>
          <div className="quick">
            {QUICK.map((item) =>
              'action' in item && item.action === 'enquiry' ? (
                <button key={item.label} type="button" onClick={openEnquiry}>
                  {item.label}
                </button>
              ) : (
                <button key={item.label} type="button" onClick={() => void send(item.message!)}>
                  {item.label}
                </button>
              ),
            )}
          </div>
          <div className="messages" aria-live="polite">
            {messages.map((msg, index) => (
              <p key={`${msg.role}-${index}`} className={`msg msg--${msg.role}`}>
                {msg.content}
              </p>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <label className="sr-only" htmlFor="assistant-input">
              Message
            </label>
            <textarea
              id="assistant-input"
              rows={2}
              maxLength={500}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, filters or the demo checkout…"
            />
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Thinking…' : 'Send'}
            </button>
          </form>
        </div>
      )}
      <style>{`
        .assistant {
          position: fixed;
          right: 1rem;
          bottom: calc(var(--mobile-action-height) + 0.75rem + env(safe-area-inset-bottom, 0px));
          z-index: 45;
        }
        @media (min-width: 768px) {
          .assistant { bottom: 1rem; }
        }
        .assistant__launch {
          min-height: 48px; border: 0; border-radius: 999px;
          padding: 0.7rem 1rem; background: #173B32; color: #FFFEFB;
          font: inherit; font-weight: 700; cursor: pointer; box-shadow: var(--shadow-lift);
        }
        .assistant__panel {
          width: min(22rem, calc(100vw - 2rem));
          max-height: min(34rem, calc(100vh - 8rem));
          overflow: auto; background: #FFFEFB;
          border: 1px solid rgb(23 59 50 / 0.12);
          border-radius: 1rem; box-shadow: var(--shadow-lift);
          padding: 0.9rem; display: grid; gap: 0.75rem;
        }
        .assistant__head { display: flex; justify-content: space-between; gap: 0.75rem; }
        .assistant__head h2 { margin: 0; font-family: var(--font-display); font-size: 1.15rem; color: #102820; }
        .assistant__head p { margin: 0.25rem 0 0; font-size: 0.8rem; color: rgb(36 40 36 / 0.72); }
        .assistant__head button, .quick button {
          min-height: 36px; border-radius: 999px;
          border: 1px solid rgb(23 59 50 / 0.18); background: #F7F3EC;
          padding: 0.25rem 0.7rem; font: inherit; font-size: 0.85rem;
          font-weight: 650; color: #173B32; cursor: pointer;
        }
        .quick { display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .messages { display: grid; gap: 0.5rem; }
        .messages p {
          margin: 0; padding: 0.65rem 0.75rem; border-radius: 0.75rem;
          font-size: 0.92rem; line-height: 1.45; white-space: pre-wrap;
        }
        .messages .msg--assistant { background: #F7F3EC; }
        .messages .msg--user { background: #173B32; color: #FFFEFB; }
        form { display: grid; gap: 0.5rem; }
        textarea {
          border-radius: 0.75rem; border: 1px solid rgb(23 59 50 / 0.2);
          padding: 0.55rem 0.7rem; font: inherit;
        }
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); border: 0;
        }
      `}</style>
    </div>
  );
}
