import { useEffect, useState } from "react";
import { FiInstagram } from "react-icons/fi";
import Container from "../common/Container";
import { galleryService } from "../../services/galleryService";

const INSTAGRAM_URL =
  "https://www.instagram.com/neela_jewellers/";

export default function InstagramGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
  galleryService
    .getInstagramGallery()
    .then((data) => {
      console.log("Gallery Response:", data);

      setImages(Array.isArray(data) ? data : data.results || []);
    })
    .catch((error) => {
      console.error("Gallery Error:", error);
    });
}, []);

  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs tracking-[0.35em] text-gold-dark">
            FOLLOW US ON INSTAGRAM
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-3xl text-charcoal sm:text-4xl hover:text-gold-dark transition-colors"
          >
            @neela_jewellers
          </a>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-6">
          {Array.isArray(images) && 
           images.map((img) => (
            <a
              key={img.id}
              href={img.instagram_url || INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={img.image}
                alt="Neela Jewellers Instagram"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors group-hover:bg-charcoal/40">
                <FiInstagram
                  size={20}
                  className="text-cream opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}