import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import CouponFormModal from "../../components/admin/CouponFormModal";
import { couponService } from "../../services/couponService";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const loadCoupons = () => {
    setLoading(true);
    couponService.getCoupons().then((data) => setCoupons(data.results || data)).finally(() => setLoading(false));
  };

  useEffect(loadCoupons, []);

  const openCreate = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (editingCoupon) {
      await couponService.updateCoupon(editingCoupon.id, payload);
    } else {
      await couponService.createCoupon(payload);
    }
    setModalOpen(false);
    loadCoupons();
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.code}"?`)) return;
    await couponService.deleteCoupon(coupon.id);
    loadCoupons();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">Coupons</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-sm bg-charcoal px-4 py-2.5 text-sm text-cream transition-colors hover:bg-gold-dark"
        >
          <FiPlus size={15} />
          New Coupon
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-charcoal/10">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/[0.03] text-left text-xs tracking-wide text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Valid Until</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">Loading…</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">No coupons yet.</td></tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t border-charcoal/5">
                  <td className="px-4 py-3 font-medium text-charcoal">{coupon.code}</td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">
                    {coupon.used_count} / {coupon.usage_limit || "∞"}
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">
                    {new Date(coupon.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        coupon.is_valid_now ? "bg-green-50 text-green-700" : "bg-charcoal/10 text-charcoal/50"
                      }`}
                    >
                      {coupon.is_valid_now ? "Valid" : "Inactive/Expired"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(coupon)} aria-label="Edit" className="text-charcoal/50 hover:text-gold-dark">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(coupon)} aria-label="Delete" className="text-charcoal/50 hover:text-red-600">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CouponFormModal open={modalOpen} onClose={() => setModalOpen(false)} coupon={editingCoupon} onSave={handleSave} />
    </div>
  );
}
