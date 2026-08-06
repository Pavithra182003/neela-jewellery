import api from "./api";

export const galleryService = {
  getInstagramGallery: () =>
    api.get("/gallery/").then((res) => res.data.results),
};