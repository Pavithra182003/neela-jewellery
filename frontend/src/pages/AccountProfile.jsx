import { useState } from "react";
import { FiCamera } from "react-icons/fi";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export default function AccountProfile() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
    date_of_birth: user?.date_of_birth || "",
  });
  const [status, setStatus] = useState("idle"); // idle | saving | done
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("saving");
    try {
      await authService.updateMe(form);
      await refreshProfile();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Could not update your profile.");
      setStatus("idle");
    }
  };

  const inputClasses =
    "w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2.5 text-sm focus:border-gold-dark focus:outline-none";

  return (
    <div className="space-y-12">
      <div>
        <h2 className="mb-6 font-display text-xl text-charcoal">Profile Details</h2>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gold/10 text-lg font-display text-gold-dark">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.full_name} className="h-full w-full object-cover" />
            ) : (
              (user?.first_name?.[0] || user?.username?.[0] || "N").toUpperCase()
            )}
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-cream">
              <FiCamera size={10} />
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">{user?.email}</p>
            <p className="text-xs text-charcoal/50">
              {user?.is_email_verified ? "Email verified" : "Email not verified"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">First Name</label>
              <input value={form.first_name} onChange={handleChange("first_name")} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">Last Name</label>
              <input value={form.last_name} onChange={handleChange("last_name")} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">Phone Number</label>
              <input value={form.phone_number} onChange={handleChange("phone_number")} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">Date of Birth</label>
              <input
                type="date"
                value={form.date_of_birth || ""}
                onChange={handleChange("date_of_birth")}
                className={inputClasses}
              />
            </div>
          </div>

          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
          {status === "done" && <p className="mt-3 text-xs text-gold-dark">Profile updated successfully.</p>}

          <button
            type="submit"
            disabled={status === "saving"}
            className="mt-5 rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="border-t border-gold/15 pt-10">
        <h2 className="mb-6 font-display text-xl text-charcoal">Change Password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
