import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import OrderStatusBadge from "../../components/profile/OrderStatusBadge";
import OrderStatusModal from "../../components/admin/OrderStatusModal";
import Pagination from "../../components/shop/Pagination";
import { orderService } from "../../services/orderService";

const STATUS_FILTERS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const pageSize = 15;

  const loadOrders = () => {
    setLoading(true);
    const params = { page, page_size: pageSize };
    if (statusFilter !== "all") params.status = statusFilter;
    orderService
      .getOrders(params)
      .then((data) => {
        setOrders(data.results || data);
        setCount(data.count ?? (data.results || data).length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, [page, statusFilter]);

  const handleUpdateStatus = async (payload) => {
    await orderService.updateOrderStatus(editingOrder.order_number, payload);
    setEditingOrder(null);
    loadOrders();
  };
  const handleApprovePayment = async (order) => {
  try {
    await orderService.updateOrderStatus(order.order_number, {
      payment_status: "paid",
    });

    loadOrders();
  } catch (err) {
    console.error(err);
    alert("Unable to approve payment.");
  }
};

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-charcoal">Orders ({count})</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs capitalize transition-colors ${
              statusFilter === s
                ? "bg-charcoal text-cream"
                : "border border-charcoal/15 text-charcoal/60 hover:border-gold-dark hover:text-gold-dark"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-charcoal/10">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/[0.03] text-left text-xs tracking-wide text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-charcoal/5">
                  <td className="px-4 py-3 text-charcoal">{order.order_number}</td>
                  <td className="px-4 py-3 text-charcoal/60">
                    {new Date(order.placed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-charcoal/60 capitalize">{order.payment_status}</td>
                  <td className="px-4 py-3 text-right text-charcoal">₹{order.total_amount}</td>
                  <td className="px-4 py-3 text-right">
                   {order.payment_status === "pending" && (
                            <button
                              onClick={() => handleApprovePayment(order)}
                              className="mr-2 rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                            >
                              Approve Payment
                            </button>
                          )}

                    <button onClick={() => setEditingOrder(order)} aria-label="Update status" className="text-charcoal/50 hover:text-gold-dark">
                      <FiEdit2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <OrderStatusModal
        open={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        order={editingOrder}
        onSave={handleUpdateStatus}
      />
    </div>
  );
}
