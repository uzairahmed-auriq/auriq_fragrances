"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await apiFetch(`/products/${productId}/reviews`);
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auriqAccessToken');
    
    if (!token) {
      setError("Please sign in to leave a review.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await apiFetch(`/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (res.success) {
        setSuccess(true);
        setFormOpen(false);
        setComment("");
        setRating(5);
        fetchReviews(); // Refresh list
      } else {
        setError(res.message || "Failed to submit review");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) 
    : "0";

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-serif text-foreground font-bold tracking-wide mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= Number(averageRating) ? "fill-gold text-gold" : "text-foreground/20"}`} 
                />
              ))}
            </div>
            <span className="text-lg font-bold text-foreground">{averageRating} out of 5</span>
            <span className="text-sm text-foreground/50 font-medium">({reviews.length} Reviews)</span>
          </div>
        </div>
        
        <button 
          onClick={() => setFormOpen(!formOpen)}
          className="lg-btn px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase"
        >
          Write a Review
        </button>
      </div>

      {formOpen && (
        <div className="lux-glass-card p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-xl font-serif text-foreground font-bold mb-6 border-b border-foreground/10 pb-4">Share Your Experience</h3>
          
          {error && <div className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded">{error}</div>}
          {success && <div className="text-green-400 text-sm mb-4 bg-green-400/10 p-3 rounded">Review submitted successfully! It may take a moment to appear.</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold">Overall Rating</label>
              <div className="flex items-center gap-2 lg-input w-fit p-2 rounded-full">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 hover:scale-110 transition-transform ${star <= rating ? "text-gold" : "text-foreground/20"}`}
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? "fill-current drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" : ""}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold group-focus-within:text-gold transition-colors">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                placeholder="What did you like or dislike? What is this fragrance best for?"
                className="lg-input p-4 text-sm resize-none text-foreground placeholder:text-foreground/30 font-medium tracking-wide"
              />
            </div>

            <div className="flex justify-end gap-4 mt-2">
              <button 
                type="button" 
                onClick={() => setFormOpen(false)}
                className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/50 hover:text-foreground transition-colors px-4 py-2"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="lg-btn-primary px-8 py-3 text-white text-xs font-bold tracking-[0.2em] uppercase disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-6">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center lux-glass-card border-dashed border-foreground/20">
            <MessageSquare className="w-12 h-12 text-foreground/20 mb-4" />
            <h3 className="text-xl font-serif text-foreground font-bold mb-2">No reviews yet</h3>
            <p className="text-foreground/50 text-sm">Be the first to share your thoughts on this masterpiece.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="lux-glass-card p-8 border-l-4 border-l-gold/50 bg-foreground/[0.01]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= review.rating ? "fill-gold text-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]" : "text-foreground/20"}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-foreground/40 font-bold tracking-widest uppercase">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed font-medium mb-4">{review.comment}</p>
              <p className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-bold border-t border-foreground/10 pt-4">
                — {review.user?.name || "Verified Customer"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
