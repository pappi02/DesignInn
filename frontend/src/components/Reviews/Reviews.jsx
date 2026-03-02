/**
 * Reviews Component
 * Displays product reviews with filtering, sorting, and review submission
 * 
 * Features:
 * - Display reviews with ratings, author, date
 * - Filter by rating
 * - Sort by recent, helpful, rating
 * - Submit new review form
 * - Mark reviews as helpful
 * - Pagination
 * - Average rating display
 */

import React, { useState, useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { reviewsAPI } from '@/api';
import { useAPILoading } from '@/hooks';
import { useAuthStore } from '@/stores';
import { toast } from 'react-toastify';

const StarRating = ({ rating, interactive = false, onChange, color = 'text-yellow-400' }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => interactive && onChange?.(star)}
          disabled={!interactive}
          className={`text-lg transition-colors ${
            star <= rating
              ? `${color}`
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewForm = ({ productSlug, onReviewSubmitted, userHasReview }) => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const { form, setForm, errors, reset } = useForm({
    title: '',
    comment: '',
    rating: 5,
  });
  const { isLoading: isSubmitting } = useAPILoading();

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Please <a href="/login" className="font-bold underline">sign in</a> to submit a review.
        </p>
      </div>
    );
  }

  if (userHasReview && !isOpen) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 mb-2">You have already reviewed this product.</p>
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-gold hover:text-amber-600 underline"
        >
          Edit your review
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await reviewsAPI.submitReview(productSlug, {
      rating: form.rating,
      title: form.title,
      comment: form.comment,
      verified: true,
    });

    if (result.success) {
      toast.success('Review submitted successfully!');
      reset();
      setIsOpen(false);
      onReviewSubmitted?.();
    } else {
      toast.error(result.error || 'Failed to submit review');
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gold text-black font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Rating</label>
            <StarRating
              rating={form.rating}
              interactive
              onChange={(rating) => setForm({ ...form, rating })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              placeholder="Summarize your review"
              maxLength={100}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
            />
            <p className="text-xs text-gray-500 mt-1">{form.title.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Your Review</label>
            <textarea
              placeholder="Share your experience with this product"
              maxLength={1000}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{form.comment.length}/1000</p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gold text-black font-semibold py-2 rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 text-black font-semibold py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const ReviewItem = ({ review, productSlug, onHelpful }) => {
  const [isHelpful, setIsHelpful] = useState(null);
  const { isLoading } = useAPILoading();

  const handleMarkHelpful = async (helpful) => {
    const result = await reviewsAPI.markAsHelpful(productSlug, review.id, helpful);
    if (result.success) {
      setIsHelpful(helpful);
      onHelpful?.();
    }
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{review.title}</h4>
            {review.verified_purchase && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} color="text-yellow-400" />
            <span className="text-sm text-gray-600">{review.rating}.0</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-2">{review.comment}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          By {review.author_name || 'Anonymous'} • {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recently'}
        </span>
      </div>

      <div className="flex gap-4 mt-2 text-sm">
        <button
          onClick={() => handleMarkHelpful(true)}
          disabled={isLoading}
          className={`flex items-center gap-1 ${
            isHelpful === true
              ? 'text-gold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👍 Helpful ({review.helpful_count || 0})
        </button>
        <button
          onClick={() => handleMarkHelpful(false)}
          disabled={isLoading}
          className={`flex items-center gap-1 ${
            isHelpful === false
              ? 'text-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👎 Not helpful ({review.unhelpful_count || 0})
        </button>
      </div>
    </div>
  );
};

const Reviews = ({ productSlug, productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [totalPages, setTotalPages] = useState(1);
  
  const { isLoading, setGlobalLoading } = useAPILoading();
  const { user } = useAuthStore();

  const loadReviews = async () => {
    setGlobalLoading(true);
    try {
      const [reviewsResult, statsResult, userReviewResult] = await Promise.all([
        reviewsAPI.getProductReviews(productSlug, {
          page: currentPage,
          limit: 10,
          sortBy,
          rating: filterRating,
        }),
        reviewsAPI.getReviewStats(productSlug),
        user ? reviewsAPI.getMyReviewForProduct(productSlug) : null,
      ]);

      if (reviewsResult.success) {
        setReviews(reviewsResult.data);
        setTotalPages(reviewsResult.totalPages);
      }

      if (statsResult.success) {
        setStats(statsResult.data);
      }

      if (userReviewResult?.success) {
        setUserReview(userReviewResult.data);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productSlug, currentPage, filterRating, sortBy]);

  const averageRating = stats?.average_rating || 0;
  const ratingCounts = stats?.rating_distribution || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
      </div>

      {/* Rating Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating Card */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-gold mb-2">{averageRating.toFixed(1)}</div>
              <StarRating rating={Math.round(averageRating)} color="text-yellow-400" />
              <p className="text-sm text-gray-600 mt-2">
                Based on {stats.total_reviews} reviews
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all"
                      style={{
                        width: `${((ratingCounts[rating] || 0) / stats.total_reviews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {ratingCounts[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          <div>
            <ReviewForm
              productSlug={productSlug}
              userHasReview={userReview?.id !== undefined}
              onReviewSubmitted={loadReviews}
            />
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-200 pt-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Filter by Rating</label>
          <select
            value={filterRating || ''}
            onChange={(e) => {
              setFilterRating(e.target.value ? parseInt(e.target.value) : null);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gold"></div>
          <p className="text-gray-600 mt-2">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div>
          <div className="space-y-0 divide-y divide-gray-200">
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                productSlug={productSlug}
                onHelpful={loadReviews}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gold bg-gold text-black rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
