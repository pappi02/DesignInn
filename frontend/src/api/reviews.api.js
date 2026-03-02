/**
 * Reviews API Service
 * Handles all product reviews and ratings API calls:
 * - Get product reviews with filtering
 * - Submit new review
 * - Update/delete review
 * - Get review statistics
 */

import apiClient from './client';

/**
 * Reviews API Service
 */
export const reviewsAPI = {
  /**
   * Get reviews for a product
   * @param {string} productSlug - Product slug
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Sort field (recent, helpful, rating)
   * @param {number} params.rating - Filter by rating (1-5)
   * @returns {Promise<Object>} Product reviews with pagination
   */
  getProductReviews: async (productSlug, params = {}) => {
    try {
      const response = await apiClient.get(`/products/${productSlug}/reviews/`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          sort_by: params.sortBy || 'recent',
          rating: params.rating || '',
        },
      });
      return {
        success: true,
        data: response.data.data || response.data,
        totalCount: response.data.total_count || response.data.length,
        totalPages: response.data.total_pages || 1,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch reviews',
      };
    }
  },

  /**
   * Get review statistics for product
   * @param {string} productSlug - Product slug
   * @returns {Promise<Object>} Review stats (average rating, count per rating, etc.)
   */
  getReviewStats: async (productSlug) => {
    try {
      const response = await apiClient.get(`/products/${productSlug}/review_stats/`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch review stats',
      };
    }
  },

  /**
   * Submit a new review for a product
   * @param {string} productSlug - Product slug
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.title - Review title
   * @param {string} reviewData.comment - Review comment
   * @param {boolean} reviewData.verified - Purchase verification
   * @returns {Promise<Object>} Created review
   */
  submitReview: async (productSlug, reviewData) => {
    try {
      const response = await apiClient.post(`/products/${productSlug}/reviews/`, {
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        verified_purchase: reviewData.verified || false,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Review submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to submit review',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Update existing review
   * @param {string} productSlug - Product slug
   * @param {string|number} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   * @returns {Promise<Object>} Updated review
   */
  updateReview: async (productSlug, reviewId, reviewData) => {
    try {
      const response = await apiClient.put(
        `/products/${productSlug}/reviews/${reviewId}/`,
        {
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Review updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update review',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Delete review
   * @param {string} productSlug - Product slug
   * @param {string|number} reviewId - Review ID
   * @returns {Promise<Object>} Deletion status
   */
  deleteReview: async (productSlug, reviewId) => {
    try {
      await apiClient.delete(`/products/${productSlug}/reviews/${reviewId}/`);
      return {
        success: true,
        message: 'Review deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to delete review',
      };
    }
  },

  /**
   * Mark review as helpful/unhelpful
   * @param {string} productSlug - Product slug
   * @param {string|number} reviewId - Review ID
   * @param {boolean} isHelpful - Is helpful flag
   * @returns {Promise<Object>} Status
   */
  markAsHelpful: async (productSlug, reviewId, isHelpful = true) => {
    try {
      const response = await apiClient.post(
        `/products/${productSlug}/reviews/${reviewId}/helpful/`,
        { is_helpful: isHelpful }
      );
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to mark review',
      };
    }
  },

  /**
   * Report review (spam/inappropriate)
   * @param {string} productSlug - Product slug
   * @param {string|number} reviewId - Review ID
   * @param {string} reason - Report reason
   * @returns {Promise<Object>} Report status
   */
  reportReview: async (productSlug, reviewId, reason) => {
    try {
      const response = await apiClient.post(
        `/products/${productSlug}/reviews/${reviewId}/report/`,
        { reason }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Review reported successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to report review',
      };
    }
  },

  /**
   * Get user's reviews
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} User's reviews
   */
  getMyReviews: async (params = {}) => {
    try {
      const response = await apiClient.get('/reviews/my_reviews/', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
      });
      return {
        success: true,
        data: response.data.data || response.data,
        totalCount: response.data.total_count || response.data.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch your reviews',
      };
    }
  },

  /**
   * Get user's reviews for specific product
   * @param {string} productSlug - Product slug
   * @returns {Promise<Object>} User's review for this product
   */
  getMyReviewForProduct: async (productSlug) => {
    try {
      const response = await apiClient.get(
        `/products/${productSlug}/my_review/`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        hasReview: !!response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch your review',
        hasReview: false,
      };
    }
  },

  /**
   * Get verified purchase badge verification
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Verification status
   */
  verifyPurchase: async (productId) => {
    try {
      const response = await apiClient.get('/reviews/verify_purchase/', {
        params: { product_id: productId },
      });
      return {
        success: true,
        data: response.data.data || response.data,
        isPurchased: response.data.data?.purchased || false,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to verify purchase',
        isPurchased: false,
      };
    }
  },

  /**
   * Get trending reviews
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of reviews
   * @returns {Promise<Object>} Trending reviews
   */
  getTrendingReviews: async (params = {}) => {
    try {
      const response = await apiClient.get('/reviews/trending/', {
        params: { limit: params.limit || 10 },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch trending reviews',
      };
    }
  },

  /**
   * Get top-rated products
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of products
   * @returns {Promise<Object>} Top-rated products
   */
  getTopRatedProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/reviews/top_rated/', {
        params: { limit: params.limit || 10 },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch top-rated products',
      };
    }
  },

  /**
   * Request review reminder for purchased product
   * @param {string|number} productId - Product ID  
   * @returns {Promise<Object>} Request status
   */
  requestReviewReminder: async (productId) => {
    try {
      const response = await apiClient.post('/reviews/request_reminder/', {
        product_id: productId,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Review reminder reminder sent',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to send reminder',
      };
    }
  },
};

export default reviewsAPI;
