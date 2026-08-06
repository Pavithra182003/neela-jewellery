import { FiChevronDown } from "react-icons/fi";
import { SORT_OPTIONS } from "./filterOptions";

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-sm border border-gold/25 bg-cream py-2 pl-3 pr-9 text-sm text-charcoal transition-colors hover:border-gold-dark focus:border-gold-dark focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <FiChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/50"
      />
    </div>
  );
}
