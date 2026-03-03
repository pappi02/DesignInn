/**
 * Analytics API Service
 * Handles all analytics and reporting data
 */

import apiClient from './client'
import { ENDPOINTS } from './endpoints'

/**
 * Analytics API - Real-time metrics, trends, and reports
 */
export const analyticsAPI = {
  /**
   * Get dashboard metrics (KPIs)
   * @param {Object} params - Query parameters
   * @returns {Promise} Metrics data
   */
  async getMetrics(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.METRICS, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching metrics:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch metrics',
      }
    }
  },

  /**
   * Get revenue trends (last 30 days)
   * @param {Object} params - Query parameters (startDate, endDate, interval)
   * @returns {Promise} Revenue data
   */
  async getRevenueTrends(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.REVENUE_TRENDS, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue trends:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch revenue trends',
      }
    }
  },

  /**
   * Get order analytics
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise} Order analytics data
   */
  async getOrderAnalytics(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.ORDER_ANALYTICS, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching order analytics:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order analytics',
      }
    }
  },

  /**
   * Get user analytics
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise} User analytics data
   */
  async getUserAnalytics(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.USER_ANALYTICS, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user analytics',
      }
    }
  },

  /**
   * Get product performance
   * @param {Object} params - Query parameters (limit, sortBy)
   * @returns {Promise} Product performance data
   */
  async getProductPerformance(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.PRODUCT_PERFORMANCE, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching product performance:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product performance',
      }
    }
  },

  /**
   * Get customer segments
   * @returns {Promise} Customer segment data
   */
  async getCustomerSegments() {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.CUSTOMER_SEGMENTS)
      return response.data
    } catch (error) {
      console.error('Error fetching customer segments:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch customer segments',
      }
    }
  },

  /**
   * Export analytics data
   * @param {string} format - Export format (csv, pdf, json)
   * @param {Object} params - Query parameters (startDate, endDate, type)
   * @returns {Promise} Download URL or file
   */
  async exportData(format, params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.EXPORT, {
        params: { format, ...params },
        responseType: format === 'pdf' ? 'blob' : 'json',
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export data',
      }
    }
  },

  /**
   * Get conversion funnels
   * @param {Object} params - Query parameters
   * @returns {Promise} Funnel data
   */
  async getConversionFunnel(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.CONVERSION_FUNNEL, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching conversion funnel:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch conversion funnel',
      }
    }
  },

  /**
   * Get top selling products
   * @param {Object} params - Query parameters (limit, period)
   * @returns {Promise} Top product data
   */
  async getTopProducts(params = { limit: 10, period: '30' }) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.TOP_PRODUCTS, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching top products:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch top products',
      }
    }
  },

  /**
   * Get traffic sources
   * @param {Object} params - Query parameters
   * @returns {Promise} Traffic data
   */
  async getTrafficSources(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.TRAFFIC_SOURCES, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching traffic sources:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch traffic sources',
      }
    }
  },

  /**
   * Get custom report
   * @param {string} reportType - Report type
   * @param {Object} params - Query parameters
   * @returns {Promise} Report data
   */
  async getCustomReport(reportType, params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.CUSTOM_REPORT(reportType), { params })
      return response.data
    } catch (error) {
      console.error(`Error fetching ${reportType} report:`, error)
      return {
        success: false,
        error: error.response?.data?.message || `Failed to fetch ${reportType} report`,
      }
    }
  },
}

export default analyticsAPI
