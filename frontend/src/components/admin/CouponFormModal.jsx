import { useEffect, useState } from "react";
import Modal from "./Modal";

const EMPTY_FORM = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  min_purchase_amount: 0,
  max_discount_amount: "",
  valid_from: "",
  valid_until: "",
  usage_limit: 0,
  per_user_limit: 1,
  is_active: true,
};

function toDatetimeLocal(isoString) {
  if (!isoString) return "";
  return isoString.slice(0, 16);
}

export default function CouponFormModal({ open, onClose, coupon, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code || "",
        description: coupon.description || "",
        discount_type: coupon.discount_type || "percentage",
        discount_value: coupon.discount_value || "",
        min_purchase_amount: coupon.min_purchase_amount || 0,
        max_discount_amount: coupon.max_discount_amount || "",
        valid_from: toDatetimeLocal(coupon.valid_from),
        valid_until: toDatetimeLocal(coupon.valid_until),
        usage_limit: coupon.usage_limit ?? 0,
        per_user_limit: coupon.per_user_limit ?? 1,
        is_active: coupon.is_active ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError("");
  }, [coupon, open]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        max_discount_amount: form.max_discount_amount || null,
        valid_from: form.valid_from ? new Date(form.valid_from).toISOString() : undefined,
        valid_until: new Date(form.valid_until).toISOString(),
      });
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.entries(data).map(([k, v]) => `${k}: ${[].concat(v).join(" ")}`).join(" ") : "Could not save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2 text-sm focus:border-gold-dark focus:outline-none";
  const labelClasses = "mb-1 block text-xs tracking-wide text-charcoal/60";

  return (
    <Modal open={open} onClose={onClose} title={coupon ? "Edit Coupon" : "New Coupon"} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Code</label>
            <input required value={form.code} onChange={handleChange("code")} className={`${inputClasses} uppercase`} />
          </div>
          <div>
            <label className={labelClasses}>Discount Type</label>
            <select value={form.discount_type} onChange={handleChange("discount_type")} className={inputClasses}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Description</label>
          <input value={form.description} onChange={handleChange("description")} className={inputClasses} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClasses}>
              {form.discount_type === "percentage" ? "Discount (%)" : "Discount (₹)"}
            </label>
            <input required type="number" step="0.01" value={form.discount_value} onChange={handleChange("discount_value")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Min Purchase (₹)</label>
            <input type="number" step="0.01" value={form.min_purchase_amount} onChange={handleChange("min_purchase_amount")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Max Discount (₹)</label>
            <input type="number" step="0.01" value={form.max_discount_amount} onChange={handleChange("max_discount_amount")} placeholder="No cap" className={inputClasses} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Valid From</label>
            <input type="datetime-local" value={form.valid_from} onChange={handleChange("valid_from")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Valid Until</label>
            <input required type="datetime-local" value={form.valid_until} onChange={handleChange("valid_until")} className={inputClasses} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Total Usage Limit (0 = unlimited)</label>
            <input type="number" value={form.usage_limit} onChange={handleChange("usage_limit")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Per-User Limit</label>
            <input type="number" value={form.per_user_limit} onChange={handleChange("per_user_limit")} className={inputClasses} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={form.is_active} onChange={handleChange("is_active")} className="accent-gold-dark" />
          Active
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-gold/15 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-charcoal/60 hover:text-charcoal">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            {saving ? "Saving…" : coupon ? "Save Changes" : "Create Coupon"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
