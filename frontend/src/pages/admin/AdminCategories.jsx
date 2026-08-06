import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import CategoryFormModal from "../../components/admin/CategoryFormModal";
import { categoryService } from "../../services/categoryService";

export default function AdminCategories() {
  const [topLevel, setTopLevel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = () => {
    setLoading(true);
    categoryService
      .getCategories()
      .then((data) => setTopLevel(data.results || data))
      .finally(() => setLoading(false));
  };

  useEffect(loadCategories, []);

  // Flatten: each top-level category followed by its nested
  // subcategories (already included one level deep per Module 4's
  // CategorySerializer) — avoids needing a separate "flat list" API.
  const rows = topLevel.flatMap((cat) => [
    { ...cat, depth: 0 },
    ...(cat.subcategories || []).map((sub) => ({ ...sub, depth: 1, parent: cat.id })),
  ]);

  const openCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEdit = async (row) => {
    const full = await categoryService.getCategory(row.slug);
    setEditingCategory(full);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.slug, payload);
    } else {
      await categoryService.createCategory(payload);
    }
    setModalOpen(false);
    loadCategories();
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name}"? Products in this category will need reassigning.`)) return;
    await categoryService.deleteCategory(row.slug);
    loadCategories();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-sm bg-charcoal px-4 py-2.5 text-sm text-cream transition-colors hover:bg-gold-dark"
        >
          <FiPlus size={15} />
          New Category
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-charcoal/10">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/[0.03] text-left text-xs tracking-wide text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-charcoal/40">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-charcoal/40">No categories yet.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-charcoal/5">
                  <td className="px-4 py-3 text-charcoal" style={{ paddingLeft: `${16 + row.depth * 24}px` }}>
                    {row.depth > 0 && <span className="mr-2 text-charcoal/30">↳</span>}
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">{row.product_count}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        row.is_active !== false ? "bg-green-50 text-green-700" : "bg-charcoal/10 text-charcoal/50"
                      }`}
                    >
                      {row.is_active !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(row)} aria-label="Edit" className="text-charcoal/50 hover:text-gold-dark">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(row)} aria-label="Delete" className="text-charcoal/50 hover:text-red-600">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={editingCategory}
        categories={topLevel}
        onSave={handleSave}
      />
    </div>
  );
}
