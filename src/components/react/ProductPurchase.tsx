import { useState } from 'react';
import { useCart } from './CartProvider';
import { getProductById, getVariantPrice } from '../../data/products';
import { formatCad } from '../../lib/currency';

type Props = { productId: string };

export default function ProductPurchase({ productId }: Props) {
  const product = getProductById(productId);
  const { addItem, toggleWish, isWishlisted, openCart } = useCart();

  const availableVariants = product?.variants.filter((v) => v.available) ?? [];
  const [variantId, setVariantId] = useState(availableVariants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <p role="status">Product not found.</p>;
  }

  const selectedVariant = product.variants.find((v) => v.id === variantId);
  const price = getVariantPrice(product, variantId);
  const wishlisted = isWishlisted(productId);
  const canAdd = product.available && selectedVariant?.available;

  const handleAdd = () => {
    if (!canAdd || !variantId) return;
    addItem(productId, variantId, quantity);
    openCart();
  };

  return (
    <div className="hp-purchase">
      <p className="hp-purchase__price" aria-live="polite">
        <span className="price">{formatCad(price)}</span>
        {product.compareAtPrice && product.compareAtPrice > price && (
          <span className="hp-purchase__compare">{formatCad(product.compareAtPrice)}</span>
        )}
      </p>

      {product.variants.length > 1 && (
        <fieldset className="hp-purchase__variants">
          <legend>Choose option</legend>
          <div className="hp-purchase__variant-list" role="radiogroup" aria-label="Product options">
            {product.variants.map((variant) => (
              <label
                key={variant.id}
                className={`hp-purchase__variant${!variant.available ? ' is-unavailable' : ''}`}
              >
                <input
                  type="radio"
                  name={`variant-${productId}`}
                  value={variant.id}
                  checked={variantId === variant.id}
                  disabled={!variant.available}
                  onChange={() => setVariantId(variant.id)}
                />
                <span>
                  {variant.name}
                  {!variant.available && ' (unavailable)'}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="hp-purchase__qty">
        <label htmlFor={`qty-${productId}`}>Quantity</label>
        <div className="hp-purchase__qty-controls">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <input
            id={`qty-${productId}`}
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="hp-purchase__actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canAdd}
          onClick={handleAdd}
        >
          Add to demo cart
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          aria-pressed={wishlisted}
          onClick={() => toggleWish(productId)}
        >
          {wishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
        </button>
      </div>

      {!product.available && (
        <p className="hp-purchase__notice" role="status">
          This product is currently unavailable in the demo catalogue.
        </p>
      )}

      <style>{`
        .hp-purchase { display: grid; gap: 1.25rem; }
        .hp-purchase__price { margin: 0; display: flex; align-items: baseline; gap: 0.5rem; font-size: 1.35rem; }
        .hp-purchase__compare { text-decoration: line-through; color: rgb(36 40 36 / 0.55); font-size: 1rem; font-weight: 500; }
        .hp-purchase__variants { border: 0; margin: 0; padding: 0; }
        .hp-purchase__variants legend { font-weight: 700; margin-bottom: 0.5rem; color: #102820; }
        .hp-purchase__variant-list { display: grid; gap: 0.4rem; }
        .hp-purchase__variant {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 0.75rem; border-radius: 0.5rem;
          border: 1px solid rgb(23 59 50 / 0.18); cursor: pointer;
        }
        .hp-purchase__variant:has(input:checked) { border-color: #173B32; background: rgb(23 59 50 / 0.05); }
        .hp-purchase__variant.is-unavailable { opacity: 0.55; cursor: not-allowed; }
        .hp-purchase__qty label { display: block; font-weight: 700; margin-bottom: 0.35rem; }
        .hp-purchase__qty-controls { display: flex; align-items: center; gap: 0.35rem; }
        .hp-purchase__qty-controls button {
          min-width: 44px; min-height: 44px; border-radius: 0.35rem;
          border: 1px solid rgb(23 59 50 / 0.2); background: #F7F3EC; cursor: pointer; font: inherit;
        }
        .hp-purchase__qty-controls input {
          width: 3.5rem; text-align: center; min-height: 44px;
          border: 1px solid rgb(23 59 50 / 0.2); border-radius: 0.35rem; font: inherit;
        }
        .hp-purchase__actions { display: grid; gap: 0.6rem; }
        .hp-purchase__notice { margin: 0; font-size: 0.92rem; color: #285B68; }
      `}</style>
    </div>
  );
}
