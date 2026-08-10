import api from "./api";

export const galleryService = {
  getInstagramGallery: async () => {
    try {
      const res = await api.get("/gallery/");

      console.log("Gallery API:", res.data);

      if (Array.isArray(res.data)) {
        return res.data;
      }

      if (Array.isArray(res.data?.results)) {
        return res.data.results;
      }

      return [];
    } catch (error) {
      console.error("Gallery API Error:", error);
      return [];
    }
  },
};