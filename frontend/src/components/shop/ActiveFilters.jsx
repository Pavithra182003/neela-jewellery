import { FiX } from "react-icons/fi";
import { GENDER_OPTIONS, MATERIAL_OPTIONS } from "./filterOptions";

function labelFor(key, value, categories) {
  if (key === "category") return categories.find((c) => c.slug === value)?.name || value;
  if (key === "material") return MATERIAL_OPTIONS.find((m) => m.value === value)?.label || value;
  if (key === "gender") return GENDER_OPTIONS.find((g) => g.value === value)?.label || value;
  if (key === "min_price") return `Min ₹${Number(value).toLocaleString("en-IN")}`;
  if (key === "max_price") return `Max ₹${Number(value).toLocaleString("en-IN")}`;
  if (key === "in_stock") return "In Stock";
  if (key === "search") return `"${value}"`;
  return value;
}

const FILTER_KEYS = ["search", "category", "material", "gender", "min_price", "max_price", "in_stock"];

export default function ActiveFilters({ filters, categories, onRemove }) {
  const active = FILTER_KEYS.filter((key) => filters[key]);
  if (active.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {active.map((key) => (
        <button
          key={key}
          onClick={() => onRemove(key)}
          className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs text-charcoal transition-colors hover:border-gold-dark hover:bg-gold/10"
        >
          {labelFor(key, filters[key], categories)}
          <FiX size={12} />
        </button>
      ))}
    </div>
  );
}
