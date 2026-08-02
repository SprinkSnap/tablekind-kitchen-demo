import { useEffect, useMemo, useState } from 'react';
import {
  CATEGORY_META,
  DIETARY_LABELS,
  getPickupItems,
  getMenuItem,
  type MenuItem,
  type MenuModifier,
} from '../../data/menu';
import {
  addToCart,
  calculateTotals,
  clearCart,
  createEmptyCart,
  loadCart,
  removeLine,
  saveCart,
  updateQuantity,
  type CartState,
} from '../../lib/cart';
import { formatCad } from '../../lib/currency';
import { track } from '../../lib/analytics';
import { getPackagesUrl } from '../../lib/config';

const PICKUP_TIMES = ['11:30', '12:00', '12:30', '17:30', '18:00', '18:30', '19:00'];

export default function OrderDemo({ initialItemSlug }: { initialItemSlug?: string }) {
  const items = useMemo(() => getPickupItems(), []);
  const [cart, setCart] = useState<CartState>(createEmptyCart());
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [selectedMods, setSelectedMods] = useState<MenuModifier[]>([]);
  const [qty, setQty] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [category, setCategory] = useState<string>('all');
  const totals = calculateTotals(cart);

  useEffect(() => {
    const loaded = loadCart();
    setCart(loaded);
    track('order_demo_started');
    const fromQuery =
      initialItemSlug ||
      new URLSearchParams(window.location.search).get('item') ||
      undefined;
    if (fromQuery) {
      const item = getMenuItem(fromQuery);
      if (item?.availableForPickup) setActiveItem(item);
    }
  }, [initialItemSlug]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const visible = items.filter((item) => category === 'all' || item.category === category);

  const openItem = (item: MenuItem) => {
    setActiveItem(item);
    setSelectedMods([]);
    setQty(1);
    track('featured_item_selected', { itemId: item.id, source: 'order' });
  };

  const addItem = () => {
    if (!activeItem) return;
    const next = addToCart(cart, activeItem.id, qty, selectedMods);
    setCart(next);
    setActiveItem(null);
    setCartOpen(true);
    track('item_added_to_demo_cart', { itemId: activeItem.id, quantity: qty });
  };

  const completeOrder = () => {
    setCompleted(true);
    setCartOpen(false);
    track('order_demo_completed', { itemCount: totals.itemCount });
    setCart(clearCart());
  };

  if (completed) {
    return (
      <div className="order-complete surface" role="status">
        <h2>You’ve completed the Tablekind ordering demonstration.</h2>
        <p>Give your customers a fast, mobile-friendly ordering experience.</p>
        <div className="actions">
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => document.dispatchEvent(new CustomEvent('tk:open-enquiry'))}
          >
            Build My Website
          </button>
          <a className="btn btn-secondary" href={getPackagesUrl()} target="_blank" rel="noopener noreferrer">
            View Che Xu Studio Packages
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => setCompleted(false)}>
            Browse demo menu again
          </button>
        </div>
        <style>{completeStyles}</style>
      </div>
    );
  }

  return (
    <div className="order-demo">
      <div className="toolbar">
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All pickup items</option>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-primary" onClick={() => setCartOpen(true)}>
          Demo cart ({totals.itemCount})
        </button>
      </div>

      <ul className="order-grid">
        {visible.map((item) => (
          <li key={item.id}>
            <button type="button" className="dish-card" onClick={() => openItem(item)}>
              <img src={item.image} alt="" width="1200" height="900" loading="lazy" />
              <span className="dish-card__body">
                <span className="row">
                  <strong>{item.name}</strong>
                  <span className="price">{formatCad(item.price)}</span>
                </span>
                <span>{item.description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {activeItem && (
        <div className="drawer-overlay" onClick={() => setActiveItem(null)}>
          <div
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.name}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer__head">
              <h2>{activeItem.name}</h2>
              <button type="button" onClick={() => setActiveItem(null)}>
                Close
              </button>
            </div>
            <img src={activeItem.image} alt={activeItem.imageAlt} width="1200" height="900" />
            <p>{activeItem.description}</p>
            <p className="price">{formatCad(activeItem.price)}</p>
            {activeItem.dietaryLabels.length > 0 && (
              <ul className="chips">
                {activeItem.dietaryLabels.map((label) => (
                  <li key={label} className="chip">
                    {DIETARY_LABELS[label]}
                  </li>
                ))}
              </ul>
            )}
            {activeItem.modifiers.length > 0 && (
              <fieldset>
                <legend>Modifiers</legend>
                {activeItem.modifiers.map((mod) => (
                  <label key={mod.id} className="check">
                    <input
                      type="checkbox"
                      checked={selectedMods.some((m) => m.id === mod.id)}
                      onChange={() => {
                        setSelectedMods((prev) =>
                          prev.some((m) => m.id === mod.id)
                            ? prev.filter((m) => m.id !== mod.id)
                            : [...prev, mod],
                        );
                      }}
                    />
                    {mod.name}
                    {mod.priceDelta > 0 ? ` (+${formatCad(mod.priceDelta)})` : ''}
                  </label>
                ))}
              </fieldset>
            )}
            <label>
              Quantity
              <input
                type="number"
                min={1}
                max={12}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <button type="button" className="btn btn-primary" onClick={addItem}>
              Add to demo cart
            </button>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="drawer-overlay" onClick={() => setCartOpen(false)}>
          <div
            className="drawer cart"
            role="dialog"
            aria-modal="true"
            aria-label="Demo cart"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer__head">
              <h2>Demo cart</h2>
              <button type="button" onClick={() => setCartOpen(false)}>
                Close
              </button>
            </div>
            <p className="reassure">
              Demo ordering only—no food will be prepared and no real payment will be processed.
            </p>
            {cart.lines.length === 0 ? (
              <p role="status">Your demo cart is empty. Choose a dish to get started.</p>
            ) : (
              <>
                <ul className="cart-lines">
                  {cart.lines.map((line) => (
                    <li key={line.key}>
                      <div>
                        <strong>{line.name}</strong>
                        {line.modifiers.length > 0 && (
                          <p>{line.modifiers.map((m) => m.name).join(', ')}</p>
                        )}
                        <p className="price">{formatCad(line.unitPrice * line.quantity)}</p>
                      </div>
                      <div className="qty">
                        <button
                          type="button"
                          aria-label={`Decrease ${line.name}`}
                          onClick={() => setCart(updateQuantity(cart, line.key, line.quantity - 1))}
                        >
                          −
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${line.name}`}
                          onClick={() => setCart(updateQuantity(cart, line.key, line.quantity + 1))}
                        >
                          +
                        </button>
                        <button type="button" onClick={() => setCart(removeLine(cart, line.key))}>
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <label>
                  Pickup time
                  <select
                    value={cart.pickupTime ?? ''}
                    onChange={(e) => setCart({ ...cart, pickupTime: e.target.value })}
                  >
                    <option value="">Select a demo pickup time</option>
                    {PICKUP_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Demo order notes
                  <textarea
                    rows={3}
                    value={cart.orderNotes ?? ''}
                    onChange={(e) => setCart({ ...cart, orderNotes: e.target.value })}
                    placeholder="Notes stay in your browser only"
                  />
                </label>
                <dl className="totals">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatCad(totals.subtotal)}</dd>
                  </div>
                  <div>
                    <dt>Sample tax (13%)</dt>
                    <dd>{formatCad(totals.tax)}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{formatCad(totals.total)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!cart.pickupTime}
                  onClick={completeOrder}
                >
                  Complete demo order
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{orderStyles}</style>
    </div>
  );
}

const completeStyles = `
  .order-complete { padding: 1.5rem; display: grid; gap: 0.85rem; }
  .order-complete h2 { font-family: var(--font-display); color: #10271E; margin: 0; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
`;

const orderStyles = `
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .toolbar label { display: grid; gap: 0.35rem; font-weight: 650; }
  select, input, textarea {
    min-height: 44px;
    border-radius: 0.7rem;
    border: 1px solid rgb(24 57 43 / 0.2);
    padding: 0.5rem 0.75rem;
    font: inherit;
  }
  .order-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.85rem;
    grid-template-columns: 1fr;
  }
  @media (min-width: 700px) {
    .order-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 1100px) {
    .order-grid { grid-template-columns: 1fr 1fr 1fr; }
  }
  .dish-card {
    width: 100%;
    text-align: left;
    border: 1px solid rgb(24 57 43 / 0.1);
    border-radius: 1rem;
    overflow: hidden;
    background: rgb(255 253 252 / 0.88);
    cursor: pointer;
    padding: 0;
    font: inherit;
    color: inherit;
  }
  .dish-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
  .dish-card__body { display: grid; gap: 0.35rem; padding: 0.85rem; }
  .row { display: flex; justify-content: space-between; gap: 0.75rem; }
  .drawer-overlay {
    position: fixed;
    inset: 0;
    z-index: 70;
    background: rgb(16 39 30 / 0.45);
    display: flex;
    justify-content: flex-end;
  }
  .drawer {
    width: min(28rem, 100%);
    height: 100%;
    overflow: auto;
    background: #FFFDFC;
    padding: 1.1rem;
    display: grid;
    gap: 0.75rem;
    align-content: start;
  }
  .drawer__head { display: flex; justify-content: space-between; gap: 1rem; align-items: start; }
  .drawer h2 { margin: 0; font-family: var(--font-display); color: #10271E; }
  .drawer img { width: 100%; border-radius: 0.85rem; aspect-ratio: 4/3; object-fit: cover; }
  .drawer__head button, .qty button {
    min-height: 40px;
    border-radius: 999px;
    border: 1px solid rgb(24 57 43 / 0.2);
    background: #F7F2E8;
    padding: 0.3rem 0.8rem;
    cursor: pointer;
  }
  .check { display: flex; gap: 0.5rem; align-items: center; margin: 0.35rem 0; }
  .chips { list-style: none; display: flex; flex-wrap: wrap; gap: 0.35rem; padding: 0; margin: 0; }
  .cart-lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.85rem; }
  .cart-lines li {
    display: grid;
    gap: 0.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgb(24 57 43 / 0.1);
  }
  .qty { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
  .totals { margin: 0; display: grid; gap: 0.4rem; }
  .totals div { display: flex; justify-content: space-between; }
  .reassure { font-size: 0.9rem; color: rgb(34 38 34 / 0.75); }
`;
