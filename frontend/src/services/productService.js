import api from "./api";

export const productService = {
  getProducts: (params) => api.get("/products/", { params }).then((res) => res.data),
  getProduct: (slug) => api.get(`/products/${slug}/`).then((res) => res.data),
  getFeatured: () => api.get("/products/featured/").then((res) => res.data),
  getBestsellers: () => api.get("/products/bestsellers/").then((res) => res.data),
  getNewArrivals: () => api.get("/products/new-arrivals/").then((res) => res.data),
  getRelated: (slug) => api.get(`/products/${slug}/related/`).then((res) => res.data),

  // Admin-only (staff) — enforced server-side by IsAdminOrReadOnly
  createProduct: (payload) => api.post("/products/", payload).then((res) => res.data),
  updateProduct: (slug, payload) => api.patch(`/products/${slug}/`, payload).then((res) => res.data),
  deleteProduct: (slug) => api.delete(`/products/${slug}/`).then((res) => res.data),
  uploadImage: (slug, formData) =>
    api
      .post(`/products/${slug}/upload_image/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
  deleteImage: (slug, imageId) => api.delete(`/products/${slug}/images/${imageId}/`).then((res) => res.data),
};
