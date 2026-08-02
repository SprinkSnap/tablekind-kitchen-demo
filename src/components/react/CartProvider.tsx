import { useEffect, useId, useRef, useState } from 'react';
import { useCartStore } from '../../lib/cart-store';
import { formatCad } from '../../lib/currency';
import { DISCLOSURE } from '../../lib/config';
import type { CartLine, CartState, CartTotals } from '../../lib/cart';

export function useCart() {
  return useCartStore();
}

export default function CartProvider() {
  const { cart, totals, updateQty, removeItem, statusMessage } = useCartStore();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setCartOpen(true);
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest('[data-open-cart="drawer"]');
      if (trigger) {
        event.preventDefault();
        setCartOpen(true);
      }
    };
    document.addEventListener('hp:open-cart', openHandler);
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('hp:open-cart', openHandler);
      document.removeEventListener('click', clickHandler);
    };
  }, []);

  return (
    <>
      <div data-cart-host hidden aria-hidden="true" />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </div>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        totals={totals}
        onUpdateQty={updateQty}
        onRemove={removeItem}
      />
      <style>{providerStyles}</style>
    </>
  );
}

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  cart: CartState;
  totals: CartTotals;
  onUpdateQty: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
};

function CartDrawer({ open, onClose, cart, totals, onUpdateQty, onRemove }: DrawerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    const panel = dialogRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select',
    );
    focusable?.[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="hp-cart-overlay" onClick={onClose}>
      <div
        className="hp-cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hp-cart-drawer__head">
          <h2 id={titleId}>Demo cart</h2>
          <button type="button" onClick={onClose} aria-label="Close cart">
            Close
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="hp-cart-empty">
            <p>Your demo cart is empty.</p>
            <a className="btn btn-primary" href="/shop/" onClick={onClose}>
              Continue shopping
            </a>
          </div>
        ) : (
          <>
            <ul className="hp-cart-lines">
              {cart.lines.map((line) => (
                <CartLineItem
                  key={line.key}
                  line={line}
                  onUpdateQty={onUpdateQty}
                  onRemove={onRemove}
                />
              ))}
            </ul>
            <dl className="hp-cart-totals">
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
              <div className="hp-cart-totals__total">
                <dt>Total</dt>
                <dd>{formatCad(totals.total)}</dd>
              </div>
            </dl>
            <p className="hp-cart-disclosure">{DISCLOSURE.cart}</p>
            <div className="hp-cart-actions">
              <a className="btn btn-primary" href="/checkout/" onClick={onClose}>
                Demo checkout
              </a>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CartLineItem({
  line,
  onUpdateQty,
  onRemove,
}: {
  line: CartLine;
  onUpdateQty: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
}) {
  const qtyId = useId();
  return (
    <li className="hp-cart-line">
      <a href={`/products/${line.slug}/`} className="hp-cart-line__image">
        <img src={line.image} alt="" width={72} height={72} />
      </a>
      <div className="hp-cart-line__body">
        <a href={`/products/${line.slug}/`} className="hp-cart-line__name">
          {line.name}
        </a>
        <p className="hp-cart-line__variant">{line.variantName}</p>
        <p className="hp-cart-line__price">{formatCad(line.unitPrice)}</p>
        <div className="hp-cart-line__controls">
          <label htmlFor={qtyId} className="sr-only">
            Quantity for {line.name}
          </label>
          <button
            type="button"
            aria-label={`Decrease quantity of ${line.name}`}
            onClick={() => onUpdateQty(line.key, line.quantity - 1)}
          >
            −
          </button>
          <input
            id={qtyId}
            type="number"
            min={1}
            max={99}
            value={line.quantity}
            onChange={(e) => onUpdateQty(line.key, Number(e.target.value) || 1)}
            aria-label={`Quantity for ${line.name}`}
          />
          <button
            type="button"
            aria-label={`Increase quantity of ${line.name}`}
            onClick={() => onUpdateQty(line.key, line.quantity + 1)}
          >
            +
          </button>
          <button
            type="button"
            className="hp-cart-line__remove"
            onClick={() => onRemove(line.key)}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

const providerStyles = `
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); border: 0;
  }
  .hp-cart-overlay {
    position: fixed; inset: 0; z-index: 75;
    background: rgb(16 40 32 / 0.5);
    display: flex; justify-content: flex-end;
  }
  .hp-cart-drawer {
    width: min(28rem, 100%); height: 100%; overflow: auto;
    background: #FFFEFB; padding: 1.25rem; color: #242824;
    display: flex; flex-direction: column; gap: 1rem;
  }
  .hp-cart-drawer__head {
    display: flex; justify-content: space-between; align-items: start; gap: 1rem;
  }
  .hp-cart-drawer__head h2 {
    font-family: var(--font-display); font-size: 1.35rem; margin: 0; color: #102820;
  }
  .hp-cart-drawer__head button {
    min-height: 44px; border-radius: 999px;
    border: 1px solid rgb(23 59 50 / 0.2); background: #F7F3EC;
    padding: 0.4rem 0.9rem; cursor: pointer; font: inherit;
  }
  .hp-cart-empty { display: grid; gap: 1rem; text-align: center; padding: 2rem 0; }
  .hp-cart-lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }
  .hp-cart-line { display: flex; gap: 0.75rem; }
  .hp-cart-line__image img { border-radius: 0.5rem; object-fit: cover; }
  .hp-cart-line__body { flex: 1; min-width: 0; }
  .hp-cart-line__name { font-weight: 700; color: #173B32; text-decoration: none; }
  .hp-cart-line__variant, .hp-cart-line__price { margin: 0.15rem 0; font-size: 0.9rem; }
  .hp-cart-line__controls { display: flex; align-items: center; gap: 0.35rem; margin-top: 0.5rem; flex-wrap: wrap; }
  .hp-cart-line__controls button {
    min-width: 36px; min-height: 36px; border-radius: 0.35rem;
    border: 1px solid rgb(23 59 50 / 0.2); background: #F7F3EC; cursor: pointer; font: inherit;
  }
  .hp-cart-line__controls input {
    width: 3rem; text-align: center; min-height: 36px;
    border: 1px solid rgb(23 59 50 / 0.2); border-radius: 0.35rem; font: inherit;
  }
  .hp-cart-line__remove {
    margin-left: auto; background: transparent !important; border: none !important;
    color: #285B68; text-decoration: underline; font-size: 0.85rem;
  }
  .hp-cart-totals { margin: 0; display: grid; gap: 0.35rem; font-size: 0.92rem; }
  .hp-cart-totals > div { display: flex; justify-content: space-between; }
  .hp-cart-totals__total { font-weight: 700; font-size: 1.05rem; color: #173B32; padding-top: 0.35rem; border-top: 1px solid rgb(23 59 50 / 0.12); }
  .hp-cart-disclosure { font-size: 0.85rem; color: rgb(36 40 36 / 0.72); margin: 0; }
  .hp-cart-actions { display: grid; gap: 0.6rem; margin-top: auto; }
`;
