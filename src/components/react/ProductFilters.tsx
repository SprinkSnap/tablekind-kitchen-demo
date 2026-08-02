import { useEffect, useState } from 'react';
import { track } from '../../lib/analytics';
import { formatCad } from '../../lib/currency';
import {
  COLLECTIONS,
  COLOUR_LABELS,
  filterProducts,
  getAllCategories,
  getPriceBounds,
  type CollectionSlug,
  type ColourFamily,
  type Product,
  type ProductFilterState,
} from '../../data/products';
import ProductCardActions from './ProductCardActions';

type Props = {
  initialCollection?: string;
  mode: 'shop' | 'collection' | 'search';
};

type Filters = {
  q: string;
  collection: string;
  colour: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  available: string;
  sort: ProductFilterState['sort'];
};

const bounds = getPriceBounds();
const allCategories = getAllCategories();

function readParams(): Filters {
  if (typeof window === 'undefined') {
    return {
      q: '',
      collection: '',
      colour: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      available: '',
      sort: 'featured',
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get('q') ?? '',
    collection: params.get('collection') ?? '',
    colour: params.get('colour') ?? '',
    category: params.get('category') ?? '',
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    available: params.get('available') ?? '',
    sort: (params.get('sort') as ProductFilterState['sort']) ?? 'featured',
  };
}

function filtersToState(filters: Filters, initialCollection?: string): ProductFilterState {
  const state: ProductFilterState = { sort: filters.sort ?? 'featured' };
  if (filters.q.trim()) state.q = filters.q.trim();
  const collection = filters.collection || initialCollection;
  if (collection) state.collection = collection as CollectionSlug;
  if (filters.colour) state.colour = filters.colour as ColourFamily;
  if (filters.category) state.category = filters.category;
  if (filters.minPrice) state.minPrice = Number(filters.minPrice);
  if (filters.maxPrice) state.maxPrice = Number(filters.maxPrice);
  if (filters.available === 'true') state.available = true;
  if (filters.available === 'false') state.available = false;
  return state;
}

function writeParams(filters: Filters, replace: boolean) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.collection) params.set('collection', filters.collection);
  if (filters.colour) params.set('colour', filters.colour);
  if (filters.category) params.set('category', filters.category);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.available) params.set('available', filters.available);
  if (filters.sort && filters.sort !== 'featured') params.set('sort', filters.sort);
  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
}

