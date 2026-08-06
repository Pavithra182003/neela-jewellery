import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

export default function CartLineItem({ item, onUpdateQuantity, onRemove, busy }) {
  const { product, quantity, subtotal, unavailable_quantity } = item;

  return (
    <div className="flex gap-4 border-b border-gold/10 py-6 first:pt-0">
      <Link to={`/product/${product.slug}`} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-charcoal/5 sm:h-28 sm:w-28">
        <img src={product.primary_image} alt={product.name} className="h-full w-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/product/${product.slug}`} className="font-display text-base text-charcoal hover:text-gold-dark">
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-charcoal/50">{product.category}</p>
            <p className="mt-1 text-sm text-charcoal">₹{product.current_price}</p>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            disabled={busy}
            aria-label="Remove item"
            className="p-1 text-charcoal/40 transition-colors hover:text-red-600 disabled:opacity-40"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        {unavailable_quantity > 0 && (
          <p className="mt-1 text-xs text-red-600">
            Only {quantity - unavailable_quantity} left in stock — please reduce quantity.
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-sm border border-charcoal/20">
            <button
              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
              disabled={busy || quantity <= 1}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-charcoal transition-colors hover:text-gold-dark disabled:opacity-30"
            >
              <FiMinus size={12} />
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              disabled={busy}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-charcoal transition-colors hover:text-gold-dark disabled:opacity-30"
            >
              <FiPlus size={12} />
            </button>
          </div>

          <p className="font-medium text-charcoal">₹{subtotal}</p>
        </div>
      </div>
    </div>
  );
}
