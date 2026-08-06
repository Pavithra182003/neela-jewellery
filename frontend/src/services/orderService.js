import api from "./api";

export const orderService = {
  getOrders: (params) => api.get("/orders/", { params }).then((res) => res.data),
  getOrder: (orderNumber) => api.get(`/orders/${orderNumber}/`).then((res) => res.data),
  createOrder: (payload) => api.post("/orders/", payload).then((res) => res.data),
  cancelOrder: (orderNumber) => api.post(`/orders/${orderNumber}/cancel/`).then((res) => res.data),

  // Admin-only (staff)
  updateOrderStatus: (orderNumber, payload) =>
    api.patch(`/orders/${orderNumber}/status/`, payload).then((res) => res.data),
};
