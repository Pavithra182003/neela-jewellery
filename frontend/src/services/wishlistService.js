import api from "./api";

export const wishlistService = {
  getWishlist: () => api.get("/wishlist/").then((res) => res.data),
  toggle: (productId) =>
    api.post("/wishlist/toggle/", { product_id: productId }).then((res) => res.data),
  removeItem: (itemId) => api.delete(`/wishlist/items/${itemId}/`).then((res) => res.data),
  moveToCart: (itemId) =>
    api.post(`/wishlist/items/${itemId}/move-to-cart/`).then((res) => res.data),
};
