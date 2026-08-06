import { useState } from "react";
import StarRatingInput from "./StarRatingInput";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ rating, title, comment });
      setRating(0);
      setTitle("");
      setComment("");
    } catch (err) {
      setError(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gold/15 bg-cream p-6">
      <h3 className="mb-4 font-display text-lg text-charcoal">Write a Review</h3>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">Your Rating</label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          className="w-full rounded-sm border border-charcoal/15 bg-cream px-3 py-2 text-sm focus:border-gold-dark focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs tracking-wide text-charcoal/60">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share details about the fit, quality, or your experience"
          className="w-full resize-none rounded-sm border border-charcoal/15 bg-cream px-3 py-2 text-sm focus:border-gold-dark focus:outline-none"
        />
      </div>

      {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-sm bg-charcoal px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
