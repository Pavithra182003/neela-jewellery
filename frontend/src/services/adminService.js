import api from "./api";

export const adminService = {
  getOrderSummary: () => api.get("/orders/admin/summary/").then((res) => res.data),
  getLowStockProducts: (threshold = 5) =>
    api.get("/products/low_stock/", { params: { threshold } }).then((res) => res.data),

  getCustomers: (params) => api.get("/auth/admin/users/", { params }).then((res) => res.data),
  toggleCustomerActive: (id) =>
    api.post(`/auth/admin/users/${id}/toggle-active/`).then((res) => res.data),

  getAllReviews: (params) => api.get("/reviews/admin/", { params }).then((res) => res.data),
  moderateReview: (id, isApproved) =>
    api.patch(`/reviews/${id}/approve/`, { is_approved: isApproved }).then((res) => res.data),
};
