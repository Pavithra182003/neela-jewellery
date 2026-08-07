import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPackage, FiTruck } from "react-icons/fi";
import OrderStatusBadge from "../components/profile/OrderStatusBadge";
import { orderService } from "../services/orderService";

const CANCELLABLE = ["pending", "confirmed", "processing"];

export default function AccountOrderDetail() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = () => {
    setLoading(true);
    orderService
      .getOrder(orderNumber)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrder, [orderNumber]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    setCancelling(true);
    setError("");
    try {
      const updated = await orderService.cancelOrder(orderNumber);
      setOrder(updated);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not cancel this order.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="h-64 animate-pulse rounded-lg bg-charcoal/5" />;
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-lg text-charcoal">Order not found</p>
        <Link to="/account/orders" className="mt-4 inline-block text-sm text-gold-dark hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const canCancel = CANCELLABLE.includes(order.status) &&
  order.payment_status !== "paid";

  return (
    <div>
      <Link
        to="/account/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-gold-dark"
      >
        <FiArrowLeft size={14} />
        Back to My Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl text-charcoal">{order.order_number}</h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-xs text-charcoal/50">
            Placed on{" "}
            {new Date(order.placed_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-sm border border-red-300 px-4 py-2 text-xs text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel Order"}
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {order.tracking_number && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 p-4 text-sm text-charcoal">
          <FiTruck size={16} className="text-gold-dark" />
          Tracking Number: <span className="font-medium">{order.tracking_number}</span>
        </div>
      )}

      <div className="rounded-lg border border-gold/15 p-5">
        <h3 className="mb-4 text-xs tracking-[0.2em] text-charcoal/50">ITEMS</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-gold/10 pb-4 last:border-b-0 last:pb-0">
              {item.product_image_url ? (
              <img
                src={
                  item.product_image_url.startsWith("http")
                    ? item.product_image_url
                    : `http://127.0.0.1:8000${item.product_image_url}`
                }
                alt={item.product_name}
                className="h-16 w-16 rounded-md object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-charcoal/5 text-charcoal/30">
                  <FiPackage size={20} />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-charcoal">{item.product_name}</p>
                <p className="text-xs text-charcoal/50">Qty: {item.quantity} × ₹{item.price}</p>
                {order.status === "delivered" && (
                <Link
                  to={`/product/${item.product_slug}`}
                  className="mt-2 inline-block rounded border border-gold-dark px-3 py-1 text-xs text-gold-dark transition hover:bg-gold-dark hover:text-white"
                >
                  Write Review
                </Link>
              )}
              </div>
              <p className="text-sm font-medium text-charcoal">₹{item.subtotal}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-gold/15 p-5">
          <h3 className="mb-3 flex items-center gap-1.5 text-xs tracking-[0.2em] text-charcoal/50">
            <FiMapPin size={12} />
            SHIPPING ADDRESS
          </h3>
          <p className="text-sm font-medium text-charcoal">{order.shipping_address.full_name}</p>
          <p className="text-sm text-charcoal/60">{order.shipping_address.phone_number}</p>
          <p className="mt-1 text-sm text-charcoal/60">
            {order.shipping_address.address_line1}
            {order.shipping_address.address_line2 ? `, ${order.shipping_address.address_line2}` : ""},{" "}
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
          </p>
        </div>

        <div className="rounded-lg border border-gold/15 bg-cream p-5">
          <h3 className="mb-3 text-xs tracking-[0.2em] text-charcoal/50">PAYMENT SUMMARY</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-charcoal/70">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-gold-dark">
                <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</span>
                <span>-₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal/70">
              <span>Shipping</span>
              <span>{Number(order.shipping_charge) === 0 ? "Free" : `₹${order.shipping_charge}`}</span>
            </div>
            <div className="flex justify-between text-charcoal/70">
              <span>Tax</span>
              <span>₹{order.tax_amount}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-gold/15 pt-3 font-display text-lg text-charcoal">
            <span>Total</span>
            <span>₹{order.total_amount}</span>
          </div>
          <p className="mt-2 text-xs text-charcoal/50">
            Payment status: <span className="capitalize">{order.payment_status}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
