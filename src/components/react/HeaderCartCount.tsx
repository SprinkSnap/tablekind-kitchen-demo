import { useEffect, useState } from 'react';
import { loadCart, calculateTotals } from '../../lib/cart';

export default function HeaderCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = (detail?: { itemCount?: number }) => {
      if (typeof detail?.itemCount === 'number') {
        setCount(detail.itemCount);
      } else {
        setCount(calculateTotals(loadCart()).itemCount);
      }
    };

    update();
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ itemCount?: number }>;
      update(custom.detail);
    };
    document.addEventListener('hp:cart-updated', handler);
    return () => document.removeEventListener('hp:cart-updated', handler);
  }, []);

  return (
    <button
      type="button"
      className="hp-header-cart"
      data-open-cart="drawer"
      aria-label={count > 0 ? `Open demo cart drawer, ${count} items` : 'Open demo cart drawer, empty'}
    >
      <span aria-hidden="true" className="hp-header-cart__icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="19.5" r="1.25" fill="currentColor" />
          <circle cx="17.5" cy="19.5" r="1.25" fill="currentColor" />
        </svg>
      </span>
      {count > 0 && (
        <span className="hp-header-cart__badge" aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
      <style>{`
        .hp-header-cart {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          min-height: 44px;
          color: #173B32;
          border: 0;
          background: transparent;
          border-radius: 999px;
          cursor: pointer;
          padding: 0;
          font: inherit;
        }
        .hp-header-cart:hover { background: rgb(23 59 50 / 0.06); }
        .hp-header-cart__badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 1.15rem;
          height: 1.15rem;
          padding: 0 0.25rem;
          border-radius: 999px;
          background: #285B68;
          color: #FFFEFB;
          font-size: 0.68rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
      `}</style>
    </button>
  );
}
