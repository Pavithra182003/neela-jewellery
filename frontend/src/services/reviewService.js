import api from "./api";

export const reviewService = {
  getProductReviews: (slug, params) =>
    api.get(`/reviews/product/${slug}/`, { params }).then((res) => res.data),

  createReview: (slug, payload) =>
    api.post(`/reviews/product/${slug}/`, payload).then((res) => res.data),

  updateReview: (id, payload) =>
    api.patch(`/reviews/${id}/`, payload).then((res) => res.data),

  deleteReview: (id) =>
    api.delete(`/reviews/${id}/`).then((res) => res.data),

  getMyReviews: () =>
    api.get("/reviews/mine/").then((res) => res.data),

  // ⭐ NEW
  getHomeReviews: () =>
    api.get("/reviews/home/").then((res) => res.data),
};