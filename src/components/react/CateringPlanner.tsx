import { useState } from 'react';
import { track } from '../../lib/analytics';

type Props = {
  variant?: 'catering' | 'private-events';
};

export default function CateringPlanner({ variant = 'catering' }: Props) {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    eventType: variant === 'private-events' ? 'celebration' : 'meeting',
    guests: '20',
    date: '',
    serviceStyle: 'drop-off',
    dietary: '',
    fulfillment: 'pickup',
    message: '',
  });

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    track('catering_demo_started', {
      variant,
      eventType: form.eventType,
      serviceStyle: form.serviceStyle,
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="planner surface" role="status">
        <h2>Demo enquiry planned.</h2>
        <p>
          This fictional Tablekind enquiry was not transmitted or stored. If you want a catering or
          private-event lead flow like this for a real business, Che Xu Studio can build it.
        </p>
        <div className="actions">
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => document.dispatchEvent(new CustomEvent('tk:open-enquiry'))}
          >
            Build My Website
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setDone(false)}>
            Plan another demo enquiry
          </button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <form className="planner surface" onSubmit={onSubmit}>
      <h2>{variant === 'private-events' ? 'Plan a private gathering' : 'Plan a catering enquiry'}</h2>
      <p className="reassure">
        Demonstration only — details stay in your browser and are not sent to Tablekind Kitchen.
      </p>
      <label>
        Event type
        <select
          value={form.eventType}
          onChange={(e) => setForm({ ...form, eventType: e.target.value })}
        >
          <option value="meeting">Meeting / workplace lunch</option>
          <option value="celebration">Celebration</option>
          <option value="family">Family gathering</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        Estimated guest count
        <input
          type="number"
          min={2}
          max={300}
          value={form.guests}
          onChange={(e) => setForm({ ...form, guests: e.target.value })}
          required
        />
      </label>
      <label>
        Preferred date
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
      </label>
      <label>
        Service style
        <select
          value={form.serviceStyle}
          onChange={(e) => setForm({ ...form, serviceStyle: e.target.value })}
        >
          <option value="drop-off">Drop-off catering</option>
          <option value="buffet">Buffet setup</option>
          <option value="family-style">Family-style</option>
          <option value="plated">Plated (private dining)</option>
        </select>
      </label>
      <label>
        Dietary considerations
        <textarea
          rows={3}
          value={form.dietary}
          onChange={(e) => setForm({ ...form, dietary: e.target.value })}
          placeholder="Share preferences for a real restaurant conversation later"
        />
      </label>
      <label>
        Pickup or delivery preference
        <select
          value={form.fulfillment}
          onChange={(e) => setForm({ ...form, fulfillment: e.target.value })}
        >
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery discussion</option>
          <option value="onsite">On-site private dining</option>
        </select>
      </label>
      <label>
        Message
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </label>
      <button type="submit" className="btn btn-primary">
        Complete demo enquiry
      </button>
      <style>{styles}</style>
    </form>
  );
}

const styles = `
  .planner { padding: 1.25rem; display: grid; gap: 0.85rem; }
  .planner h2 { margin: 0; font-family: var(--font-display); color: #10271E; }
  label { display: grid; gap: 0.35rem; font-weight: 650; }
  input, select, textarea {
    min-height: 44px;
    border-radius: 0.7rem;
    border: 1px solid rgb(24 57 43 / 0.2);
    padding: 0.5rem 0.75rem;
    font: inherit;
  }
  textarea { min-height: 5.5rem; }
  .reassure { margin: 0; color: rgb(34 38 34 / 0.72); }
  .actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
`;
