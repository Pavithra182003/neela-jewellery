import { useState } from "react";
import { FiTag, FiX } from "react-icons/fi";
import { couponService } from "../../services/couponService";

export default function CouponInput({ appliedCoupon, onApply, onRemove }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | error
  const [error, setError] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus("checking");
    setError("");
    try {
      const result = await couponService.validate(code.trim());
      onApply(result);
      setCode("");
      setStatus("idle");
    } catch (err) {
      setError(err?.response?.data?.code || "Invalid coupon code.");
      setStatus("error");
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between rounded-sm border border-gold/30 bg-gold/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-charcoal">
          <FiTag size={14} className="text-gold-dark" />
          <span className="font-medium">{appliedCoupon.code}</span>
          <span className="text-charcoal/50">applied — ₹{appliedCoupon.discount_amount} off</span>
        </div>
        <button onClick={onRemove} aria-label="Remove coupon" className="text-charcoal/50 hover:text-red-600">
          <FiX size={16} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply}>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="flex-1 rounded-sm border border-charcoal/20 bg-cream px-3 py-2.5 text-sm uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal focus:border-gold-dark focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "checking"}
          className="rounded-sm border border-charcoal px-5 py-2.5 text-sm text-charcoal transition-colors hover:bg-charcoal hover:text-cream disabled:opacity-50"
        >
          {status === "checking" ? "…" : "Apply"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </form>
  );
}