export default function ProductFilters({ initialCollection, mode }: Props) {
  const [filters, setFilters] = useState<Filters>(() => ({
    ...readParams(),
    collection: readParams().collection || (mode === 'collection' ? initialCollection ?? '' : ''),
  }));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const filterState = filtersToState(filters, mode === 'collection' ? initialCollection : undefined);
  const products = filterProducts(filterState);

  useEffect(() => {
    writeParams(filters, true);
    setAnnouncement(`${products.length} products found`);
  }, [filters, products.length]);

  useEffect(() => {
    const onPop = () => setFilters({
      ...readParams(),
      collection: readParams().collection || (mode === 'collection' ? initialCollection ?? '' : ''),
    });
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [initialCollection, mode]);

  const updateFilter = (patch: Partial<Filters>, analytics?: { filter?: string; search?: boolean }) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    if (analytics?.search) track('search_used', { mode });
    if (analytics?.filter) track('filter_used', { filter: analytics.filter, mode });
  };

  const clearAll = () => {
    setFilters({
      q: '',
      collection: mode === 'collection' ? initialCollection ?? '' : '',
      colour: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      available: '',
      sort: 'featured',
    });
  };

  const activeFilters = [
    filters.q && { key: 'q', label: `Search: ${filters.q}` },
    filters.collection && mode === 'shop' && {
      key: 'collection',
      label: COLLECTIONS.find((c) => c.slug === filters.collection)?.name ?? filters.collection,
    },
    filters.colour && { key: 'colour', label: COLOUR_LABELS[filters.colour as ColourFamily] },
    filters.category && { key: 'category', label: filters.category },
    filters.minPrice && { key: 'minPrice', label: `Min ${formatCad(Number(filters.minPrice))}` },
    filters.maxPrice && { key: 'maxPrice', label: `Max ${formatCad(Number(filters.maxPrice))}` },
    filters.available === 'true' && { key: 'available', label: 'In stock' },
    filters.available === 'false' && { key: 'available', label: 'Unavailable' },
    filters.sort && filters.sort !== 'featured' && { key: 'sort', label: `Sort: ${filters.sort}` },
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  return (
    <div className="hp-filters">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="hp-filters__toolbar">
        <label className="hp-filters__search">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            placeholder="Search products…"
            value={filters.q}
            onChange={(e) => updateFilter({ q: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                track('search_used', { mode });
                writeParams({ ...filters, q: e.currentTarget.value }, false);
              }
            }}
          />
        </label>
        <button
          type="button"
          className="hp-filters__toggle btn btn-ghost"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          {filtersOpen ? 'Hide filters' : 'Show filters'}
        </button>
        <label className="hp-filters__sort">
          <span className="sr-only">Sort by</span>
          <select
            value={filters.sort ?? 'featured'}
            onChange={(e) =>
              updateFilter(
                { sort: e.target.value as ProductFilterState['sort'] },
                { filter: 'sort' },
              )
            }
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name A–Z</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>

      {activeFilters.length > 0 && (
        <div className="hp-filters__active">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              className="chip"
              onClick={() => {
                const patch: Partial<Filters> = { [f.key]: f.key === 'sort' ? 'featured' : '' };
                if (f.key === 'available') patch.available = '';
                updateFilter(patch);
              }}
            >
              {f.label} ×
            </button>
          ))}
          <button type="button" className="hp-filters__clear" onClick={clearAll}>
            Clear all
          </button>
        </div>
      )}

      <div className={`hp-filters__panel${filtersOpen ? ' is-open' : ''}`}>
        {mode === 'shop' && (
          <label>
            Collection
            <select
              value={filters.collection}
              onChange={(e) => updateFilter({ collection: e.target.value }, { filter: 'collection' })}
            >
              <option value="">All collections</option>
              {COLLECTIONS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Colour
          <select
            value={filters.colour}
            onChange={(e) => updateFilter({ colour: e.target.value }, { filter: 'colour' })}
          >
            <option value="">All colours</option>
            {(Object.keys(COLOUR_LABELS) as ColourFamily[]).map((colour) => (
              <option key={colour} value={colour}>
                {COLOUR_LABELS[colour]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select
            value={filters.category}
            onChange={(e) => updateFilter({ category: e.target.value }, { filter: 'category' })}
          >
            <option value="">All categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <div className="hp-filters__price">
          <label>
            Min price
            <input
              type="number"
              min={bounds.min}
              max={bounds.max}
              placeholder={String(bounds.min)}
              value={filters.minPrice}
              onChange={(e) => updateFilter({ minPrice: e.target.value }, { filter: 'price' })}
            />
          </label>
          <label>
            Max price
            <input
              type="number"
              min={bounds.min}
              max={bounds.max}
              placeholder={String(bounds.max)}
              value={filters.maxPrice}
              onChange={(e) => updateFilter({ maxPrice: e.target.value }, { filter: 'price' })}
            />
          </label>
        </div>
        <label>
          Availability
          <select
            value={filters.available}
            onChange={(e) => updateFilter({ available: e.target.value }, { filter: 'availability' })}
          >
            <option value="">All</option>
            <option value="true">In stock</option>
            <option value="false">Unavailable</option>
          </select>
        </label>
      </div>

      {products.length === 0 ? (
        <div className="hp-filters__empty" role="status">
          <h3>No products match your filters</h3>
          <p>Try adjusting your search or clearing filters to see more of the demo catalogue.</p>
          <button type="button" className="btn btn-secondary" onClick={clearAll}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductGridCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <style>{filterStyles}</style>
    </div>
  );
}

function ProductGridCard({ product }: { product: Product }) {
  const defaultVariant = product.variants.find((v) => v.available) ?? product.variants[0];
  return (
    <article className="hp-product-card">
      <a href={`/products/${product.slug}/`} className="hp-product-card__image">
        <img src={product.images[0]} alt={product.imageAlt[0] ?? product.name} loading="lazy" />
      </a>
      <div className="hp-product-card__body">
        <a href={`/products/${product.slug}/`} className="hp-product-card__name">
          {product.name}
        </a>
        <p className="price">{formatCad(product.price)}</p>
        <ProductCardActions
          productId={product.id}
          productSlug={product.slug}
          productName={product.name}
          variants={product.variants}
          defaultVariantId={defaultVariant?.id}
          price={product.price}
        />
      </div>
    </article>
  );
}

const filterStyles = `
  .hp-filters { display: grid; gap: 1.25rem; }
  .hp-filters__toolbar {
    display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center;
  }
  .hp-filters__search { flex: 1; min-width: 12rem; }
  .hp-filters__search input, .hp-filters__sort select, .hp-filters__panel select, .hp-filters__panel input {
    width: 100%; min-height: 44px; border: 1px solid rgb(23 59 50 / 0.2);
    border-radius: 0.5rem; padding: 0.5rem 0.75rem; font: inherit; background: #FFFEFB;
  }
  .hp-filters__panel {
    display: none; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.75rem; padding: 1rem; background: #F7F3EC; border-radius: 0.75rem;
  }
  .hp-filters__panel.is-open { display: grid; }
  @media (min-width: 768px) {
    .hp-filters__panel { display: grid; }
    .hp-filters__toggle { display: none; }
  }
  .hp-filters__panel label { display: grid; gap: 0.35rem; font-weight: 650; font-size: 0.9rem; }
  .hp-filters__price { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; grid-column: 1 / -1; }
  .hp-filters__active { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
  .hp-filters__clear { background: none; border: none; color: #285B68; text-decoration: underline; cursor: pointer; font: inherit; font-weight: 650; }
  .hp-filters__empty { text-align: center; padding: 2.5rem 1rem; background: #FFFEFB; border-radius: 0.75rem; border: 1px solid rgb(23 59 50 / 0.08); }
  .hp-filters__empty h3 { margin: 0 0 0.5rem; font-family: var(--font-display); color: #102820; }
  .hp-product-card { display: grid; gap: 0.6rem; }
  .hp-product-card__image img { width: 100%; border-radius: 0.65rem; aspect-ratio: 1; object-fit: cover; background: #F7F3EC; }
  .hp-product-card__name { font-weight: 700; color: #173B32; text-decoration: none; line-height: 1.3; }
  .hp-product-card__body { display: grid; gap: 0.35rem; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
`;
