import { useId, useMemo, useState } from 'react';
import {
  CATEGORY_META,
  DIETARY_LABELS,
  MENU_ITEMS,
  type DietaryLabel,
  type MenuCategory,
  type MenuItem,
} from '../../data/menu';
import { formatCad } from '../../lib/currency';
import { track } from '../../lib/analytics';

type Props = {
  initialCategory?: MenuCategory | 'all';
  pickupOnly?: boolean;
  showAddButtons?: boolean;
};

export default function MenuFilters({
  initialCategory = 'all',
  pickupOnly = false,
  showAddButtons = false,
}: Props) {
  const panelId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<MenuCategory | 'all'>(initialCategory);
  const [dietary, setDietary] = useState<DietaryLabel[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      if (pickupOnly && !item.availableForPickup) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (dietary.length && !dietary.every((d) => item.dietaryLabels.includes(d))) return false;
      if (q) {
        const hay = `${item.name} ${item.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [query, category, dietary, pickupOnly]);

  const grouped = useMemo(() => {
    const map = new Map<MenuCategory, MenuItem[]>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [items]);

  const activeFilterCount =
    (category !== initialCategory ? 1 : 0) + dietary.length + (query.trim() ? 1 : 0);

  const clear = () => {
    setQuery('');
    setCategory(initialCategory);
    setDietary([]);
  };

  const toggleDietary = (label: DietaryLabel) => {
    setDietary((prev) => {
      const next = prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label];
      track('menu_filter_used', { dietary: next.join(','), category });
      return next;
    });
  };

  return (
    <div className="menu-filters">
      <aside className="filters-aside">
        <div className="filters-shell">
          <div className="filters-toolbar">
            <div>
              <p className="filters-title">Filter the menu</p>
              <p className="count" aria-live="polite">
                Showing {items.length} {items.length === 1 ? 'dish' : 'dishes'}
                {activeFilterCount > 0 ? ` · ${activeFilterCount} active` : ''}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary filters-toggle"
              aria-expanded={filtersOpen}
              aria-controls={panelId}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {filtersOpen ? 'Hide filters' : 'Show filters'}
            </button>
          </div>

          <form
            id={panelId}
            className={`filters${filtersOpen ? ' is-open' : ''}`}
            onSubmit={(e) => e.preventDefault()}
            role="search"
            aria-label="Filter the menu"
          >
            <label>
              Search dishes
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  track('menu_filter_used', { queryLength: e.target.value.length });
                }}
                placeholder="Try salmon, salad, brunch…"
                autoComplete="off"
              />
            </label>
            <label>
              Category
              <select
                value={category}
                onChange={(e) => {
                  const value = e.target.value as MenuCategory | 'all';
                  setCategory(value);
                  track('menu_filter_used', { category: value });
                }}
              >
                <option value="all">All categories</option>
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Dietary preferences</legend>
              <div className="dietary">
                {(Object.keys(DIETARY_LABELS) as DietaryLabel[]).map((label) => (
                  <label key={label} className="check">
                    <input
                      type="checkbox"
                      checked={dietary.includes(label)}
                      onChange={() => toggleDietary(label)}
                    />
                    {DIETARY_LABELS[label]}
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="button" className="btn btn-secondary" onClick={clear}>
              Clear filters
            </button>
          </form>
        </div>
      </aside>

      <div className="results">
        {items.length === 0 ? (
          <p className="empty" role="status">
            No dishes match these filters. Try clearing filters to browse the full menu.
          </p>
        ) : (
          [...grouped.entries()].map(([cat, list]) => (
            <section key={cat} id={cat} aria-labelledby={`heading-${cat}`}>
              <h2 id={`heading-${cat}`}>{CATEGORY_META[cat].label}</h2>
              <ul className="menu-list">
                {list.map((item) => (
                  <li key={item.id} className="menu-item">
                    <img src={item.image} alt={item.imageAlt} width="1200" height="900" loading="lazy" />
                    <div>
                      <div className="row">
                        <h3>{item.name}</h3>
                        <p className="price">{formatCad(item.price)}</p>
                      </div>
                      <p>{item.description}</p>
                      {item.dietaryLabels.length > 0 && (
                        <ul className="chips">
                          {item.dietaryLabels.map((label) => (
                            <li key={label} className="chip">
                              {DIETARY_LABELS[label]}
                            </li>
                          ))}
                        </ul>
                      )}
                      {showAddButtons && item.availableForPickup && (
                        <a className="btn btn-ghost" href={`/order/?item=${item.slug}`}>
                          Add to demo order
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <style>{`
        .menu-filters {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 960px) {
          .menu-filters {
            grid-template-columns: minmax(16rem, 17.5rem) minmax(0, 1fr);
            align-items: start;
          }
        }

        .filters-aside {
          position: relative;
          z-index: 20;
        }
        @media (min-width: 960px) {
          .filters-aside {
            position: sticky;
            top: calc(var(--portfolio-offset, 0px) + var(--header-height) + 0.75rem);
            align-self: start;
          }
        }

        .filters-shell {
          overflow: hidden;
          border-radius: var(--radius-lg);
          border: 1px solid rgb(24 57 43 / 0.12);
          background: #fffdfc;
          box-shadow: var(--shadow-soft);
        }

        .filters-toolbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          border-bottom: 1px solid rgb(24 57 43 / 0.1);
          background: #fffdfc;
        }

        .filters-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: #10271e;
        }

        .filters-toggle {
          flex-shrink: 0;
          min-height: 2.75rem;
          padding-inline: 0.85rem;
          font-size: 0.9rem;
        }
        @media (min-width: 960px) {
          .filters-toggle {
            display: none;
          }
        }

        .filters {
          display: none;
          gap: 0.85rem;
          padding: 1rem;
          background: #fffdfc;
        }
        .filters.is-open {
          display: grid;
        }
        @media (min-width: 960px) {
          .filters {
            display: grid;
          }
        }

        label, legend {
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
          background: #fff;
        }
        .dietary { display: grid; gap: 0.35rem; }
        .check {
          display: flex !important;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500 !important;
        }
        .check input {
          width: 1.1rem;
          height: 1.1rem;
          min-height: 0;
        }
        .count, .empty {
          margin: 0.2rem 0 0;
          color: rgb(34 38 34 / 0.75);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .empty { margin: 0; }

        .results {
          position: relative;
          z-index: 0;
          min-width: 0;
        }
        .results section {
          margin-bottom: 2rem;
          scroll-margin-top: 7rem;
        }
        .results h2 {
          font-family: var(--font-display);
          color: #10271E;
          margin: 0 0 1rem;
        }
        .menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1rem;
        }
        .menu-item {
          display: grid;
          gap: 0.9rem;
          grid-template-columns: 96px minmax(0, 1fr);
          padding: 0.85rem;
          border-radius: 1rem;
          background: #fffdfc;
          border: 1px solid rgb(24 57 43 / 0.08);
        }
        @media (min-width: 700px) {
          .menu-item { grid-template-columns: 140px minmax(0, 1fr); }
        }
        .menu-item img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: 0.75rem;
          background: #18392B;
        }
        .row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: baseline;
        }
        .row h3 {
          margin: 0;
          font-size: 1.15rem;
          color: #10271E;
        }
        .menu-item p {
          margin: 0.4rem 0 0;
          line-height: 1.55;
        }
        .chips {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          padding: 0;
          margin: 0.6rem 0 0;
        }
      `}</style>
    </div>
  );
}
