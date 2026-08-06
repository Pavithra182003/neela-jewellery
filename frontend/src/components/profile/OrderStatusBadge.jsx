const STATUS_STYLES = {
  pending: "bg-charcoal/10 text-charcoal/70",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-gold/15 text-gold-dark",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-red-50 text-red-700",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize tracking-wide ${
        STATUS_STYLES[status] || "bg-charcoal/10 text-charcoal/70"
      }`}
    >
      {status}
    </span>
  );
}
