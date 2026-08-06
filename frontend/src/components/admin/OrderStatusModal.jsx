import { useEffect, useState } from "react";
import Modal from "./Modal";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export default function OrderStatusModal({
  open,
  onClose,
  order,
  onSave,
}) {
  const [status, setStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setPaymentStatus(order.payment_status);
      setTracking(order.tracking_number || "");
    }

    setError("");
  }, [order, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await onSave({
        status,
        payment_status: paymentStatus,
        tracking_number: tracking,
      });
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Could not update order."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!order) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Update ${order.order_number}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Order Status */}
        <div>
          <label className="mb-1 block text-xs tracking-wide text-charcoal/60">
            Order Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2 text-sm capitalize focus:border-gold-dark focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="mb-1 block text-xs tracking-wide text-charcoal/60">
            Payment Status
          </label>

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2 text-sm capitalize focus:border-gold-dark focus:outline-none"
          >
            {PAYMENT_STATUSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Tracking Number */}
        <div>
          <label className="mb-1 block text-xs tracking-wide text-charcoal/60">
            Tracking Number (optional)
          </label>

          <input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="e.g. NJ123456789IN"
            className="w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2 text-sm focus:border-gold-dark focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-gold/15 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-charcoal/60 hover:text-charcoal"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Order"}
          </button>
        </div>
      </form>
    </Modal>
  );
}