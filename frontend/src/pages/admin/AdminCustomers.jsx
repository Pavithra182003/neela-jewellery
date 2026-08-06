import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../components/shop/Pagination";
import { adminService } from "../../services/adminService";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const pageSize = 15;

  const loadCustomers = () => {
    setLoading(true);
    adminService
      .getCustomers({ page, page_size: pageSize, search: search || undefined })
      .then((data) => {
        setCustomers(data.results || data);
        setCount(data.count ?? (data.results || data).length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadCustomers, [page, search]);

  const handleToggleActive = async (customer) => {
    setBusyId(customer.id);
    try {
      const result = await adminService.toggleCustomerActive(customer.id);
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, is_active: result.is_active } : c)));
    } finally {
      setBusyId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-charcoal">Customers ({count})</h1>
        <div className="relative">
          <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email…"
            className="rounded-sm border border-charcoal/20 bg-cream py-2 pl-9 pr-3 text-sm focus:border-gold-dark focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-charcoal/10">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/[0.03] text-left text-xs tracking-wide text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">Loading…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">No customers found.</td></tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-t border-charcoal/5">
                  <td className="px-4 py-3 text-charcoal">{customer.full_name || customer.username}</td>
                  <td className="px-4 py-3 text-charcoal/60">{customer.email}</td>
                  <td className="px-4 py-3 text-charcoal/60">{customer.phone_number || "—"}</td>
                  <td className="px-4 py-3 text-charcoal/60">{customer.order_count}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        customer.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {customer.is_active ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggleActive(customer)}
                      disabled={busyId === customer.id}
                      className="text-xs text-gold-dark hover:underline disabled:opacity-40"
                    >
                      {customer.is_active ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
