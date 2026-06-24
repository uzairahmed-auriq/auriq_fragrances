"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { reviewService } from "../../services/reviewService";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user: { name: string };
}

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("auriqAccessToken"));
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await reviewService.getProductReviews(productId);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await reviewService.addReview(productId, rating, comment);
      setSuccess(true);
      setRating(0);
      setComment("");
      fetchReviews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-lux py-16 border-t border-foreground/10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-foreground font-bold tracking-wide mb-2">Customer Reviews</h2>

        <div className="flex items-center gap-3 mb-10">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= Math.round(averageRating) ? "text-gold fill-gold" : "text-foreground/20"}`}
              />
            ))}
          </div>
          <span className="text-foreground/70 text-sm">
            {averageRating > 0 ? averageRating.toFixed(1) : "No ratings yet"} ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </span>
        </div>

        {/* Review Form */}
        <div className="lux-glass-card p-6 rounded-xl mb-10">
          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">Write a Review</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= (hoverRating || rating) ? "text-gold fill-gold" : "text-foreground/20"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this fragrance..."
                rows={3}
                className="bg-transparent border border-foreground/20 rounded-lg px-4 py-3 text-sm text-foreground focus:border-gold outline-none resize-none"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-emerald-400 text-sm">Review submitted successfully!</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start bg-gold/90 text-background px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-foreground transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="text-foreground/60 text-sm text-center py-2">
              Please <a href="/account" className="text-gold underline">log in</a> to write a review.
            </p>
          )}
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-foreground/50 text-center py-12">No reviews yet. Be the first to share your thoughts.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-foreground/10 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-foreground font-semibold">{r.user?.name || "Anonymous"}</span>
                  <span className="text-xs text-foreground/40">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= r.rating ? "text-gold fill-gold" : "text-foreground/20"}`}
                    />
                  ))}
                </div>
                {r.comment && <p className="text-foreground/70 text-sm leading-relaxed">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
