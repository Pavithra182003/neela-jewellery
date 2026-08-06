import { useEffect, useState } from "react";
import { FiHome, FiPlus, FiStar, FiTrash2 } from "react-icons/fi";
import AddressForm from "../components/checkout/AddressForm";
import { addressService } from "../services/addressService";

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadAddresses = () => {
    setLoading(true);
    addressService
      .getAddresses()
      .then((data) => setAddresses(data.results || data))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadAddresses, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const created = await addressService.createAddress(payload);
      setAddresses((prev) => [created, ...prev]);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (id) => {
    setBusyId(id);
    try {
      await addressService.setDefault(id);
      setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-charcoal/5" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl text-charcoal">Saved Addresses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm text-gold-dark hover:underline"
          >
            <FiPlus size={15} />
            Add New
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <AddressForm onSave={handleSave} onCancel={() => setShowForm(false)} saving={saving} />
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="text-sm text-charcoal/50">You haven't saved any addresses yet.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-lg border border-charcoal/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
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

                <div className="flex flex-shrink-0 gap-3">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={busyId === address.id}
                      aria-label="Set as default"
                      className="text-charcoal/40 transition-colors hover:text-gold-dark disabled:opacity-40"
                      title="Set as default"
                    >
                      <FiStar size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={busyId === address.id}
                    aria-label="Delete address"
                    className="text-charcoal/40 transition-colors hover:text-red-600 disabled:opacity-40"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
