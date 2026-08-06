import { useState } from "react";
import { FiStar } from "react-icons/fi";

export default function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <FiStar
            size={22}
            className={(hovered || value) >= star ? "fill-gold text-gold" : "text-charcoal/25"}
          />
        </button>
      ))}
    </div>
  );
}
