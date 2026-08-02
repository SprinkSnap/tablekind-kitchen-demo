import { useCart } from './CartProvider';
import { formatCad } from '../../lib/currency';
import { DISCLOSURE } from '../../lib/config';

export default function CartPage() {
  const { cart, totals, updateQty, removeItem, clear } = useCart();

  if (cart.lines.length === 0) {
    return (
      <div className="hp-cart-page-empty">
        <h2>Your demo cart is empty</h2>
        <p>Add items from the shop to try the Harbour &amp; Pine checkout demonstration.</p>
        <a className="btn btn-primary" href="/shop/">
          Continue shopping
        </a>
        <style>{cartPageStyles}</style>
      </div>
    );
  }

  return (
    <div className="hp-cart-page">
      <div className="hp-cart-page__head">
        <p>{totals.itemCount} items in demo cart</p>
        <button type="button" className="btn btn-ghost" onClick={clear}>
          Clear cart
        </button>
      </div>

      <ul className="hp-cart-page__lines">
        {cart.lines.map((line) => (
          <li key={line.key} className="hp-cart-page__line">
            <a href={`/products/${line.slug}/`}>
              <img src={line.image} alt="" width={96} height={96} />
            </a>
            <div className="hp-cart-page__body">
              <a href={`/products/${line.slug}/`} className="hp-cart-page__name">
                {line.name}
              </a>
              <p className="hp-cart-page__variant">{line.variantName}</p>
              <p className="price">{formatCad(line.unitPrice)}</p>
              <div className="hp-cart-page__controls">
                <label className="sr-only" htmlFor={`cart-qty-${line.key}`}>
                  Quantity for {line.name}
                </label>
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${line.name}`}
                  onClick={() => updateQty(line.key, line.quantity - 1)}
                >
                  −
                </button>
                <input
                  id={`cart-qty-${line.key}`}
                  type="number"
                  min={1}
                  max={99}
                  value={line.quantity}
                  onChange={(e) => updateQty(line.key, Number(e.target.value) || 1)}
                />
                <button
                  type="button"
                  aria-label={`Increase quantity of ${line.name}`}
                  onClick={() => updateQty(line.key, line.quantity + 1)}
                >
                  +
                </button>
                <button type="button" className="hp-cart-page__remove" onClick={() => removeItem(line.key)}>
                  Remove
                </button>
              </div>
              <p className="hp-cart-page__line-total">
                Line total: {formatCad(line.unitPrice * line.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <aside className="hp-cart-page__summary">
        <h3>Order summary</h3>
        <dl>
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
          <div className="hp-cart-page__total">
            <dt>Total</dt>
            <dd>{formatCad(totals.total)}</dd>
          </div>
        </dl>
        <p className="disclosure">{DISCLOSURE.cart}</p>
        <a className="btn btn-primary" href="/checkout/">
          Demo checkout
        </a>
        <a className="btn btn-secondary" href="/shop/">
          Continue shopping
        </a>
      </aside>

      <style>{cartPageStyles}</style>
    </div>
  );
}

const cartPageStyles = `
  .hp-cart-page-empty { text-align: center; padding: 2rem 0; display: grid; gap: 1rem; }
  .hp-cart-page-empty h2 { margin: 0; font-family: var(--font-display); color: #102820; }
  .hp-cart-page { display: grid; gap: 1.5rem; }
  @media (min-width: 900px) {
    .hp-cart-page { grid-template-columns: 1fr min(22rem, 100%); align-items: start; }
    .hp-cart-page__summary { grid-column: 2; grid-row: 1 / span 2; }
  }
  .hp-cart-page__head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; }
  .hp-cart-page__lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }
  .hp-cart-page__line { display: flex; gap: 1rem; padding: 1rem; background: #FFFEFB; border: 1px solid rgb(23 59 50 / 0.08); border-radius: 0.75rem; }
  .hp-cart-page__line img { border-radius: 0.5rem; object-fit: cover; }
  .hp-cart-page__body { flex: 1; display: grid; gap: 0.25rem; }
  .hp-cart-page__name { font-weight: 700; color: #173B32; text-decoration: none; }
  .hp-cart-page__variant { margin: 0; font-size: 0.9rem; color: rgb(36 40 36 / 0.72); }
  .hp-cart-page__controls { display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.35rem; }
  .hp-cart-page__controls button {
    min-width: 40px; min-height: 40px; border-radius: 0.35rem;
    border: 1px solid rgb(23 59 50 / 0.2); background: #F7F3EC; cursor: pointer; font: inherit;
  }
  .hp-cart-page__controls input {
    width: 3rem; text-align: center; min-height: 40px;
    border: 1px solid rgb(23 59 50 / 0.2); border-radius: 0.35rem; font: inherit;
  }
  .hp-cart-page__remove { background: transparent !important; border: none !important; color: #285B68; text-decoration: underline; }
  .hp-cart-page__line-total { margin: 0.25rem 0 0; font-weight: 650; font-size: 0.92rem; }
  .hp-cart-page__summary { display: grid; gap: 0.75rem; padding: 1.25rem; background: #F7F3EC; border-radius: 0.75rem; }
  .hp-cart-page__summary h3 { margin: 0; font-family: var(--font-display); color: #102820; }
  .hp-cart-page__summary dl { margin: 0; display: grid; gap: 0.35rem; }
  .hp-cart-page__summary dl > div { display: flex; justify-content: space-between; }
  .hp-cart-page__total { font-weight: 700; padding-top: 0.35rem; border-top: 1px solid rgb(23 59 50 / 0.12); color: #173B32; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
`;
