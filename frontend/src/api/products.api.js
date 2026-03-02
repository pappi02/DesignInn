/**
 * Products API Service
 * Handles all product-related API calls:
 * - List products with filtering, searching, pagination
 * - Get product details
 * - Featured/bestseller products
 * - Related products
 * - Category management
 */

import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Products API Service
 */
export const productsAPI = {
  /**
   * Get list of all products with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (1-based)
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.category - Category filter
   * @param {string} params.minPrice - Minimum price filter
   * @param {string} params.maxPrice - Maximum price filter
   * @param {string} params.sortBy - Sort field (name, price, created_at)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @param {boolean} params.featured - Filter featured products
   * @returns {Promise<Object>} Products list with pagination metadata
   */
  list: async (params = {}) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
        params: {
          page: params.page || 1,
          limit: params.limit || 12,
          search: params.search || '',
          category: params.category || '',
          min_price: params.minPrice || '',
          max_price: params.maxPrice || '',
          sort_by: params.sortBy || 'created_at',
          sort_order: params.sortOrder || 'desc',
          featured: params.featured || false,
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
        error: error.userMessage || 'Failed to fetch products',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Get product details including variants and reviews
   * @param {string} slug - Product slug
   * @returns {Promise<Object>} Product details
   */
  getDetail: async (slug) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.DETAIL(slug));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch product',
      };
    }
  },

  /**
   * Get featured products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} Featured products list
   */
  getFeatured: async (limit = 8) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.FEATURED, {
        params: { limit },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch featured products',
      };
    }
  },

  /**
   * Get newest products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} Newest products list
   */
  getNewest: async (limit = 8) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.NEWEST, {
        params: { limit },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch newest products',
      };
    }
  },

  /**
   * Get bestseller products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} Bestseller products list
   */
  getBestsellers: async (limit = 8) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.BESTSELLERS, {
        params: { limit },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch bestseller products',
      };
    }
  },

  /**
   * Get related products for a given product
   * @param {string} slug - Product slug
   * @param {number} limit - Number of related products
   * @returns {Promise<Object>} Related products list
   */
  getRelated: async (slug, limit = 5) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.RELATED(slug), {
        params: { limit },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch related products',
      };
    }
  },

  /**
   * Get all product categories
   * @returns {Promise<Object>} Categories list
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.CATEGORIES);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch categories',
      };
    }
  },

  /**
   * Get category details
   * @param {string|number} id - Category ID
   * @returns {Promise<Object>} Category details
   */
  getCategoryDetail: async (id) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.CATEGORY_DETAIL(id));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch category',
      };
    }
  },

  /**
   * Search products with advanced filtering
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search query
   * @param {string[]} searchParams.categories - Category filters
   * @param {number} searchParams.minPrice - Minimum price
   * @param {number} searchParams.maxPrice - Maximum price
   * @param {string} searchParams.sortBy - Sort field
   * @param {number} searchParams.page - Page number
   * @returns {Promise<Object>} Search results
   */
  search: async (searchParams) => {
    return productsAPI.list({
      search: searchParams.query,
      category: searchParams.categories?.[0],
      minPrice: searchParams.minPrice,
      maxPrice: searchParams.maxPrice,
      sortBy: searchParams.sortBy,
      page: searchParams.page,
    });
  },

  /**
   * Get product variants
   * @param {string} slug - Product slug
   * @returns {Promise<Object>} Product variants
   */
  getVariants: async (slug) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.VARIANTS, {
        params: { product_slug: slug },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch variants',
      };
    }
  },

  /**
   * Get product images
   * @param {string} slug - Product slug
   * @returns {Promise<Object>} Product images
   */
  getImages: async (slug) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.IMAGES, {
        params: { product_slug: slug },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to fetch images',
      };
    }
  },

  /**
   * Create a new product (Admin only)
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  create: async (productData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, productData);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to create product',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Update an existing product (Admin only)
   * @param {string} slug - Product slug
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  update: async (slug, productData) => {
    try {
      const response = await apiClient.put(
        ENDPOINTS.PRODUCTS.UPDATE(slug),
        productData
      );
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to update product',
        details: error.validationErrors,
      };
    }
  },

  /**
   * Delete a product (Admin only)
   * @param {string} slug - Product slug
   * @returns {Promise<Object>} Deletion status
   */
  delete: async (slug) => {
    try {
      await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(slug));
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to delete product',
      };
    }
  },

  /**
   * Toggle featured status of a product (Admin only)
   * @param {string} slug - Product slug
   * @returns {Promise<Object>} Updated status
   */
  toggleFeatured: async (slug) => {
    try {
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.TOGGLE_FEATURED(slug));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to toggle featured status',
      };
    }
  },

  /**
   * Toggle product status (Active/Inactive) (Admin only)
   * @param {string} slug - Product slug
   * @returns {Promise<Object>} Updated status
   */
  toggleStatus: async (slug) => {
    try {
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.TOGGLE_STATUS(slug));
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Failed to toggle product status',
      };
    }
  },
};

export default productsAPI;
