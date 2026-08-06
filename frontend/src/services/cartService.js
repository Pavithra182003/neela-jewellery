import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart/").then((res) => res.data),
  addToCart: (productId, quantity = 1) =>
    api.post("/cart/add/", { product_id: productId, quantity }).then((res) => res.data),
  updateCartItem: (itemId, quantity) =>
    api.patch(`/cart/items/${itemId}/`, { quantity }).then((res) => res.data),
  removeCartItem: (itemId) => api.delete(`/cart/items/${itemId}/`).then((res) => res.data),
  clearCart: () => api.delete("/cart/clear/").then((res) => res.data),
};
