import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useAuth } from "../../context/AuthContext";
import { reviewService } from "../../services/reviewService";

const TABS = ["Description", "Specifications", "Reviews"];

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("Description");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [formMessage, setFormMessage] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setReviewsLoading(true);
    reviewService
      .getProductReviews(product.slug)
      .then((data) => setReviews(data.results || data))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [product.slug]);

  const handleSubmitReview = async (payload) => {
    const review = await reviewService.createReview(product.slug, payload);
    setReviews((prev) => [review, ...prev]);
    setFormMessage(
      review.is_verified_purchase
        ? "Thank you! Your verified review has been posted."
        : "Thank you! Your review has been posted."
    );
  };

  const specs = [
    { label: "SKU", value: product.sku },
    { label: "Material", value: product.material?.replace("_", " ") },
    { label: "Purity", value: product.purity },
    { label: "Weight", value: product.weight_grams ? `${product.weight_grams} g` : null },
    { label: "Gender", value: product.gender },
  ].filter((s) => s.value);

  return (
    <div className="mt-16">
      <div className="flex gap-8 border-b border-gold/15">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-4 text-sm tracking-wide transition-colors ${
              activeTab === tab ? "text-gold-dark" : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {tab}
            {tab === "Reviews" && product.review_count > 0 && (
              <span className="ml-1.5 text-xs text-charcoal/40">({product.review_count})</span>
            )}
            {activeTab === tab && (
              <span className="absolute -bottom-px left-0 h-0.5 w-full bg-gold-dark" />
            )}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === "Description" && (
          <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-charcoal/75">
            {product.description}
          </p>
        )}

        {activeTab === "Specifications" && (
          <table className="w-full max-w-md text-sm">
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.label} className="border-b border-gold/10">
                  <td className="py-3 pr-6 capitalize text-charcoal/50">{spec.label}</td>
                  <td className="py-3 capitalize text-charcoal">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "Reviews" && (
          <div className="max-w-2xl space-y-10">
            {reviewsLoading ? (
              <p className="text-sm text-charcoal/50">Loading reviews…</p>
            ) : (
              <ReviewList
                reviews={reviews}
                averageRating={product.average_rating}
                reviewCount={product.review_count}
              />
            )}

            {isAuthenticated ? (
              formMessage ? (
                <p className="rounded-lg border border-gold/20 bg-gold/5 p-4 text-sm text-gold-dark">
                  {formMessage}
                </p>
              ) : (
                <ReviewForm onSubmit={handleSubmitReview} />
              )
            ) : (
              <p className="text-sm text-charcoal/50">
                Please{" "}
                <Link to="/login" className="text-gold-dark underline-offset-2 hover:underline">
                  log in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
