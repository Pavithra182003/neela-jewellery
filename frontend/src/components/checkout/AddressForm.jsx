import { useState } from "react";

const EMPTY_FORM = {
  full_name: "",
  phone_number: "",
  address_type: "home",
  address_line1: "",
  address_line2: "",
  landmark: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: false,
};

export default function AddressForm({ onSave, onCancel, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Could not save this address.");
    }
  };

  const inputClasses =
    "w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2.5 text-sm focus:border-gold-dark focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gold/20 bg-cream p-6">
      <h3 className="mb-4 font-display text-lg text-charcoal">New Address</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input required placeholder="Full Name" value={form.full_name} onChange={handleChange("full_name")} className={inputClasses} />
        <input required placeholder="Phone Number" value={form.phone_number} onChange={handleChange("phone_number")} className={inputClasses} />
        <input
          required
          placeholder="Address Line 1"
          value={form.address_line1}
          onChange={handleChange("address_line1")}
          className={`${inputClasses} sm:col-span-2`}
        />
        <input
          placeholder="Address Line 2 (optional)"
          value={form.address_line2}
          onChange={handleChange("address_line2")}
          className={`${inputClasses} sm:col-span-2`}
        />
        <input placeholder="Landmark (optional)" value={form.landmark} onChange={handleChange("landmark")} className={`${inputClasses} sm:col-span-2`} />
        <input required placeholder="City" value={form.city} onChange={handleChange("city")} className={inputClasses} />
        <input required placeholder="State" value={form.state} onChange={handleChange("state")} className={inputClasses} />
        <input required placeholder="Postal Code" value={form.postal_code} onChange={handleChange("postal_code")} className={inputClasses} />
        <select value={form.address_type} onChange={handleChange("address_type")} className={inputClasses}>
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-charcoal/70">
        <input
          type="checkbox"
          checked={form.is_default}
          onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
        />
        Set as default address
      </label>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-charcoal/60 hover:text-charcoal"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
