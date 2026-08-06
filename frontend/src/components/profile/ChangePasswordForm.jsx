import { useState } from "react";
import { authService } from "../../services/authService";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({ old_password: "", new_password: "", new_password2: "" });
  const [status, setStatus] = useState("idle"); // idle | saving | done
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("saving");
    try {
      await authService.changePassword(form.old_password, form.new_password, form.new_password2);
      setStatus("done");
      setForm({ old_password: "", new_password: "", new_password2: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Could not change your password.");
      setStatus("idle");
    }
  };

  const inputClasses =
    "w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2.5 text-sm focus:border-gold-dark focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">Current Password</label>
          <input
            type="password"
            required
            value={form.old_password}
            onChange={handleChange("old_password")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">New Password</label>
          <input
            type="password"
            required
            value={form.new_password}
            onChange={handleChange("new_password")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">Confirm New Password</label>
          <input
            type="password"
            required
            value={form.new_password2}
            onChange={handleChange("new_password2")}
            className={inputClasses}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      {status === "done" && <p className="mt-3 text-xs text-gold-dark">Password changed successfully.</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-5 rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Change Password"}
      </button>
    </form>
  );
}
