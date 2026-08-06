import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiPackage } from "react-icons/fi";
import OrderStatusBadge from "../components/profile/OrderStatusBadge";
import { orderService } from "../services/orderService";

export default function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrders()
      .then((data) => setOrders(data.results || data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-charcoal/5" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <FiPackage size={32} className="mx-auto mb-3 text-charcoal/20" />
        <p className="font-display text-lg text-charcoal">No orders yet</p>
        <p className="mt-1 text-sm text-charcoal/50">Your order history will appear here.</p>
        <Link
          to="/shop"
          className="mt-5 inline-block rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-xl text-charcoal">My Orders</h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/account/orders/${order.order_number}`}
            className="flex items-center justify-between gap-4 rounded-lg border border-charcoal/15 p-4 transition-colors hover:border-gold/40"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-charcoal">{order.order_number}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-xs text-charcoal/50">
                {new Date(order.placed_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {order.total_items} item{order.total_items === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-display text-lg text-charcoal">₹{order.total_amount}</p>
              <FiChevronRight size={16} className="text-charcoal/30" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
