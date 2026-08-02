import { useEffect, useId, useRef, useState } from 'react';
import {
  BUSINESS_TYPES,
  LAUNCH_TIMINGS,
  NEEDED_FEATURES,
  PRIMARY_GOALS,
  PRODUCT_COUNTS,
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
  productCount: (typeof PRODUCT_COUNTS)[number];
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
  businessType: 'home-goods',
  existingWebsite: '',
  productCount: 'not-sure',
  primaryGoal: 'increase-online-sales',
  neededFeatures: ['product-catalogue', 'cart-checkout'],
  launchTiming: 'exploring',
  message: '',
  consent: false,
  website: '',
};

const labels = {
  businessType: {
    'home-goods': 'Home goods',
    furniture: 'Furniture',
    apparel: 'Apparel',
    beauty: 'Beauty & wellness',
    'specialty-retail': 'Specialty retail',
    'other-ecommerce': 'Other e-commerce',
  },
  primaryGoal: {
    'increase-online-sales': 'Increase online sales',
    'better-product-discovery': 'Better product discovery',
    'faster-storefront': 'Faster storefront',
    'product-seo': 'Product SEO',
    'brand-refresh': 'Brand refresh',
    'migrate-platform': 'Migrate platform',
  },
  neededFeatures: {
    'product-catalogue': 'Product catalogue',
    variants: 'Variants & options',
    'search-filters': 'Search & filters',
    wishlist: 'Wishlist',
    'cart-checkout': 'Cart & checkout',
    stripe: 'Stripe payments',
    cms: 'Easy content updates',
    analytics: 'Conversion analytics',
  },
  productCount: {
    '1-20': '1–20 products',
    '21-100': '21–100 products',
    '101-500': '101–500 products',
    '500-plus': '500+ products',
    'not-sure': 'Not sure yet',
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
    document.addEventListener('hp:open-enquiry', openHandler as EventListener);
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('hp:open-enquiry', openHandler as EventListener);
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
          <h2 id={titleId}>Ready to Build a Store Designed Around Your Customers?</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close enquiry form">
            Close
          </button>
        </div>
        <p>
          Che Xu Studio creates fast, conversion-focused online stores designed to make products
          easier to discover, understand and purchase.
        </p>

        {status === 'success' ? (
          <div className="success" role="status">
            <p>
              Thanks — your store plan request was received. Che Xu Studio will follow up using the
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
              Approximate product count
              <select
                value={form.productCount}
                onChange={(e) =>
                  setForm({ ...form, productCount: e.target.value as FormState['productCount'] })
                }
              >
                {PRODUCT_COUNTS.map((count) => (
                  <option key={count} value={count}>
                    {labels.productCount[count]}
                  </option>
                ))}
              </select>
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
              <legend>Required store features</legend>
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
              I agree that Che Xu Studio may contact me about e-commerce design services using the
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
              <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" />
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
                {status === 'submitting' ? 'Sending…' : 'Request My Store Plan'}
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
              This is the only real lead-capture form. Harbour &amp; Pine cart, checkout and wishlist
              flows are demo-only and are never transmitted.
            </p>
          </form>
        )}
      </div>
      <style>{`
        .enquiry-overlay {
          position: fixed; inset: 0; z-index: 80;
          background: rgb(16 40 32 / 0.5);
          display: flex; justify-content: flex-end;
        }
        .enquiry-drawer {
          width: min(32rem, 100%); height: 100%; overflow: auto;
          background: #FFFEFB; padding: 1.25rem; color: #242824;
        }
        .enquiry-drawer__head {
          display: flex; justify-content: space-between; gap: 1rem; align-items: start;
        }
        .enquiry-drawer h2 {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 1.8rem);
          line-height: 1.2; margin: 0 0 0.75rem; color: #102820;
        }
        .enquiry-drawer form { display: grid; gap: 0.85rem; margin-top: 1rem; }
        .enquiry-drawer label, .enquiry-drawer legend {
          display: grid; gap: 0.35rem; font-weight: 650; font-size: 0.92rem;
        }
        .enquiry-drawer input, .enquiry-drawer select, .enquiry-drawer textarea {
          min-height: 44px; border: 1px solid rgb(23 59 50 / 0.2);
          border-radius: 0.7rem; padding: 0.55rem 0.75rem; font: inherit; background: #fff;
        }
        .enquiry-drawer textarea { min-height: 6rem; }
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem; }
        .check { display: flex !important; align-items: center; gap: 0.5rem; font-weight: 500 !important; }
        .check input { width: 1.1rem; height: 1.1rem; min-height: 0; }
        .consent { margin-top: 0.25rem; }
        .optional { font-weight: 500; color: rgb(36 40 36 / 0.65); }
        .actions { display: grid; gap: 0.6rem; }
        .reassure { font-size: 0.85rem; color: rgb(36 40 36 / 0.72); margin: 0; }
        .error { color: #8a2f1d; font-weight: 650; }
        .hp { position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden; }
        .success { display: grid; gap: 1rem; margin-top: 1rem; }
        .enquiry-drawer__head button {
          min-height: 44px; border-radius: 999px;
          border: 1px solid rgb(23 59 50 / 0.2); background: #F7F3EC;
          padding: 0.4rem 0.9rem; cursor: pointer; font: inherit;
        }
      `}</style>
    </div>
  );
}
