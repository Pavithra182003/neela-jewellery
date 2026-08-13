import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import CouponInput from "../cart/CouponInput";
import { addressService } from "../../services/addressService";
import { orderService } from "../../services/orderService";

export default function ReviewStep({ cart, selectedAddressId, appliedCoupon, onApplyCoupon, onRemoveCoupon, onEditAddress, onOrderPlaced }) {
  const [address, setAddress] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedAddressId) return;
    addressService.getAddress(selectedAddressId).then(setAddress).catch(() => setAddress(null));
  }, [selectedAddressId]);

  const discount = Number(appliedCoupon?.discount_amount || 0);

const taxableAmount = Math.max(
  Number(cart.subtotal || 0) - discount,
  0
);

// Shipping charges
const shippingCharge =
  taxableAmount < 99
    ? 49
    : taxableAmount < 199
    ? 39
    : taxableAmount < 299
    ? 29
    : taxableAmount < 399
    ? 19
    : taxableAmount < 499
    ? 9
    : 0;

// GST – 3%
const taxAmount = Number((taxableAmount * 0.03).toFixed(2));

const estimatedTotal = Number(
  (taxableAmount + shippingCharge + taxAmount).toFixed(2)
);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      const order = await orderService.createOrder({
        address_id: selectedAddressId,
        coupon_code: appliedCoupon?.code,
        payment_method: paymentMethod,
      });
      if (paymentMethod === "whatsapp") {
        const phone = "919398865029"; 

        const message = `
      Hello Neela Jewellery,

      I would like to place an order.

      Order Number: ${order.order_number}

      Total Amount: ₹${order.total_amount}
      `;

        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        console.log(whatsappUrl);

        window.location.href = whatsappUrl;
      } else {
        onOrderPlaced(order);
      }
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
          (data?.items ? `Some items are no longer available: ${data.items.join(", ")}` : null) ||
          "Could not place your order. Please review your cart and try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-8 rounded-lg border border-gold/15 p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs tracking-[0.2em] text-charcoal/50">SHIPPING TO</h3>
            <button
              onClick={onEditAddress}
              className="flex items-center gap-1 text-xs text-gold-dark hover:underline"
            >
              <FiEdit2 size={12} />
              Change
            </button>
          </div>
          {address ? (
            <>
              <p className="text-sm font-medium text-charcoal">{address.full_name} — {address.phone_number}</p>
              <p className="text-sm text-charcoal/60">
                {address.address_line1}
                {address.address_line2 ? `, ${address.address_line2}` : ""}, {address.city}, {address.state}{" "}
                {address.postal_code}
              </p>
            </>
          ) : (
            <p className="text-sm text-charcoal/40">Loading address…</p>
          )}
        </div>

        <h3 className="mb-4 text-xs tracking-[0.2em] text-charcoal/50">ORDER ITEMS ({cart.total_items})</h3>
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-gold/10 pb-4">
              <img
                src={item.product.primary_image}
                alt={item.product.name}
                className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-charcoal">{item.product.name}</p>
                <p className="text-xs text-charcoal/50">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-charcoal">₹{item.subtotal}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <CouponInput appliedCoupon={appliedCoupon} onApply={onApplyCoupon} onRemove={onRemoveCoupon} />
        </div>
      </div>

      <div className="h-fit rounded-lg border border-gold/15 bg-cream p-6">
        <h2 className="mb-5 font-display text-lg text-charcoal">Order Total</h2>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-charcoal/70">
            <span>Subtotal</span>
            <span>₹{cart.subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-gold-dark">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-charcoal/70">
          <span>Shipping</span>
          <span>
            {shippingCharge === 0 ? "FREE" : `₹${shippingCharge.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-charcoal/70">
          <span>GST (3%)</span>
          <span>₹{taxAmount.toFixed(2)}</span>
        </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-gold/15 pt-4 font-display text-lg text-charcoal">
          <span>Est. Total</span>
          <span>₹{estimatedTotal}</span>
        </div>
        <p className="mt-2 text-[11px] text-charcoal/40">
           Shipping and GST are included in your estimated total
        </p>
        <div className="mt-6">
        <h3 className="mb-3 font-medium text-charcoal">
          Select Payment Method
        </h3>

        <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border p-4">
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <div>
            <p className="font-medium">Cash on Delivery</p>
            <p className="text-xs text-charcoal/60">
              Pay when your order is delivered.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
          <input
            type="radio"
            value="whatsapp"
            checked={paymentMethod === "whatsapp"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <div>
            <p className="font-medium">Order via WhatsApp</p>
            <p className="text-xs text-charcoal/60">
              Continue your order on WhatsApp.
            </p>
          </div>
        </label>
      </div>
        {error && <p className="mt-4 text-xs text-red-600">{error}</p>}

        <button
          onClick={handlePlaceOrder}
          disabled={placing || !selectedAddressId}
          className="mt-6 w-full rounded-sm bg-charcoal py-3.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {placing
            ? "Placing Order..."
            : paymentMethod === "cod"
            ? "Place Cash on Delivery Order"
            : "Place WhatsApp Order"}
        </button>
      </div>
    </div>
  );
}
