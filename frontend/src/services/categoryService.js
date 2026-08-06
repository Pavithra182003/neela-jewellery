import api from "./api";

export const categoryService = {
  getCategories: (params) =>
    api.get("/categories/", { params }).then((res) => res.data),

  getCategory: (slug) =>
    api.get(`/categories/${slug}/`).then((res) => res.data),

  // Create Category
  createCategory: (formData) =>
    api.post("/categories/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => res.data),

  // Update Category
  updateCategory: (slug, formData) =>
    api.patch(`/categories/${slug}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => res.data),

  // Delete Category
  deleteCategory: (slug) =>
    api.delete(`/categories/${slug}/`).then((res) => res.data),
};