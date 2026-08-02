import { useMemo, useState } from 'react';
import {
  DEMO_TIME_SLOTS,
  defaultReservationDraft,
  getReservationProvider,
  type PartySize,
  type ReservationDraft,
  type SeatingPreference,
} from '../../lib/reservations';
import { track } from '../../lib/analytics';
import { getCaseStudyUrl } from '../../lib/config';

const partySizes: PartySize[] = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ReservationFlow() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ReservationDraft>(defaultReservationDraft());
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const provider = useMemo(() => getReservationProvider(), []);

  const nextFromStep1 = () => {
    track('reservation_demo_started', { partySize: draft.partySize });
    setStep(2);
  };

  const complete = async () => {
    setBusy(true);
    const result = await provider.createReservation(draft);
    setCode(result.confirmationCode);
    setBusy(false);
    setStep(4);
    track('reservation_demo_completed', { seating: draft.seating });
  };

  const restart = () => {
    setDraft(defaultReservationDraft());
    setCode('');
    setStep(1);
  };

  return (
    <div className="reserve surface">
      <ol className="steps" aria-label="Reservation steps">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} aria-current={step === n ? 'step' : undefined} className={step >= n ? 'on' : ''}>
            Step {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section aria-labelledby="reserve-step-1">
          <h2 id="reserve-step-1">Choose a demo table</h2>
          <p className="reassure">
            Illustrative availability only. No real reservation will be made.
          </p>
          <div className="grid">
            <label>
              Party size
              <select
                value={draft.partySize}
                onChange={(e) =>
                  setDraft({ ...draft, partySize: Number(e.target.value) as PartySize })
                }
              >
                {partySizes.map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                required
              />
            </label>
            <label>
              Preferred time
              <select
                value={draft.preferredTime}
                onChange={(e) => setDraft({ ...draft, preferredTime: e.target.value })}
              >
                {DEMO_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="button" className="btn btn-primary" onClick={nextFromStep1}>
            Find a Demo Table
          </button>
        </section>
      )}

      {step === 2 && (
        <section aria-labelledby="reserve-step-2">
          <h2 id="reserve-step-2">Preferences</h2>
          <div className="grid">
            <label>
              Seating preference
              <select
                value={draft.seating}
                onChange={(e) =>
                  setDraft({ ...draft, seating: e.target.value as SeatingPreference })
                }
              >
                <option value="no-preference">No preference</option>
                <option value="quiet">Quieter area</option>
                <option value="window">Near a window</option>
                <option value="communal">Communal table</option>
              </select>
            </label>
            <label>
              Accessibility request <span className="opt">(optional)</span>
              <input
                value={draft.accessibilityRequest ?? ''}
                onChange={(e) => setDraft({ ...draft, accessibilityRequest: e.target.value })}
                placeholder="e.g. step-free seating"
              />
            </label>
            <label>
              Occasion <span className="opt">(optional)</span>
              <input
                value={draft.occasion ?? ''}
                onChange={(e) => setDraft({ ...draft, occasion: e.target.value })}
                placeholder="Birthday, catch-up, celebration"
              />
            </label>
          </div>
          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section aria-labelledby="reserve-step-3">
          <h2 id="reserve-step-3">Demo confirmation</h2>
          <div className="disclosure" role="note">
            This is an interactive portfolio demonstration. No real table will be reserved and no
            personal information is required.
          </div>
          <dl className="summary">
            <div>
              <dt>Party size</dt>
              <dd>{draft.partySize}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{draft.date}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{draft.preferredTime}</dd>
            </div>
            <div>
              <dt>Seating</dt>
              <dd>{draft.seating.replace('-', ' ')}</dd>
            </div>
          </dl>
          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={complete} disabled={busy}>
              {busy ? 'Completing…' : 'Complete Demo Reservation'}
            </button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section aria-labelledby="reserve-done" aria-live="polite">
          <h2 id="reserve-done">Reservation experience complete.</h2>
          <p>
            Demo reference: <strong>{code}</strong>. Nothing was booked and no data was stored.
          </p>
          <p>Want a customer experience like this for your restaurant?</p>
          <div className="actions">
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => document.dispatchEvent(new CustomEvent('tk:open-enquiry'))}
            >
              Build My Restaurant Website
            </button>
            <a className="btn btn-secondary" href={getCaseStudyUrl()} target="_blank" rel="noopener noreferrer">
              View Case Study
            </a>
            <button type="button" className="btn btn-ghost" onClick={restart}>
              Restart Demo
            </button>
          </div>
        </section>
      )}

      <style>{`
        .reserve { padding: 1.25rem; }
        .steps {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0;
          margin: 0 0 1.25rem;
        }
        .steps li {
          min-height: 32px;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          border: 1px solid rgb(24 57 43 / 0.15);
          font-size: 0.85rem;
          font-weight: 650;
          opacity: 0.55;
        }
        .steps li.on { opacity: 1; background: #E7EFE4; }
        .grid {
          display: grid;
          gap: 0.85rem;
          margin: 1rem 0 1.25rem;
        }
        @media (min-width: 720px) {
          .grid { grid-template-columns: repeat(3, 1fr); }
        }
        label {
          display: grid;
          gap: 0.35rem;
          font-weight: 650;
        }
        input, select {
          min-height: 44px;
          border-radius: 0.7rem;
          border: 1px solid rgb(24 57 43 / 0.2);
          padding: 0.5rem 0.75rem;
          font: inherit;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .reassure, .opt { color: rgb(34 38 34 / 0.72); font-weight: 500; }
        .summary {
          display: grid;
          gap: 0.75rem;
          margin: 1rem 0;
        }
        .summary div {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid rgb(24 57 43 / 0.08);
          padding-bottom: 0.4rem;
        }
        dt { font-weight: 650; }
        dd { margin: 0; }
        h2 { font-family: var(--font-display); color: #10271E; margin: 0 0 0.5rem; }
      `}</style>
    </div>
  );
}
