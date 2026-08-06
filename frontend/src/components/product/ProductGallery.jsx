import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";

const FALLBACK_IMAGE = "https://picsum.photos/seed/neela-product-detail/900/900";

export default function ProductGallery({ images = [] }) {
  const gallery = images.length > 0 ? images : [{ id: "fallback", image: FALLBACK_IMAGE, alt_text: "" }];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const frameRef = useRef(null);

  const active = gallery[activeIndex];

  const handleMouseMove = (e) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  const goTo = (i) => setActiveIndex(((i % gallery.length) + gallery.length) % gallery.length);

  return (
    <div className="lg:sticky lg:top-28">
      <div
        ref={frameRef}
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-lg bg-charcoal/5"
        onMouseEnter={() => setZoomActive(true)}
        onMouseLeave={() => setZoomActive(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={active.image}
          alt={active.alt_text || "Product image"}
          className="h-full w-full object-cover"
        />

        {/* Zoomed layer, revealed and repositioned on hover — desktop only */}
        {zoomActive && (
          <div
            className="pointer-events-none absolute inset-0 hidden bg-no-repeat sm:block"
            style={{
              backgroundImage: `url(${active.image})`,
              backgroundSize: "220%",
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
        )}

        {!zoomActive && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1.5 text-[11px] tracking-wide text-charcoal opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 sm:flex">
            <FiZoomIn size={13} />
            Hover to zoom
          </div>
        )}

        {gallery.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-charcoal opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 sm:flex"
            >
              <FiChevronLeft size={17} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-charcoal opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 sm:flex"
            >
              <FiChevronRight size={17} />
            </button>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {gallery.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                i === activeIndex ? "border-gold-dark" : "border-transparent hover:border-gold/40"
              }`}
            >
              <img src={img.image} alt={img.alt_text || ""} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
