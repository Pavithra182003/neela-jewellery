import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiCheckCircle, FiStar, FiX } from "react-icons/fi";
import Pagination from "../../components/shop/Pagination";
import { adminService } from "../../services/adminService";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "false" },
  { label: "Approved", value: "true" },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const pageSize = 15;

  const loadReviews = () => {
    setLoading(true);
    const params = { page, page_size: pageSize };
    if (filter !== "") params.is_approved = filter;
    adminService
      .getAllReviews(params)
      .then((data) => {
        setReviews(data.results || data);
        setCount(data.count ?? (data.results || data).length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadReviews, [page, filter]);

  const handleModerate = async (review, isApproved) => {
    setBusyId(review.id);
    try {
      await adminService.moderateReview(review.id, isApproved);
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, is_approved: isApproved } : r)));
    } finally {
      setBusyId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-charcoal">Reviews ({count})</h1>

      <div className="mb-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
              filter === f.value
                ? "bg-charcoal text-cream"
                : "border border-charcoal/15 text-charcoal/60 hover:border-gold-dark hover:text-gold-dark"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="py-8 text-center text-charcoal/40">Loading…</p>
        ) : reviews.length === 0 ? (
          <p className="py-8 text-center text-charcoal/40">No reviews found.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-charcoal/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar key={i} size={13} className={i < review.rating ? "fill-gold" : "text-charcoal/20"} />
                      ))}
                    </div>
                    {review.is_verified_purchase && (
                      <span className="flex items-center gap-1 text-[11px] text-gold-dark">
                        <FiCheckCircle size={11} />
                        Verified
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        review.is_approved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {review.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <Link to={`/product/${review.product_slug}`} className="mt-1 block text-sm text-charcoal hover:text-gold-dark">
                    {review.product_name}
                  </Link>
                  {review.title && <p className="mt-1 text-sm font-medium text-charcoal">{review.title}</p>}
                  {review.comment && <p className="mt-1 text-sm text-charcoal/60">{review.comment}</p>}
                  <p className="mt-2 text-xs text-charcoal/40">
                    {review.user_name} ·{" "}
                    {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  {!review.is_approved ? (
                    <button
                      onClick={() => handleModerate(review, true)}
                      disabled={busyId === review.id}
                      aria-label="Approve"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-green-200 text-green-600 hover:bg-green-50 disabled:opacity-40"
                    >
                      <FiCheck size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerate(review, false)}
                      disabled={busyId === review.id}
                      aria-label="Hide"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40"
                    >
                      <FiX size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
