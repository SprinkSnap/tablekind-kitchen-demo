import { useCart } from './CartProvider';
import { getWishlistProducts } from '../../lib/wishlist';
import { formatCad } from '../../lib/currency';
import { getVariantPrice } from '../../data/products';

export default function WishlistPage() {
  const { wishlist, removeWish, clearWish, addItem, openCart } = useCart();
  const products = getWishlistProducts(wishlist);

  const moveToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const variant = product.variants.find((v) => v.available) ?? product.variants[0];
    if (!variant?.available) return;
    addItem(productId, variant.id, 1);
    removeWish(productId);
    openCart();
  };

  if (products.length === 0) {
    return (
      <div className="hp-wishlist-empty">
        <h2>Your wishlist is empty</h2>
        <p>Save pieces you love while browsing the demo catalogue.</p>
        <a className="btn btn-primary" href="/shop/">
          Browse the shop
        </a>
        <style>{wishlistStyles}</style>
      </div>
    );
  }

  return (
    <div className="hp-wishlist">
      <div className="hp-wishlist__head">
        <p className="hp-wishlist__count">{products.length} saved items</p>
        <button type="button" className="btn btn-ghost" onClick={clearWish}>
          Clear wishlist
        </button>
      </div>
      <ul className="hp-wishlist__list">
        {products.map((product) => {
          const variant = product.variants.find((v) => v.available) ?? product.variants[0];
          const price = getVariantPrice(product, variant?.id);
          return (
            <li key={product.id} className="hp-wishlist__item">
              <a href={`/products/${product.slug}/`} className="hp-wishlist__image">
                <img src={product.images[0]} alt={product.imageAlt[0] ?? product.name} />
              </a>
              <div className="hp-wishlist__body">
                <a href={`/products/${product.slug}/`} className="hp-wishlist__name">
                  {product.name}
                </a>
                <p className="hp-wishlist__desc">{product.shortDescription}</p>
                <p className="price">{formatCad(price)}</p>
                <div className="hp-wishlist__actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!variant?.available || !product.available}
                    onClick={() => moveToCart(product.id)}
                  >
                    Move to cart
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeWish(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <style>{wishlistStyles}</style>
    </div>
  );
}

const wishlistStyles = `
  .hp-wishlist-empty, .hp-wishlist { display: grid; gap: 1.25rem; }
  .hp-wishlist-empty { text-align: center; padding: 2rem 0; }
  .hp-wishlist-empty h2 { margin: 0; font-family: var(--font-display); color: #102820; }
  .hp-wishlist__head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .hp-wishlist__count { margin: 0; font-weight: 650; color: #285B68; }
  .hp-wishlist__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 1.25rem; }
  .hp-wishlist__item { display: flex; gap: 1rem; padding: 1rem; background: #FFFEFB; border: 1px solid rgb(23 59 50 / 0.08); border-radius: 0.75rem; }
  .hp-wishlist__image img { width: 96px; height: 96px; object-fit: cover; border-radius: 0.5rem; }
  .hp-wishlist__body { flex: 1; min-width: 0; display: grid; gap: 0.35rem; }
  .hp-wishlist__name { font-weight: 700; color: #173B32; text-decoration: none; font-size: 1.05rem; }
  .hp-wishlist__desc { margin: 0; font-size: 0.9rem; color: rgb(36 40 36 / 0.78); }
  .hp-wishlist__actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.35rem; }
`;
