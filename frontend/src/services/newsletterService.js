import api from "./api";

export const newsletterService = {
  subscribe: (email) =>
    api.post("/notifications/newsletter/subscribe/", { email })
      .then((res) => res.data),

  getSubscribers: () =>
    api.get("/notifications/newsletter/subscribers/")
      .then((res) => res.data),
};