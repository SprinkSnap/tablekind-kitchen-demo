import { useEffect, useId, useRef, useState } from 'react';
import {
  BUSINESS_TYPES,
  LAUNCH_TIMINGS,
  NEEDED_FEATURES,
  PRIMARY_GOALS,
} from '../../lib/validation';
import { track } from '../../lib/analytics';

type Props = {
  packagesUrl: string;
  turnstileSiteKey?: string;
};

type FormState = {
  name: string;
  email: string;
  businessName: string;
  businessType: (typeof BUSINESS_TYPES)[number];
  existingWebsite: string;
  primaryGoal: (typeof PRIMARY_GOALS)[number];
  neededFeatures: Array<(typeof NEEDED_FEATURES)[number]>;
  launchTiming: (typeof LAUNCH_TIMINGS)[number];
  message: string;
  consent: boolean;
  website: string;
};

const initial: FormState = {
  name: '',
  email: '',
  businessName: '',
  businessType: 'restaurant',
  existingWebsite: '',
  primaryGoal: 'more-reservations',
  neededFeatures: ['menu'],
  launchTiming: 'exploring',
  message: '',
  consent: false,
  website: '',
};

const labels = {
  businessType: {
    restaurant: 'Restaurant',
    cafe: 'Café',
    bakery: 'Bakery',
    catering: 'Catering',
    'food-truck': 'Food truck',
    'other-local-business': 'Other local business',
  },
  primaryGoal: {
    'more-reservations': 'More reservations',
    'online-ordering': 'Online ordering',
    'catering-leads': 'Catering leads',
    'local-seo': 'Local SEO',
    'brand-refresh': 'Brand refresh',
    'faster-website': 'Faster website',
  },
  neededFeatures: {
    menu: 'Menu',
    reservations: 'Reservations',
    'pickup-ordering': 'Pickup ordering',
    catering: 'Catering',
    'private-events': 'Private events',
    'multi-location': 'Multiple locations',
    cms: 'Easy content updates',
    analytics: 'Conversion analytics',
  },
  launchTiming: {
    asap: 'As soon as possible',
    '1-2-months': '1–2 months',
    '3-6-months': '3–6 months',
    exploring: 'Just exploring',
  },
} as const;

