import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { track } from '../../lib/analytics';
import { formatCad } from '../../lib/currency';
import { DISCLOSURE } from '../../lib/config';

type Props = {
  caseStudyUrl: string;
};

type Step = 'contact' | 'delivery' | 'shipping' | 'review' | 'complete';

const STEPS: Step[] = ['contact', 'delivery', 'shipping', 'review', 'complete'];

const STEP_LABELS: Record<Step, string> = {
  contact: 'Contact',
  delivery: 'Delivery',
  shipping: 'Shipping',
  review: 'Review',
  complete: 'Complete',
};

export default function CheckoutDemo({ caseStudyUrl }: Props) {
  const { cart, totals, clear } = useCart();
  const [step, setStep] = useState<Step>('contact');
  const [started, setStarted] = useState(false);

  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [delivery, setDelivery] = useState('standard');
  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    province: '',
    postal: '',
  });

  useEffect(() => {
    if (!started && cart.lines.length > 0) {
      track('demo_checkout_started');
      setStarted(true);
    }
  }, [cart.lines.length, started]);

  const stepIndex = STEPS.indexOf(step);

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const complete = () => {
    track('demo_checkout_completed');
    clear();
    setStep('complete');
  };

  const restart = () => {
    setStep('contact');
    setStarted(false);
    setContact({ name: '', email: '', phone: '' });
    setDelivery('standard');
    setShipping({ address: '', city: '', province: '', postal: '' });
  };

  if (cart.lines.length === 0 && step !== 'complete') {
    return (
      <div className="hp-checkout-empty">
        <h2>Your demo cart is empty</h2>
        <p>Add items before trying the Harbour &amp; Pine checkout demonstration.</p>
        <a className="btn btn-primary" href="/shop/">
          Continue shopping
        </a>
        <style>{checkoutStyles}</style>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="hp-checkout-complete">
        <h2>Demo checkout complete</h2>
        <p role="status">
          You&apos;ve completed the Harbour &amp; Pine checkout demonstration.
        </p>
        <p className="disclosure">{DISCLOSURE.checkout}</p>
        <div className="hp-checkout-complete__actions">
          <button type="button" className="btn btn-primary" data-open-enquiry>
            Build My Online Store
          </button>
          <a className="btn btn-secondary" href={caseStudyUrl} target="_blank" rel="noopener noreferrer">
            View Case Study
          </a>
          <button type="button" className="btn btn-ghost" onClick={restart}>
            Restart Demo
          </button>
        </div>
        <style>{checkoutStyles}</style>
      </div>
    );
  }

  return (
    <div className="hp-checkout">
      <nav className="hp-checkout__steps" aria-label="Checkout progress">
        <ol>
          {STEPS.filter((s) => s !== 'complete').map((s, i) => (
            <li key={s} aria-current={step === s ? 'step' : undefined}>
              <span className={i <= stepIndex ? 'is-done' : ''}>{STEP_LABELS[s]}</span>
            </li>
          ))}
        </ol>
      </nav>

      <p className="disclosure">{DISCLOSURE.checkout}</p>

      <div className="hp-checkout__layout">
        <div className="hp-checkout__main">
          {step === 'contact' && (
            <fieldset className="hp-checkout__section">
              <legend>Contact (demo only)</legend>
              <p className="hp-checkout__hint">
                Fields are optional and never sent to a server—this is a portfolio demonstration.
              </p>
              <label>
                Name
                <input
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  autoComplete="off"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  autoComplete="off"
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  autoComplete="off"
                />
              </label>
            </fieldset>
          )}

          {step === 'delivery' && (
            <fieldset className="hp-checkout__section">
              <legend>Delivery method</legend>
              <label className="hp-checkout__radio">
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={delivery === 'standard'}
                  onChange={() => setDelivery('standard')}
                />
                Standard shipping (sample)
              </label>
              <label className="hp-checkout__radio">
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={delivery === 'express'}
                  onChange={() => setDelivery('express')}
                />
                Express shipping (sample)
              </label>
              <label className="hp-checkout__radio">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={delivery === 'pickup'}
                  onChange={() => setDelivery('pickup')}
                />
                Local pickup (sample)
              </label>
            </fieldset>
          )}

          {step === 'shipping' && (
            <fieldset className="hp-checkout__section">
              <legend>Shipping details (sample)</legend>
              <p className="hp-checkout__hint">
                Illustrative fields only—not stored or transmitted.
              </p>
              <label>
                Street address
                <input
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  autoComplete="off"
                />
              </label>
              <label>
                City
                <input
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  autoComplete="off"
                />
              </label>
              <label>
                Province
                <input
                  value={shipping.province}
                  onChange={(e) => setShipping({ ...shipping, province: e.target.value })}
                  autoComplete="off"
                />
              </label>
              <label>
                Postal code
                <input
                  value={shipping.postal}
                  onChange={(e) => setShipping({ ...shipping, postal: e.target.value })}
                  autoComplete="off"
                />
              </label>
            </fieldset>
          )}

          {step === 'review' && (
            <div className="hp-checkout__section">
              <h3>Review your demo order</h3>
              <ul className="hp-checkout__lines">
                {cart.lines.map((line) => (
                  <li key={line.key}>
                    <span>
                      {line.name} ({line.variantName}) × {line.quantity}
                    </span>
                    <span>{formatCad(line.unitPrice * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <dl className="hp-checkout__totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatCad(totals.subtotal)}</dd>
                </div>
                <div>
                  <dt>Sample shipping</dt>
                  <dd>{formatCad(totals.shipping)}</dd>
                </div>
                <div>
                  <dt>Sample tax</dt>
                  <dd>{formatCad(totals.tax)}</dd>
                </div>
                <div className="hp-checkout__total">
                  <dt>Total</dt>
                  <dd>{formatCad(totals.total)}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="hp-checkout__nav">
            {stepIndex > 0 && (
              <button type="button" className="btn btn-secondary" onClick={goBack}>
                Back
              </button>
            )}
            {step !== 'review' ? (
              <button type="button" className="btn btn-primary" onClick={goNext}>
                Continue
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={complete}>
                Complete demo checkout
              </button>
            )}
          </div>
        </div>

        <aside className="hp-checkout__aside">
          <h3>Order summary</h3>
          <ul>
            {cart.lines.map((line) => (
              <li key={line.key}>
                {line.quantity} × {line.name}
              </li>
            ))}
          </ul>
          <p className="price">{formatCad(totals.total)}</p>
        </aside>
      </div>

      <style>{checkoutStyles}</style>
    </div>
  );
}

const checkoutStyles = `
  .hp-checkout-empty, .hp-checkout-complete { text-align: center; display: grid; gap: 1rem; padding: 2rem 0; }
  .hp-checkout-empty h2, .hp-checkout-complete h2 { margin: 0; font-family: var(--font-display); color: #102820; }
  .hp-checkout-complete__actions { display: grid; gap: 0.6rem; max-width: 20rem; margin: 0 auto; }
  .hp-checkout { display: grid; gap: 1.25rem; }
  .hp-checkout__steps ol {
    display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; margin: 0; padding: 0;
  }
  .hp-checkout__steps li span {
    display: inline-flex; padding: 0.35rem 0.75rem; border-radius: 999px;
    background: #F7F3EC; font-size: 0.85rem; font-weight: 650; color: rgb(36 40 36 / 0.65);
  }
  .hp-checkout__steps li span.is-done { background: #173B32; color: #FFFEFB; }
  .hp-checkout__layout {
    display: grid; gap: 1.5rem;
  }
  @media (min-width: 900px) {
    .hp-checkout__layout { grid-template-columns: 1fr min(18rem, 100%); }
  }
  .hp-checkout__section { border: 0; margin: 0; padding: 0; display: grid; gap: 0.75rem; }
  .hp-checkout__section legend, .hp-checkout__section h3 {
    font-family: var(--font-display); color: #102820; font-size: 1.2rem; margin-bottom: 0.25rem;
  }
  .hp-checkout__hint { margin: 0; font-size: 0.88rem; color: rgb(36 40 36 / 0.72); }
  .hp-checkout__section label { display: grid; gap: 0.35rem; font-weight: 650; font-size: 0.92rem; }
  .hp-checkout__section input {
    min-height: 44px; border: 1px solid rgb(23 59 50 / 0.2);
    border-radius: 0.5rem; padding: 0.5rem 0.75rem; font: inherit; background: #FFFEFB;
  }
  .hp-checkout__radio { display: flex !important; align-items: center; gap: 0.5rem; font-weight: 500 !important; }
  .hp-checkout__lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
  .hp-checkout__lines li { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.92rem; }
  .hp-checkout__totals { margin: 1rem 0 0; display: grid; gap: 0.35rem; }
  .hp-checkout__totals > div { display: flex; justify-content: space-between; }
  .hp-checkout__total { font-weight: 700; color: #173B32; padding-top: 0.35rem; border-top: 1px solid rgb(23 59 50 / 0.12); }
  .hp-checkout__nav { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1rem; }
  .hp-checkout__aside {
    padding: 1.25rem; background: #F7F3EC; border-radius: 0.75rem;
    display: grid; gap: 0.5rem; align-content: start;
  }
  .hp-checkout__aside h3 { margin: 0; font-family: var(--font-display); color: #102820; font-size: 1.05rem; }
  .hp-checkout__aside ul { margin: 0; padding-left: 1.1rem; font-size: 0.9rem; }
`;
