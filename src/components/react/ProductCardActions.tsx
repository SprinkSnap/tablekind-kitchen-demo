import { useId, useRef, useState } from 'react';
import { useCart } from './CartProvider';
import { formatCad } from '../../lib/currency';
import { getProductById } from '../../data/products';

type Variant = { id: string; name: string; available: boolean };

type Props = {
  productId: string;
  productSlug: string;
  productName: string;
  variants: Variant[];
  defaultVariantId?: string;
  price: number;
  showQuickView?: boolean;
};

export default function ProductCardActions({
  productId,
  productSlug,
  productName,
  variants,
  defaultVariantId,
  price,
  showQuickView = true,
}: Props) {
  const { addItem, toggleWish, isWishlisted, openCart } = useCart();
  const [quickOpen, setQuickOpen] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const defaultVariant =
    variants.find((v) => v.id === defaultVariantId && v.available) ??
    variants.find((v) => v.available);

  const wishlisted = isWishlisted(productId);
  const product = getProductById(productId);

  const handleAdd = () => {
    if (!defaultVariant) return;
    addItem(productId, defaultVariant.id, 1);
    openCart();
  };

  const openQuick = () => {
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuickOpen(true);
  };

  const closeQuick = () => {
    setQuickOpen(false);
    lastFocus.current?.focus();
  };

  return (
    <>
      <div className="hp-card-actions">
        <button
          type="button"
          className="hp-card-actions__wish"
          aria-label={wishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
          aria-pressed={wishlisted}
          onClick={() => toggleWish(productId)}
        >
          <span className="sr-only">{wishlisted ? 'Saved' : 'Save'}</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path d="M12 20.5s-7.2-4.35-9.5-8.35C.9 9.1 2.4 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.6 0 5.1 3.6 3.5 6.65C19.2 16.15 12 20.5 12 20.5z" />
          </svg>
        </button>
        <button
          type="button"
          className="hp-card-actions__cart btn btn-primary"
          disabled={!defaultVariant}
          onClick={handleAdd}
        >
          Add to demo cart
        </button>
        {showQuickView && (
          <button
            type="button"
            className="hp-card-actions__quick btn btn-ghost"
            onClick={openQuick}
          >
            Quick view
          </button>
        )}
      </div>

      {quickOpen && product && (
        <div className="hp-quick-overlay" onClick={closeQuick}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="hp-quick-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hp-quick-dialog__head">
              <h3 id={titleId}>{product.name}</h3>
              <button type="button" onClick={closeQuick} aria-label="Close quick view">
                Close
              </button>
            </div>
            <img src={product.images[0]} alt={product.imageAlt[0] ?? product.name} />
            <p>{product.shortDescription}</p>
            <p className="price">{formatCad(price)}</p>
            <a className="btn btn-primary" href={`/products/${productSlug}/`}>
              View product
            </a>
          </div>
        </div>
      )}

      <style>{`
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); border: 0;
        }
        .hp-card-actions { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
        .hp-card-actions__wish {
          min-width: 44px; min-height: 44px; border-radius: 999px;
          border: 1px solid rgb(23 59 50 / 0.2); background: #F7F3EC;
          font-size: 1.1rem; cursor: pointer;
        }
        .hp-card-actions__cart, .hp-card-actions__quick { flex: 1; min-width: 7rem; font-size: 0.85rem; padding: 0.5rem 0.75rem; min-height: 44px; }
        .hp-quick-overlay {
          position: fixed; inset: 0; z-index: 70; background: rgb(16 40 32 / 0.5);
          display: grid; place-items: center; padding: 1rem;
        }
        .hp-quick-dialog {
          width: min(22rem, 100%); background: #FFFEFB; border-radius: 1rem;
          padding: 1rem; display: grid; gap: 0.75rem; color: #242824;
        }
        .hp-quick-dialog__head { display: flex; justify-content: space-between; gap: 0.75rem; align-items: start; }
        .hp-quick-dialog__head h3 { margin: 0; font-family: var(--font-display); color: #102820; font-size: 1.15rem; }
        .hp-quick-dialog img { border-radius: 0.5rem; width: 100%; }
        .hp-quick-dialog p { margin: 0; font-size: 0.92rem; line-height: 1.5; }
      `}</style>
    </>
  );
}