export default function EnquiryDrawer({ packagesUrl, turnstileSiteKey }: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const openHandler = () => {
      lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
      track('portfolio_lead_started');
      track('che_xu_cta_selected', { source: 'enquiry_drawer' });
    };
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-open-enquiry]')) {
        event.preventDefault();
        openHandler();
      }
    };
    document.addEventListener('tk:open-enquiry', openHandler as EventListener);
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('tk:open-enquiry', openHandler as EventListener);
      document.removeEventListener('click', clickHandler);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const panel = dialogRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select',
    );
    focusable?.[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      lastFocus.current?.focus();
    };
  }, [open]);

  const toggleFeature = (feature: (typeof NEEDED_FEATURES)[number]) => {
    setForm((prev) => {
      const exists = prev.neededFeatures.includes(feature);
      const neededFeatures = exists
        ? prev.neededFeatures.filter((f) => f !== feature)
        : [...prev.neededFeatures, feature];
      return { ...prev, neededFeatures };
    });
  };

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    let turnstileToken = 'dev-bypass';
    if (turnstileSiteKey && typeof window !== 'undefined') {
      const input = document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
      turnstileToken = input?.value || '';
    }

    try {
      const res = await fetch('/api/portfolio-lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          businessName: form.businessName || undefined,
          existingWebsite: form.existingWebsite || undefined,
          message: form.message || undefined,
          turnstileToken,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || 'Unable to submit right now. Please try again.');
      }
      setStatus('success');
      track('portfolio_lead_submitted', { businessType: form.businessType });
      setForm(initial);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (!open) return null;

  return (
    <div className="enquiry-overlay" onClick={() => setOpen(false)}>
      <div
        className="enquiry-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="enquiry-drawer__head">
          <h2 id={titleId}>Want a Website That Brings More Customers to Your Business?</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close enquiry form">
            Close
          </button>
        </div>
        <p>
          Che Xu Studio creates fast, conversion-focused websites designed around your customers,
          services and growth goals.
        </p>

        {status === 'success' ? (
          <div className="success" role="status">
            <p>
              Thanks — your website plan request was received. Che Xu Studio will follow up using the
              email you provided.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>
              Continue exploring the demo
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <label>
              Name
              <input
                required
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Business name <span className="optional">(optional)</span>
              <input
                name="businessName"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              />
            </label>
            <label>
              Business type
              <select
                value={form.businessType}
                onChange={(e) =>
                  setForm({ ...form, businessType: e.target.value as FormState['businessType'] })
                }
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {labels.businessType[type]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Existing website <span className="optional">(optional)</span>
              <input
                name="existingWebsite"
                inputMode="url"
                placeholder="https://"
                value={form.existingWebsite}
                onChange={(e) => setForm({ ...form, existingWebsite: e.target.value })}
              />
            </label>
            <label>
              Primary business goal
              <select
                value={form.primaryGoal}
                onChange={(e) =>
                  setForm({ ...form, primaryGoal: e.target.value as FormState['primaryGoal'] })
                }
              >
                {PRIMARY_GOALS.map((goal) => (
                  <option key={goal} value={goal}>
                    {labels.primaryGoal[goal]}
                  </option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Required website features</legend>
              <div className="feature-grid">
                {NEEDED_FEATURES.map((feature) => (
                  <label key={feature} className="check">
                    <input
                      type="checkbox"
                      checked={form.neededFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                    />
                    {labels.neededFeatures[feature]}
                  </label>
                ))}
              </div>
            </fieldset>
            <label>
              Preferred launch timing
              <select
                value={form.launchTiming}
                onChange={(e) =>
                  setForm({ ...form, launchTiming: e.target.value as FormState['launchTiming'] })
                }
              >
                {LAUNCH_TIMINGS.map((timing) => (
                  <option key={timing} value={timing}>
                    {labels.launchTiming[timing]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Message <span className="optional">(optional)</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <label className="check consent">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                required
              />
              I agree that Che Xu Studio may contact me about website design services using the
              details I provide.
            </label>
            <div className="hp" aria-hidden="true">
              <label>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </label>
            </div>
            {turnstileSiteKey ? (
              <div
                className="cf-turnstile"
                data-sitekey={turnstileSiteKey}
                data-theme="light"
              />
            ) : (
              <p className="reassure">
                Local/dev mode: Turnstile site key not configured. Production requires server-side
                verification.
              </p>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Request My Website Plan'}
              </button>
              <a
                className="btn btn-secondary"
                href={packagesUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Che Xu Studio Packages
              </a>
            </div>
            <p className="reassure">
              This is the only real lead-capture form. Tablekind reservations and orders are demo-only
              and are never transmitted.
            </p>
          </form>
        )}
      </div>
      <style>{`
        .enquiry-overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgb(16 39 30 / 0.5);
          display: flex;
          justify-content: flex-end;
        }
        .enquiry-drawer {
          width: min(32rem, 100%);
          height: 100%;
          overflow: auto;
          background: #FFFDFC;
          padding: 1.25rem;
          color: #222622;
        }
        .enquiry-drawer__head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: start;
        }
        .enquiry-drawer h2 {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 1.8rem);
          line-height: 1.2;
          margin: 0 0 0.75rem;
          color: #10271E;
        }
        .enquiry-drawer form {
          display: grid;
          gap: 0.85rem;
          margin-top: 1rem;
        }
        .enquiry-drawer label,
        .enquiry-drawer legend {
          display: grid;
          gap: 0.35rem;
          font-weight: 650;
          font-size: 0.92rem;
        }
        .enquiry-drawer input,
        .enquiry-drawer select,
        .enquiry-drawer textarea {
          min-height: 44px;
          border: 1px solid rgb(24 57 43 / 0.2);
          border-radius: 0.7rem;
          padding: 0.55rem 0.75rem;
          font: inherit;
          background: #fff;
        }
        .enquiry-drawer textarea { min-height: 6rem; }
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.35rem;
        }
        .check {
          display: flex !important;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500 !important;
        }
        .check input { width: 1.1rem; height: 1.1rem; min-height: 0; }
        .consent { margin-top: 0.25rem; }
        .optional { font-weight: 500; color: rgb(34 38 34 / 0.65); }
        .actions { display: grid; gap: 0.6rem; }
        .reassure { font-size: 0.85rem; color: rgb(34 38 34 / 0.72); margin: 0; }
        .error { color: #8a2f1d; font-weight: 650; }
        .hp { position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden; }
        .success { display: grid; gap: 1rem; margin-top: 1rem; }
        .enquiry-drawer__head button {
          min-height: 44px;
          border-radius: 999px;
          border: 1px solid rgb(24 57 43 / 0.2);
          background: #F7F2E8;
          padding: 0.4rem 0.9rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
