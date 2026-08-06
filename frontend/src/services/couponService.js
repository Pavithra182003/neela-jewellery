import api from "./api";

export const couponService = {
  validate: (code) => api.post("/coupons/validate/", { code }).then((res) => res.data),

  // Admin-only (staff)
  getCoupons: (params) => api.get("/coupons/", { params }).then((res) => res.data),
  createCoupon: (payload) => api.post("/coupons/", payload).then((res) => res.data),
  updateCoupon: (id, payload) => api.patch(`/coupons/${id}/`, payload).then((res) => res.data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}/`).then((res) => res.data),
};
