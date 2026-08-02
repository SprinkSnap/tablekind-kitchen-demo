import { useState } from 'react';
import {
  COLOUR_LABELS,
  filterProducts,
  PRODUCTS,
  type ColourFamily,
  type Product,
} from '../../data/products';
import { formatCad } from '../../lib/currency';
import ProductCardActions from './ProductCardActions';

const ROOMS = [
  { value: 'living-room', label: 'Living room' },
  { value: 'dining-area', label: 'Dining area' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'workspace', label: 'Workspace' },
] as const;

const PRODUCT_TYPES = [
  { value: '', label: 'Any type' },
  ...Array.from(new Set(PRODUCTS.flatMap((p) => p.categories))).sort().map((c) => ({
    value: c,
    label: c.charAt(0).toUpperCase() + c.slice(1),
  })),
];

const BUDGETS = [
  { value: '', label: 'Any budget', min: undefined, max: undefined },
  { value: 'under-50', label: 'Under $50', min: undefined, max: 50 },
  { value: '50-100', label: '$50 – $100', min: 50, max: 100 },
  { value: '100-150', label: '$100 – $150', min: 100, max: 150 },
  { value: '150-plus', label: '$150+', min: 150, max: undefined },
];

export default function ProductFinder() {
  const [room, setRoom] = useState('');
  const [productType, setProductType] = useState('');
  const [colour, setColour] = useState('');
  const [budget, setBudget] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const budgetRange = BUDGETS.find((b) => b.value === budget) ?? BUDGETS[0];

  const matches = submitted
    ? filterProducts({
        room: room || undefined,
        category: productType || undefined,
        colour: (colour as ColourFamily) || undefined,
        minPrice: budgetRange.min,
        maxPrice: budgetRange.max,
        available: true,
        sort: 'featured',
      })
    : [];

  const alternatives = submitted
    ? PRODUCTS.filter((p) => p.available && !matches.some((m) => m.id === p.id)).slice(0, 4)
    : [];

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const reset = () => {
    setRoom('');
    setProductType('');
    setColour('');
    setBudget('');
    setSubmitted(false);
  };

  return (
    <div className="hp-finder">
      <form className="hp-finder__form surface" onSubmit={handleSubmit}>
        <h2 className="hp-finder__title">Find your next piece</h2>
        <p className="hp-finder__lede">
          Answer a few quick questions and we&apos;ll suggest Harbour &amp; Pine pieces that fit—plus
          links to browse the full shop.
        </p>

        <label>
          Room
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="">Any room</option>
            {ROOMS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Product type
          <select value={productType} onChange={(e) => setProductType(e.target.value)}>
            {PRODUCT_TYPES.map((t) => (
              <option key={t.value || 'any'} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Colour family
          <select value={colour} onChange={(e) => setColour(e.target.value)}>
            <option value="">Any colour</option>
            {(Object.keys(COLOUR_LABELS) as ColourFamily[]).map((c) => (
              <option key={c} value={c}>
                {COLOUR_LABELS[c]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Budget
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            {BUDGETS.map((b) => (
              <option key={b.value || 'any'} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        <div className="hp-finder__actions">
          <button type="submit" className="btn btn-primary">
            Show recommendations
          </button>
          {submitted && (
            <button type="button" className="btn btn-secondary" onClick={reset}>
              Start over
            </button>
          )}
        </div>
      </form>

      {submitted && (
        <section className="hp-finder__results" aria-live="polite">
          <div className="hp-finder__results-head">
            <h3>
              {matches.length > 0
                ? `${matches.length} recommended piece${matches.length === 1 ? '' : 's'}`
                : 'No exact matches'}
            </h3>
            <a className="btn btn-ghost" href="/shop/">
              Browse full shop
            </a>
          </div>

          {matches.length > 0 ? (
            <div className="product-grid">
              {matches.map((product) => (
                <FinderCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="hp-finder__none">
              Try broadening your choices—or explore the full catalogue for more options.
            </p>
          )}

          {alternatives.length > 0 && (
            <>
              <h4 className="hp-finder__alt-title">You might also like</h4>
              <div className="product-grid">
                {alternatives.map((product) => (
                  <FinderCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <style>{finderStyles}</style>
    </div>
  );
}

function FinderCard({ product }: { product: Product }) {
  const defaultVariant = product.variants.find((v) => v.available) ?? product.variants[0];
  return (
    <article className="hp-finder-card">
      <a href={`/products/${product.slug}/`}>
        <img src={product.images[0]} alt={product.imageAlt[0] ?? product.name} loading="lazy" />
      </a>
      <a href={`/products/${product.slug}/`} className="hp-finder-card__name">
        {product.name}
      </a>
      <p className="hp-finder-card__desc">{product.shortDescription}</p>
      <p className="price">{formatCad(product.price)}</p>
      <ProductCardActions
        productId={product.id}
        productSlug={product.slug}
        productName={product.name}
        variants={product.variants}
        defaultVariantId={defaultVariant?.id}
        price={product.price}
        showQuickView={false}
      />
    </article>
  );
}

const finderStyles = `
  .hp-finder { display: grid; gap: 2rem; }
  .hp-finder__form { padding: 1.5rem; display: grid; gap: 1rem; }
  .hp-finder__title { margin: 0; font-family: var(--font-display); color: #102820; font-size: 1.5rem; }
  .hp-finder__lede { margin: 0; color: rgb(36 40 36 / 0.78); line-height: 1.55; }
  .hp-finder__form label { display: grid; gap: 0.35rem; font-weight: 650; font-size: 0.92rem; }
  .hp-finder__form select {
    min-height: 44px; border: 1px solid rgb(23 59 50 / 0.2);
    border-radius: 0.5rem; padding: 0.5rem 0.75rem; font: inherit; background: #FFFEFB;
  }
  .hp-finder__actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.25rem; }
  .hp-finder__results { display: grid; gap: 1.25rem; }
  .hp-finder__results-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .hp-finder__results-head h3 { margin: 0; font-family: var(--font-display); color: #102820; }
  .hp-finder__none { margin: 0; color: rgb(36 40 36 / 0.78); }
  .hp-finder__alt-title { margin: 0.5rem 0 0; font-family: var(--font-display); color: #285B68; font-size: 1.15rem; }
  .hp-finder-card { display: grid; gap: 0.45rem; }
  .hp-finder-card img { width: 100%; border-radius: 0.65rem; aspect-ratio: 1; object-fit: cover; background: #F7F3EC; }
  .hp-finder-card__name { font-weight: 700; color: #173B32; text-decoration: none; }
  .hp-finder-card__desc { margin: 0; font-size: 0.88rem; color: rgb(36 40 36 / 0.72); line-height: 1.4; }
`;
