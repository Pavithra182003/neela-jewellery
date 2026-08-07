import { useEffect, useState } from "react";
import { GENDER_OPTIONS, MATERIAL_OPTIONS, PRICE_OPTIONS,PRICE_MAX, PRICE_MIN } from "./filterOptions";

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
    <label
      className="flex cursor-pointer items-center gap-3 py-2"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />

      <span
        className={`flex h-5 w-5 items-center justify-center rounded border ${
          checked
            ? "border-gold-dark bg-gold-dark"
            : "border-gray-400 bg-white"
        }`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="none"
            stroke="white"
            strokeWidth="3"
          >
            <path
              d="M5 10l3 3 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span className="text-sm text-charcoal">{label}</span>
    </label>
  );
}
/**
 * filters: { category, material, gender, min_price, max_price, in_stock }
 * onChange(key, value) — value === null/"" clears that filter
 */
export default function ShopFilters({ filters, onChange, onMultiChange,onClearAll, categories = [] }) {
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
      <div className="space-y-0.5">
        {PRICE_OPTIONS.map((price) => {
          const isSelected =
            filters.min_price == price.min &&
            filters.max_price == price.max;

          return (
            <Checkbox
              key={price.label}
              checked={isSelected}
              onChange={() => {
            onMultiChange({
              min_price: price.min,
              max_price: price.max,
            });

              }}
              label={price.label}
            />
          );
        })}
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
