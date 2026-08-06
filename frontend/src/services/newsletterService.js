import api from "./api";

export const newsletterService = {
  subscribe: (email) =>
    api.post("/notifications/newsletter/subscribe/", { email }).then((res) => res.data),
};
