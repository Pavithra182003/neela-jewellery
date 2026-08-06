import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function OrderSummary({ subtotal, appliedCoupon, checkoutDisabled }) {
  const discount = appliedCoupon?.discount_amount || 0;
  const estimatedTotal = Math.max(subtotal - discount, 0);

  return (
    <div className="rounded-lg border border-gold/15 bg-cream p-6">
      <h2 className="mb-5 font-display text-lg text-charcoal">Order Summary</h2>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-charcoal/70">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-gold-dark">
            <span>Discount ({appliedCoupon.code})</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="flex justify-between text-charcoal/50">
          <span>Shipping &amp; Tax</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-t border-gold/15 pt-4 font-display text-lg text-charcoal">
        <span>Estimated Total</span>
        <span>₹{estimatedTotal}</span>
      </div>

      <Link
        to={checkoutDisabled ? "#" : "/checkout"}
        onClick={(e) => checkoutDisabled && e.preventDefault()}
        className={`mt-6 flex items-center justify-center gap-2 rounded-sm py-3.5 text-sm tracking-wide transition-colors ${
          checkoutDisabled
            ? "cursor-not-allowed bg-charcoal/20 text-cream/70"
            : "bg-charcoal text-cream hover:bg-gold-dark"
        }`}
      >
        Proceed to Checkout
        <FiArrowRight size={15} />
      </Link>

      <p className="mt-4 text-center text-xs text-charcoal/40">
        Free shipping on orders over ₹5,000
      </p>
    </div>
  );
}
