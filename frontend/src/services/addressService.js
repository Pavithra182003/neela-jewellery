import api from "./api";

export const addressService = {
  getAddresses: () => api.get("/auth/addresses/").then((res) => res.data),
  getAddress: (id) => api.get(`/auth/addresses/${id}/`).then((res) => res.data),
  createAddress: (payload) => api.post("/auth/addresses/", payload).then((res) => res.data),
  updateAddress: (id, payload) => api.patch(`/auth/addresses/${id}/`, payload).then((res) => res.data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}/`).then((res) => res.data),
  setDefault: (id) => api.post(`/auth/addresses/${id}/set-default/`).then((res) => res.data),
};
