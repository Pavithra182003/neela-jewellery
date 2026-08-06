import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import ProductFormModal from "../../components/admin/ProductFormModal";
import Pagination from "../../components/shop/Pagination";
import { productService } from "../../services/productService";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const pageSize = 15;

  const loadProducts = () => {
    setLoading(true);
    productService
      .getProducts({ page, page_size: pageSize, ordering: "-created_at" })
      .then((data) => {
        setProducts(data.results || data);
        setCount(data.count ?? (data.results || data).length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, [page]);

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = async (product) => {
    setLoadingEdit(true);
    try {
      const full = await productService.getProduct(product.slug);
      setEditingProduct(full);
      setModalOpen(true);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSave = async (payload) => {
    if (editingProduct) {
      await productService.updateProduct(editingProduct.slug, payload);
    } else {
      await productService.createProduct(payload);
    }
    setModalOpen(false);
    loadProducts();
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await productService.deleteProduct(product.slug);
    loadProducts();
  };

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">Products ({count})</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-sm bg-charcoal px-4 py-2.5 text-sm text-cream transition-colors hover:bg-gold-dark"
        >
          <FiPlus size={15} />
          New Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-charcoal/10">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/[0.03] text-left text-xs tracking-wide text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">Loading…</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">No products yet.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-charcoal/5">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img
                      src={product.primary_image || "https://picsum.photos/seed/admin-placeholder/60/60"}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <span className="text-charcoal">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">{product.sku}</td>
                  <td className="px-4 py-3 text-charcoal">₹{product.current_price}</td>
                  <td className="px-4 py-3 text-charcoal/60">{product.stock_quantity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        product.is_active !== false ? "bg-green-50 text-green-700" : "bg-charcoal/10 text-charcoal/50"
                      }`}
                    >
                      {product.is_active !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(product)} disabled={loadingEdit} aria-label="Edit" className="text-charcoal/50 hover:text-gold-dark disabled:opacity-40">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(product)} aria-label="Delete" className="text-charcoal/50 hover:text-red-600">
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

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        onSave={handleSave}
      />
    </div>
  );
}
