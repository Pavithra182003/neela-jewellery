import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { MATERIAL_OPTIONS, GENDER_OPTIONS } from "../shop/filterOptions";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService";

const EMPTY_FORM = {
  category: "",
  name: "",
  sku: "",
  description: "",
  short_description: "",
  material: "gold",
  gender: "unisex",
  weight_grams: "",
  purity: "",
  price: "",
  discount_price: "",
  stock_quantity: 0,
  is_featured: false,
  is_bestseller: false,
  is_new_arrival: false,
  is_active: true,
};

export default function ProductFormModal({ open, onClose, product, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImages(product?.images || []);
  }, [product]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("is_primary", images.length === 0 ? "true" : "false");
      const newImage = await productService.uploadImage(product.slug, formData);
      setImages((prev) => [...prev, newImage]);
    } catch {
      setError("Could not upload image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!product) return;
    try {
      await productService.deleteImage(product.slug, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      setError("Could not delete image.");
    }
  };

  useEffect(() => {
    if (open) {
      categoryService.getCategories().then((data) => setCategories(data.results || data)).catch(() => setCategories([]));
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setForm({
        category: product.category?.id || "",
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        short_description: product.short_description || "",
        material: product.material || "gold",
        gender: product.gender || "unisex",
        weight_grams: product.weight_grams || "",
        purity: product.purity || "",
        price: product.price || "",
        discount_price: product.discount_price || "",
        stock_quantity: product.stock_quantity ?? 0,
        is_featured: !!product.is_featured,
        is_bestseller: !!product.is_bestseller,
        is_new_arrival: !!product.is_new_arrival,
        is_active: product.is_active ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError("");
  }, [product, open]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        discount_price: form.discount_price || null,
        weight_grams: form.weight_grams || null,
      };
      await onSave(payload);
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.entries(data).map(([k, v]) => `${k}: ${[].concat(v).join(" ")}`).join(" ") : "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-sm border border-charcoal/20 bg-cream px-3 py-2 text-sm focus:border-gold-dark focus:outline-none";
  const labelClasses = "mb-1 block text-xs tracking-wide text-charcoal/60";

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit Product" : "New Product"} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Name</label>
            <input required value={form.name} onChange={handleChange("name")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>SKU</label>
            <input required value={form.sku} onChange={handleChange("sku")} className={inputClasses} />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={handleChange("description")}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Category</label>
            <select required value={form.category} onChange={handleChange("category")} className={inputClasses}>
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Material</label>
            <select value={form.material} onChange={handleChange("material")} className={inputClasses}>
              {MATERIAL_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClasses}>Price (₹)</label>
            <input required type="number" step="0.01" value={form.price} onChange={handleChange("price")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Discount Price (₹)</label>
            <input type="number" step="0.01" value={form.discount_price} onChange={handleChange("discount_price")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Stock Qty</label>
            <input required type="number" value={form.stock_quantity} onChange={handleChange("stock_quantity")} className={inputClasses} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClasses}>Gender</label>
            <select value={form.gender} onChange={handleChange("gender")} className={inputClasses}>
              {GENDER_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Weight (g)</label>
            <input type="number" step="0.01" value={form.weight_grams} onChange={handleChange("weight_grams")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Purity</label>
            <input placeholder="e.g. 22K" value={form.purity} onChange={handleChange("purity")} className={inputClasses} />
          </div>
        </div>

        <div className="flex flex-wrap gap-5 pt-1">
          {[
            ["is_featured", "Featured"],
            ["is_bestseller", "Bestseller"],
            ["is_new_arrival", "New Arrival"],
            ["is_active", "Active"],
          ].map(([field, label]) => (
            <label key={field} className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={form[field]} onChange={handleChange(field)} className="accent-gold-dark" />
              {label}
            </label>
          ))}
        </div>

        {product && (
          <div>
            <label className={labelClasses}>Images</label>
            <div className="flex flex-wrap gap-3">
              {images.map((img) => (
                <div key={img.id} className="group relative h-20 w-20 overflow-hidden rounded-md border border-gold/20">
                  <img src={img.image} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(img.id)}
                    className="absolute inset-0 flex items-center justify-center bg-charcoal/60 text-cream opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
              <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border border-dashed border-charcoal/25 text-xs text-charcoal/40 hover:border-gold-dark hover:text-gold-dark">
                {uploading ? "…" : "+ Add"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-gold/15 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-charcoal/60 hover:text-charcoal">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            {saving ? "Saving…" : product ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
