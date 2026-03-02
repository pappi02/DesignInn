/**
 * Users API Service (Admin)
 * Handles all user management API calls:
 * - List users with filtering and pagination
 * - Get user details
 * - Update user information
 * - Update user role
 * - Update user status (active/inactive)
 * - Delete user
 * - Get user statistics
 */

import apiClient from './client'
import { ENDPOINTS } from './endpoints'

/**
 * Users API Service
 */
export const usersAPI = {
  /**
   * Get list of all users with filtering and pagination (Admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (1-based)
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search by name or email
   * @param {string} params.role - Filter by role (customer, designer, admin)
   * @param {string} params.status - Filter by status (active, inactive)
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @returns {Promise<Object>} Users list with pagination metadata
   */
  list: async (params = {}) => {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.LIST, {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          search: params.search || '',
          role: params.role || '',
          status: params.status || '',
          sort_by: params.sortBy || 'joined_date',
          sort_order: params.sortOrder || 'desc',
        },
      })
      return {
        success: true,
        data: response.data.data || response.data,
        totalCount: response.data.total_count || response.data.length,
        totalPages: response.data.total_pages || 1,
        currentPage: params.page || 1,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch users',
        data: [],
      }
    }
  },

  /**
   * Get single user details (Admin only)
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} User details
   */
  getDetail: async (userId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.DETAIL(userId))
      return {
        success: true,
        data: response.data.data || response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch user details',
      }
    }
  },

  /**
   * Update user information (Admin only)
   * @param {string|number} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user
   */
  update: async (userId, userData) => {
    try {
      const response = await apiClient.put(ENDPOINTS.USERS.UPDATE(userId), userData)
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'User updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update user',
        validationErrors: error.validationErrors,
      }
    }
  },

  /**
   * Update user role (Admin only)
   * @param {string|number} userId - User ID
   * @param {string} role - New role (customer, designer, admin)
   * @returns {Promise<Object>} Updated user
   */
  updateRole: async (userId, role) => {
    try {
      const response = await apiClient.patch(ENDPOINTS.USERS.UPDATE_ROLE(userId), {
        role,
      })
      return {
        success: true,
        data: response.data.data || response.data,
        message: `User role updated to ${role}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update user role',
      }
    }
  },

  /**
   * Update user status (Admin only)
   * @param {string|number} userId - User ID
   * @param {boolean} active - Active status
   * @returns {Promise<Object>} Updated user
   */
  updateStatus: async (userId, active) => {
    try {
      const response = await apiClient.patch(ENDPOINTS.USERS.UPDATE_STATUS(userId), {
        is_active: active,
      })
      return {
        success: true,
        data: response.data.data || response.data,
        message: `User account ${active ? 'activated' : 'deactivated'}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update user status',
      }
    }
  },

  /**
   * Delete user (Admin only)
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} Success status
   */
  delete: async (userId) => {
    try {
      await apiClient.delete(ENDPOINTS.USERS.DELETE(userId))
      return {
        success: true,
        message: 'User deleted successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to delete user',
      }
    }
  },

  /**
   * Get user statistics (Admin only)
   * @returns {Promise<Object>} User statistics
   */
  getStats: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.STATS)
      return {
        success: true,
        data: response.data.data || response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch user statistics',
      }
    }
  },
}

export default usersAPI
