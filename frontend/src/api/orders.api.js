/**
 * Orders API Service
 * Handles all order-related API calls:
 * - Create orders
 * - Fetch user orders
 * - Get order details
 * - Update order status
 * - Cancel orders
 * - Track orders
 */

import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Orders API Service
 */
export const ordersAPI = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @param {array} orderData.items - Order items [{variantId, quantity, price}]
   * @param {string} orderData.shipping_address - Shipping address
   * @param {string} orderData.billing_address - Billing address
   * @param {string} orderData.payment_method - Payment method
   * @param {string} orderData.notes - Additional notes (optional)
   * @returns {Promise<Object>} Created order
   */
  create: async (orderData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.CREATE, orderData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Order created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to create order',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Get all orders for the current user
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status (pending, processing, completed, cancelled)
   * @param {string} params.sortBy - Sort field (created_at, total)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @returns {Promise<Object>} User's orders list
   */
  getMyOrders: async (params = {}) => {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.MY_ORDERS, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status || '',
          sort_by: params.sortBy || 'created_at',
          sort_order: params.sortOrder || 'desc',
        },
      });
      return {
        success: true,
        data: response.data.data || response.data,
        totalCount: response.data.total_count || response.data.length,
        totalPages: response.data.total_pages || 1,
        currentPage: response.data.current_page || 1,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch orders',
      };
    }
  },

  /**
   * Get all orders (Admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @param {string} params.userId - Filter by user
   * @returns {Promise<Object>} All orders list
   */
  list: async (params = {}) => {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.LIST, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status || '',
          user_id: params.userId || '',
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
        error: error.userMessage || 'Failed to fetch orders',
      };
    }
  },

  /**
   * Get order details
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Object>} Order details with items
   */
  getDetail: async (orderId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.DETAIL(orderId));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch order',
      };
    }
  },

  /**
   * Get order summary (before checkout)
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Object>} Order summary with totals
   */
  getSummary: async (orderId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.SUMMARY(orderId));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch order summary',
      };
    }
  },

  /**
   * Track order status and shipping
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Object>} Order tracking information
   */
  track: async (orderId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.TRACK(orderId));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to track order',
      };
    }
  },

  /**
   * Update order status (Admin only)
   * @param {string|number} orderId - Order ID
   * @param {string} status - New status (pending, processing, completed, cancelled)
   * @return {Promise<Object>} Updated order
   */
  updateStatus: async (orderId, status) => {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), {
        status,
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update order status',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Mark order as shipped (Admin only)
   * @param {string|number} orderId - Order ID
   * @param {Object} shipmentData - Tracking number, carrier, etc.
   * @returns {Promise<Object>} Updated order
   */
  markShipped: async (orderId, shipmentData = {}) => {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.MARK_SHIPPED(orderId), {
        tracking_number: shipmentData.trackingNumber,
        carrier: shipmentData.carrier,
        notes: shipmentData.notes,
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to mark order as shipped',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Cancel an order
   * @param {string|number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancelled order
   */
  cancel: async (orderId, reason = '') => {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.CANCEL(orderId), {
        reason,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to cancel order',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Submit feedback/review for an order
   * @param {string|number} orderId - Order ID
   * @param {Object} feedbackData - Feedback data
   * @param {number} feedbackData.rating - Rating (1-5)
   * @param {string} feedbackData.comment - Feedback comment
   * @returns {Promise<Object>} Submitted feedback
   */
  submitFeedback: async (orderId, feedbackData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.ORDERS.FEEDBACK(orderId), {
        rating: feedbackData.rating,
        comment: feedbackData.comment,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Thank you for your feedback!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to submit feedback',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Update an order (Admin only)
   * @param {string|number} orderId - Order ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated order
   */
  update: async (orderId, updateData) => {
    try {
      const response = await apiClient.put(
        ENDPOINTS.ORDERS.UPDATE(orderId),
        updateData
      );
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update order',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Delete an order (Admin only)
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Object>} Deletion status
   */
  delete: async (orderId) => {
    try {
      await apiClient.delete(ENDPOINTS.ORDERS.DELETE(orderId));
      return {
        success: true,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to delete order',
      };
    }
  },

  /**
   * Get order statistics (Admin only)
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period (day, week, month)
   * @returns {Promise<Object>} Order statistics
   */
  getStats: async (params = {}) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ORDERS.LIST}stats/`, {
        params: {
          period: params.period || 'month',
        },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch order statistics',
      };
    }
  },
};

export default ordersAPI;
