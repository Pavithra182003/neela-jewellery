export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className={`rounded-lg border p-5 ${accent ? "border-gold/30 bg-gold/5" : "border-charcoal/10 bg-cream"}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-wide text-charcoal/50">{label}</p>
        {Icon && <Icon size={16} className="text-gold-dark" />}
      </div>
      <p className="mt-2 font-display text-2xl text-charcoal">{value}</p>
    </div>
  );
}
