import { useEffect, useState } from "react";
import api from "../../services/api";

export default function InstagramGallery() {
  const [image, setImage] = useState(null);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [gallery, setGallery] = useState([]);

  const fetchGallery = async () => {
    try {
      const res = await api.get("/gallery/");
       setGallery(
      Array.isArray(res.data)
        ? res.data
        : res.data.results || []
    );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("instagram_url", instagramUrl);
    formData.append("display_order", displayOrder);
    formData.append("is_active", isActive);

    try {
      await api.post("/gallery/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Image Uploaded Successfully!");

      setImage(null);
      setInstagramUrl("");
      setDisplayOrder(1);
      setIsActive(true);

      fetchGallery();
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await api.delete(`/gallery/${id}/`);
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Instagram Gallery
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-8"
      >

        <input
          type="file"
          className="mb-4 block"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <input
          type="text"
          placeholder="Instagram URL"
          className="border p-2 w-full mb-4"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 w-full mb-4"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
        />

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <button
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Upload Image
        </button>

      </form>

      <div className="grid grid-cols-4 gap-6">

        {Array.isArray(gallery) &&
           gallery.map((item) => (

          <div
            key={item.id}
            className="border rounded-xl p-4"
          >

            <img
              src={item.image}
              alt=""
              className="w-full h-48 object-cover rounded-lg"
            />

            <p className="mt-3">
              Order : {item.display_order}
            </p>

            <a
              href={item.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600"
            >
              Instagram Link
            </a>

            <button
              onClick={() => deleteImage(item.id)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-3 w-full"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}