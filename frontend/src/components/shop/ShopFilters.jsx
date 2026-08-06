import { useEffect, useState } from "react";
import { GENDER_OPTIONS, MATERIAL_OPTIONS, PRICE_MAX, PRICE_MIN } from "./filterOptions";

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-gold/15 py-6 first:pt-0 last:border-b-0">
      <h3 className="mb-4 text-xs font-medium tracking-[0.2em] text-charcoal">{title}</h3>
      {children}
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-charcoal/80 transition-colors hover:text-gold-dark">
      <span
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border transition-colors ${
          checked ? "border-gold-dark bg-gold-dark" : "border-charcoal/30"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-cream" strokeWidth={2}>
            <path d="M2 6l2.5 2.5L10 3" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

/**
 * filters: { category, material, gender, min_price, max_price, in_stock }
 * onChange(key, value) — value === null/"" clears that filter
 */
export default function ShopFilters({ filters, onChange, onClearAll, categories = [] }) {
  const [priceRange, setPriceRange] = useState([
    filters.min_price ? Number(filters.min_price) : PRICE_MIN,
    filters.max_price ? Number(filters.max_price) : PRICE_MAX,
  ]);

  useEffect(() => {
    setPriceRange([
      filters.min_price ? Number(filters.min_price) : PRICE_MIN,
      filters.max_price ? Number(filters.max_price) : PRICE_MAX,
    ]);
  }, [filters.min_price, filters.max_price]);

  const commitPriceRange = () => {
    onChange("min_price", priceRange[0] > PRICE_MIN ? priceRange[0] : null);
    onChange("max_price", priceRange[1] < PRICE_MAX ? priceRange[1] : null);
  };

  const hasActiveFilters =
    filters.category || {/*filters.material */}|| filters.gender || filters.min_price || filters.max_price || filters.in_stock;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-lg text-charcoal">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs tracking-wide text-charcoal/50 underline-offset-2 hover:text-gold-dark hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <FilterSection title="CATEGORY">
        <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <Checkbox
            key={cat.id}
            checked={(filters.category || "").split(",").includes(cat.slug)}
            onChange={() => {
              const selected = (filters.category || "")
                .split(",")
                .filter(Boolean);

              const updated = selected.includes(cat.slug)
                ? selected.filter((item) => item !== cat.slug)
                : [...selected, cat.slug];

              onChange("category", updated.length ? updated.join(",") : null);
            }}
          label={cat.name}
            />
          ))}
          {categories.length === 0 && <p className="text-xs text-charcoal/40">No categories yet.</p>}
        </div>
      </FilterSection>

     {/* <FilterSection title="MATERIAL">
        <div className="space-y-0.5">
          {MATERIAL_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              checked={filters.material === opt.value}
              onChange={() => onChange("material", filters.material === opt.value ? null : opt.value)}
              label={opt.label}
            />
          ))}
        </div>
      </FilterSection>*/}

      <FilterSection title="GENDER">
        <div className="space-y-0.5">
          {GENDER_OPTIONS.map((opt) => (
            <Checkbox
            key={opt.value}
            checked={(filters.gender || "").split(",").includes(opt.value)}
            onChange={() => {
              const selected = (filters.gender || "")
                .split(",")
                .filter(Boolean);

              const updated = selected.includes(opt.value)
                ? selected.filter((item) => item !== opt.value)
                : [...selected, opt.value];

              onChange("gender", updated.length ? updated.join(",") : null);
            }}
            label={opt.label}
          />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="PRICE">
  <div className="space-y-1">
    {[
      { label: "Under ₹500", min: null, max: "500" },
      { label: "₹500 - ₹1,000", min: "500", max: "1000" },
      { label: "₹1,000 - ₹2,000", min: "1000", max: "2000" },
      { label: "₹2,000 - ₹5,000", min: "2000", max: "5000" },
      { label: "Above ₹5,000", min: "5000", max: null },
    ].map((price) => (
      <Checkbox
        key={price.label}
        checked={
          (filters.min_price || "") === String(price.min || "") &&
          (filters.max_price || "") === String(price.max || "")
        }
        onChange={() => {
          const isSelected =
            (filters.min_price || "") === String(price.min || "") &&
            (filters.max_price || "") === String(price.max || "");

          if (isSelected) {
            onChange("min_price", null);
            onChange("max_price", null);
          } else {
            onChange("min_price", price.min);
            onChange("max_price", price.max);
          }
        }}
        label={price.label}
      />
    ))}
  </div>
</FilterSection>

            <FilterSection title="AVAILABILITY">
        <Checkbox
          checked={!!filters.in_stock}
          onChange={() => onChange("in_stock", filters.in_stock ? null : "true")}
          label="In Stock Only"
        />
      </FilterSection>
    </div>
  );
}
