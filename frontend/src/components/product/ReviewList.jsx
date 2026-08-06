import { FiCheckCircle, FiStar } from "react-icons/fi";

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-charcoal/60">
      <span className="w-8">{star} star</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-charcoal/10">
        <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right">{count}</span>
    </div>
  );
}

export default function ReviewList({ reviews, averageRating, reviewCount }) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  if (reviewCount === 0) {
    return (
      <p className="py-8 text-center text-sm text-charcoal/50">
        No reviews yet — be the first to share your experience.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-8 sm:flex-row sm:items-center">
        <div className="text-center sm:border-r sm:border-gold/15 sm:pr-8">
          <p className="font-display text-4xl text-charcoal">{averageRating.toFixed(1)}</p>
          <div className="my-1.5 flex justify-center gap-0.5 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={14}
                className={i < Math.round(averageRating) ? "fill-gold" : "text-charcoal/20"}
              />
            ))}
          </div>
          <p className="text-xs text-charcoal/50">{reviewCount} review{reviewCount === 1 ? "" : "s"}</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {distribution.map((d) => (
            <RatingBar key={d.star} star={d.star} count={d.count} total={reviewCount} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gold/10 pb-6 last:border-b-0">
            <div className="mb-1.5 flex items-center gap-2">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} size={13} className={i < review.rating ? "fill-gold" : "text-charcoal/20"} />
                ))}
              </div>
              {review.is_verified_purchase && (
                <span className="flex items-center gap-1 text-[11px] text-gold-dark">
                  <FiCheckCircle size={12} />
                  Verified Purchase
                </span>
              )}
            </div>
            {review.title && <p className="font-medium text-charcoal">{review.title}</p>}
            {review.comment && <p className="mt-1 text-sm leading-relaxed text-charcoal/70">{review.comment}</p>}
            <p className="mt-2 text-xs text-charcoal/40">
              {review.user_name} · {new Date(review.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
