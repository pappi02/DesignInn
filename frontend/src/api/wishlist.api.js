/**
 * Wishlist API Service
 * Handles all wishlist/favorites-related API calls:
 * - Get user's wishlist
 * - Add/remove items from wishlist
 * - Share wishlist
 * - Get wishlist statistics
 */

import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Wishlist API Service
 */
export const wishlistAPI = {
  /**
   * Get user's wishlist
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Sort field (recent, price, rating)
   * @returns {Promise<Object>} User's wishlist items
   */
  getMyWishlist: async (params = {}) => {
    try {
      const response = await apiClient.get('/wishlists/me/', {
        params: {
          page: params.page || 1,
          limit: params.limit || 12,
          sort_by: params.sortBy || 'recent',
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
        error: error.userMessage || 'Failed to fetch wishlist',
      };
    }
  },

  /**
   * Add product to wishlist
   * @param {string|number} productId - Product ID
   * @returns {Promise<Object>} Added item
   */
  addToWishlist: async (productId) => {
    try {
      const response = await apiClient.post('/wishlists/add_item/', {
        product_id: productId,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Added to wishlist',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to add to wishlist',
      };
    }
  },

  /**
   * Remove product from wishlist
   * @param {string|number} productId - Product ID
   * @returns {Promise<Object>} Removal status
   */
  removeFromWishlist: async (productId) => {
    try {
      const response = await apiClient.post('/wishlists/remove_item/', {
        product_id: productId,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Removed from wishlist',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to remove from wishlist',
      };
    }
  },

  /**
   * Check if product is in wishlist
   * @param {string|number} productId - Product ID
   * @returns {Promise<Object>} Status
   */
  checkInWishlist: async (productId) => {
    try {
      const response = await apiClient.get('/wishlists/check/', {
        params: { product_id: productId },
      });
      return {
        success: true,
        data: response.data.data || response.data,
        inWishlist: response.data.data?.in_wishlist || false,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to check wishlist',
        inWishlist: false,
      };
    }
  },

  /**
   * Clear entire wishlist
   * @returns {Promise<Object>} Clear status
   */
  clearWishlist: async () => {
    try {
      const response = await apiClient.post('/wishlists/clear/');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Wishlist cleared',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to clear wishlist',
      };
    }
  },

  /**
   * Get wishlist statistics
   * @returns {Promise<Object>} Wishlist stats
   */
  getStats: async () => {
    try {
      const response = await apiClient.get('/wishlists/stats/');
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch wishlist stats',
      };
    }
  },

  /**
   * Share wishlist with others
   * @param {Object} shareData - Share settings
   * @param {boolean} shareData.isPublic - Make wishlist public
   * @param {string[]} shareData.emails - Emails to share with
   * @returns {Promise<Object>} Share details
   */
  shareWishlist: async (shareData) => {
    try {
      const response = await apiClient.post('/wishlists/share/', {
        is_public: shareData.isPublic || false,
        emails: shareData.emails || [],
      });
      return {
        success: true,
        data: response.data.data || response.data,
        shareLink: response.data.data?.share_link,
        message: 'Wishlist shared successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to share wishlist',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Get public wishlist by share link
   * @param {string} shareToken - Share token from link
   * @returns {Promise<Object>} Public wishlist
   */
  getSharedWishlist: async (shareToken) => {
    try {
      const response = await apiClient.get(`/wishlists/shared/${shareToken}/`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch shared wishlist',
      };
    }
  },

  /**
   * Add bulk items to wishlist
   * @param {number[]} productIds - Array of product IDs
   * @returns {Promise<Object>} Added items
   */
  addBulkToWishlist: async (productIds) => {
    try {
      const response = await apiClient.post('/wishlists/add_bulk/', {
        product_ids: productIds,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: `Added ${productIds.length} items to wishlist`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to add items to wishlist',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Move item from wishlist to cart
   * @param {string|number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Status
   */
  moveToCart: async (productId, quantity = 1) => {
    try {
      const response = await apiClient.post('/wishlists/move_to_cart/', {
        product_id: productId,
        quantity,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Moved to cart',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to move to cart',
      };
    }
  },

  /**
   * Get price drop notifications
   * @returns {Promise<Object>} Price drops
   */
  getPriceDrops: async () => {
    try {
      const response = await apiClient.get('/wishlists/price_drops/');
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch price drops',
      };
    }
  },

  /**
   * Toggle price drop notification for item
   * @param {string|number} productId - Product ID
   * @param {boolean} enabled - Enable/disable notification
   * @returns {Promise<Object>} Status
   */
  togglePriceNotification: async (productId, enabled = true) => {
    try {
      const response = await apiClient.post('wishlists/toggle_notification/', {
        product_id: productId,
        enabled,
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update notification',
      };
    }
  },
};

export default wishlistAPI;
