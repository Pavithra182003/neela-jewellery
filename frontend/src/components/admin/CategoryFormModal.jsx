import { useEffect, useState } from "react";
import Modal from "./Modal";

const EMPTY_FORM = {
  name: "",
  description: "",
  parent: "",
  is_active: true,
  display_order: 0,
  image: null,
};

export default function CategoryFormModal({
  open,
  onClose,
  category,
  categories,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
        parent: category.parent || "",
        is_active: category.is_active ?? true,
        display_order: category.display_order ?? 0,
        image: null,
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setError("");
  }, [category, open]);

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);

      if (form.parent) {
        formData.append("parent", form.parent);
      }

      formData.append("display_order", form.display_order);
      formData.append("is_active", form.is_active);

      if (form.image) {
        formData.append("image", form.image);
      }

      await onSave(formData);
    } catch (err) {
      const data = err?.response?.data;

      setError(
        data
          ? Object.values(data).flat().join(" ")
          : "Could not save category."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2 text-sm focus:border-gold-dark focus:outline-none";

  const labelClasses =
    "mb-1 block text-xs tracking-wide text-charcoal/60";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? "Edit Category" : "New Category"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className={labelClasses}>Name</label>

          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Description</label>

          <textarea
            rows={3}
            value={form.description}
            onChange={handleChange("description")}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div>
          <label className={labelClasses}>Category Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className={labelClasses}>Parent Category</label>

            <select
              value={form.parent}
              onChange={handleChange("parent")}
              className={inputClasses}
            >
              <option value="">None (Top Level)</option>

              {(Array.isArray(categories) ? categories : [])
            .filter((c) => c.id !== category?.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
               
            </select>
          </div>

          <div>
            <label className={labelClasses}>Display Order</label>

            <input
              type="number"
              value={form.display_order}
              onChange={handleChange("display_order")}
              className={inputClasses}
            />
          </div>

        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange("is_active")}
            className="accent-gold-dark"
          />

          Active
        </label>

        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-gold/15 pt-4">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-charcoal/60 hover:text-charcoal"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : category
              ? "Save Changes"
              : "Create Category"}
          </button>

        </div>

      </form>
    </Modal>
  );
}