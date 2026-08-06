import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiDollarSign, FiPackage, FiShoppingBag } from "react-icons/fi";
import StatCard from "../../components/admin/StatCard";
import OrderStatusBadge from "../../components/profile/OrderStatusBadge";
import { adminService } from "../../services/adminService";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getOrderSummary(), adminService.getLowStockProducts()])
      .then(([summaryData, lowStockData]) => {
        setSummary(summaryData);
        setLowStock(lowStockData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-charcoal/5" />
        ))}
      </div>
    );
  }

  const pendingOrders = summary?.orders_by_status?.pending || 0;

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-charcoal">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FiDollarSign} label="Total Revenue (Paid)" value={`₹${summary.total_revenue}`} accent />
        <StatCard icon={FiShoppingBag} label="Paid Orders" value={summary.paid_order_count} />
        <StatCard icon={FiPackage} label="Revenue Today" value={`₹${summary.revenue_today}`} />
        <StatCard icon={FiAlertTriangle} label="Pending Orders" value={pendingOrders} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-charcoal">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-gold-dark hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-charcoal/10">
            <table className="w-full text-sm">
              <thead className="bg-charcoal/[0.03] text-left text-xs tracking-wide text-charcoal/50">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {summary.recent_orders.map((order) => (
                  <tr key={order.id} className="border-t border-charcoal/5">
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders`} className="text-charcoal hover:text-gold-dark">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-charcoal/60">{order.total_items}</td>
                    <td className="px-4 py-3 text-right text-charcoal">₹{order.total_amount}</td>
                  </tr>
                ))}
                {summary.recent_orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-charcoal/40">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-charcoal">Low Stock Alert</h2>
            <Link to="/admin/products" className="text-xs text-gold-dark hover:underline">
              Manage
            </Link>
          </div>
          <div className="space-y-2">
            {lowStock.length === 0 && (
              <p className="rounded-lg border border-charcoal/10 p-4 text-sm text-charcoal/40">
                Nothing running low right now.
              </p>
            )}
            {lowStock.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3"
              >
                <span className="truncate text-sm text-charcoal">{product.name}</span>
                <span className="flex-shrink-0 text-xs font-medium text-red-600">
                  {product.stock_quantity} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
