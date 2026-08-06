import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

import Container from "../components/common/Container";
import CartLineItem from "../components/cart/CartLineItem";
import CouponInput from "../components/cart/CouponInput";
import OrderSummary from "../components/cart/OrderSummary";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, hasUnavailableItems } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [busyItemId, setBusyItemId] = useState(null);

  const items = cart?.items || [];

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    setBusyItemId(itemId);
    try {
      await updateItem(itemId, quantity);
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setBusyItemId(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setBusyItemId(null);
    }
  };

  // Coupon was validated against the subtotal at the moment it was
  // applied; if the cart changes afterward, re-validation happens for
  // real at checkout (orders/services.py), so this is just a preview.

  if (loading && !cart) {
    return (
      <Container className="py-16">
        <div className="h-8 w-48 animate-pulse bg-charcoal/10" />
        <div className="mt-8 space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse bg-charcoal/5" />
          ))}
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-24 text-center">
        <FiShoppingBag size={40} className="mx-auto mb-4 text-charcoal/20" />
        <h1 className="font-display text-2xl text-charcoal">Your cart is empty</h1>
        <p className="mt-2 text-sm text-charcoal/60">Explore the collection and find your next piece.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-sm bg-charcoal px-7 py-3 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark"
        >
          Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <h1 className="mb-8 font-display text-3xl text-charcoal">
        Shopping Cart <span className="text-lg text-charcoal/40">({cart.total_items})</span>
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {hasUnavailableItems && (
            <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Some items in your cart exceed available stock. Please update quantities before checkout.
            </div>
          )}

          {items.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              busy={busyItemId === item.id}
            />
          ))}

          <div className="mt-6">
            <CouponInput
              appliedCoupon={appliedCoupon}
              onApply={setAppliedCoupon}
              onRemove={() => setAppliedCoupon(null)}
            />
          </div>
        </div>

        <div>
          <OrderSummary
            subtotal={cart.subtotal}
            appliedCoupon={appliedCoupon}
            checkoutDisabled={hasUnavailableItems}
          />
        </div>
      </div>
    </Container>
  );
}
