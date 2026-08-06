import { useEffect, useState } from "react";
import { FiHome, FiMapPin, FiPlus } from "react-icons/fi";
import AddressForm from "./AddressForm";
import { addressService } from "../../services/addressService";

export default function AddressStep({ selectedAddressId, onSelect, onContinue }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAddresses = () => {
    setLoading(true);
    addressService
      .getAddresses()
      .then((data) => {
        const list = data.results || data;
        setAddresses(list);
        if (!selectedAddressId) {
          const preferred = list.find((a) => a.is_default) || list[0];
          if (preferred) onSelect(preferred.id);
        }
        if (list.length === 0) setShowForm(true);
      })
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadAddresses, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveAddress = async (payload) => {
    setSaving(true);
    try {
      const created = await addressService.createAddress(payload);
      setAddresses((prev) => [created, ...prev]);
      onSelect(created.id);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-40 animate-pulse rounded-lg bg-charcoal/5" />;
  }

  return (
    <div>
      <h2 className="mb-5 font-display text-xl text-charcoal">Select a Shipping Address</h2>

      <div className="space-y-3">
        {addresses.map((address) => (
          <label
            key={address.id}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              selectedAddressId === address.id
                ? "border-gold-dark bg-gold/5"
                : "border-charcoal/15 hover:border-gold/40"
            }`}
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddressId === address.id}
              onChange={() => onSelect(address.id)}
              className="mt-1 accent-gold-dark"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FiHome size={13} className="text-gold-dark" />
                <span className="text-sm font-medium capitalize text-charcoal">{address.address_type}</span>
                {address.is_default && (
                  <span className="rounded-sm bg-gold/15 px-1.5 py-0.5 text-[10px] text-gold-dark">DEFAULT</span>
                )}
              </div>
              <p className="mt-1 text-sm text-charcoal/80">{address.full_name} — {address.phone_number}</p>
              <p className="text-sm text-charcoal/60">
                {address.address_line1}
                {address.address_line2 ? `, ${address.address_line2}` : ""}, {address.city}, {address.state}{" "}
                {address.postal_code}
              </p>
            </div>
          </label>
        ))}
      </div>

      {showForm ? (
        <div className="mt-5">
          <AddressForm onSave={handleSaveAddress} onCancel={() => setShowForm(false)} saving={saving} />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-5 flex items-center gap-2 text-sm text-gold-dark hover:underline"
        >
          <FiPlus size={15} />
          Add a New Address
        </button>
      )}

      {addresses.length === 0 && !showForm && (
        <p className="mt-4 flex items-center gap-2 text-sm text-charcoal/50">
          <FiMapPin size={14} />
          You don't have any saved addresses yet.
        </p>
      )}

      <button
        onClick={onContinue}
        disabled={!selectedAddressId}
        className="mt-8 w-full rounded-sm bg-charcoal py-3.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
      >
        Continue to Review
      </button>
    </div>
  );
}
