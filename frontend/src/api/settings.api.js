/**
 * Settings API Service (Admin)
 * Handles all settings management API calls:
 * - Get system settings
 * - Update system settings
 * - Email template management
 * - API key management
 * - System statistics
 */

import apiClient from './client'
import { ENDPOINTS } from './endpoints'

/**
 * Settings API Service
 */
export const settingsAPI = {
  /**
   * Get system settings (Admin only)
   * @returns {Promise<Object>} System settings
   */
  get: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.SETTINGS.GET)
      return {
        success: true,
        data: response.data.data || response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch settings',
      }
    }
  },

  /**
   * Update system settings (Admin only)
   * @param {Object} settings - Settings to update
   * @returns {Promise<Object>} Updated settings
   */
  update: async (settings) => {
    try {
      const response = await apiClient.put(ENDPOINTS.SETTINGS.UPDATE, settings)
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Settings updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update settings',
        validationErrors: error.validationErrors,
      }
    }
  },

  // Email Templates

  /**
   * Get all email templates (Admin only)
   * @returns {Promise<Object>} Email templates list
   */
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.SETTINGS.EMAIL_TEMPLATES)
      return {
        success: true,
        data: response.data.data || response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch email templates',
        data: [],
      }
    }
  },

  /**
   * Get single email template (Admin only)
   * @param {string|number} templateId - Template ID
   * @returns {Promise<Object>} Email template details
   */
  getEmailTemplate: async (templateId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.SETTINGS.EMAIL_TEMPLATE_DETAIL(templateId))
      return {
        success: true,
        data: response.data.data || response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch email template',
      }
    }
  },

  /**
   * Update email template (Admin only)
   * @param {string|number} templateId - Template ID
   * @param {Object} template - Template data to update
   * @returns {Promise<Object>} Updated template
   */
  updateEmailTemplate: async (templateId, template) => {
    try {
      const response = await apiClient.put(
        ENDPOINTS.SETTINGS.UPDATE_TEMPLATE(templateId),
        template
      )
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Email template updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update email template',
        validationErrors: error.validationErrors,
      }
    }
  },

  // API Keys

  /**
   * Get all API keys (Admin only)
   * @returns {Promise<Object>} API keys list
   */
  getAPIKeys: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.SETTINGS.API_KEYS)
      return {
        success: true,
        data: response.data.data || response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch API keys',
        data: [],
      }
    }
  },

  /**
   * Generate new API key (Admin only)
   * @param {Object} data - API key data
   * @param {string} data.name - Key name
   * @returns {Promise<Object>} Generated API key
   */
  generateAPIKey: async (data) => {
    try {
      const response = await apiClient.post(ENDPOINTS.SETTINGS.GENERATE_API_KEY, data)
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'API key generated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to generate API key',
      }
    }
  },

  /**
   * Delete API key (Admin only)
   * @param {string|number} keyId - API key ID
   * @returns {Promise<Object>} Success status
   */
  deleteAPIKey: async (keyId) => {
    try {
      await apiClient.delete(ENDPOINTS.SETTINGS.DELETE_API_KEY(keyId))
      return {
        success: true,
        message: 'API key deleted successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to delete API key',
      }
    }
  },

  // System Statistics

  /**
   * Get system statistics (Admin only)
   * @returns {Promise<Object>} System statistics
   */
  getSystemStats: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.SETTINGS.SYSTEM_STATS)
      return {
        success: true,
        data: response.data.data || response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch system statistics',
      }
    }
  },
}

export default settingsAPI
