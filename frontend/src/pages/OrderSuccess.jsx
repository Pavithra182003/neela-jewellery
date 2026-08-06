import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiPackage } from "react-icons/fi";

import Container from "../components/common/Container";
import { orderService } from "../services/orderService";

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrder(orderNumber)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <Container className="py-24 text-center">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-charcoal/10" />
      </Container>
    );
  }

  return (
    <Container className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 text-gold-dark">
          <FiCheckCircle size={40} />
        </div>

        <h1 className="font-display text-3xl text-charcoal">Order Confirmed</h1>
        <p className="mt-3 text-sm text-charcoal/60">
          Thank you for your order. A confirmation email with your invoice is on its way.
        </p>

        {order && (
          <div className="mt-8 rounded-lg border border-gold/15 bg-cream p-6 text-left">
            <div className="flex items-center justify-between border-b border-gold/10 pb-4">
              <div>
                <p className="text-xs tracking-widest text-charcoal/50">ORDER NUMBER</p>
                <p className="font-display text-lg text-charcoal">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-xs tracking-widest text-charcoal/50">TOTAL</p>
                <p className="font-display text-lg text-charcoal">₹{order.total_amount}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.product_image_url && (
                    <img
                      src={item.product_image_url}
                      alt={item.product_name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1 text-sm">
                    <p className="text-charcoal">{item.product_name}</p>
                    <p className="text-charcoal/50">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-charcoal">₹{item.subtotal}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 border-t border-gold/10 pt-4 text-sm text-charcoal/60">
              <FiPackage size={15} className="mt-0.5 flex-shrink-0 text-gold-dark" />
              <span>
                Shipping to {order.shipping_address.full_name}, {order.shipping_address.city},{" "}
                {order.shipping_address.state} {order.shipping_address.postal_code}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {order && (
            <Link
              to={`/account/orders/${order.order_number}`}
              className="rounded-sm border border-gold-dark px-6 py-3 text-sm tracking-wide text-gold-dark transition-colors hover:bg-gold-dark hover:text-cream"
            >
              View Order Details
            </Link>
          )}
          <Link
            to="/shop"
            className="rounded-sm bg-charcoal px-6 py-3 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </Container>
  );
}
