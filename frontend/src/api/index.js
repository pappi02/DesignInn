/**
 * API Services Index
 * Centralized export of all API services and utilities
 * 
 * Usage:
 * import { productsAPI, ordersAPI, authAPI } from '@/api'
 * const products = await productsAPI.list()
 */

// Client configuration and interceptors
export { default as apiClient, loadingState, API_CONFIG, logger } from './client';


// Authentication API
export { authAPI } from './auth.api';

// Products API
export { productsAPI, default as productsAPIDefault } from './products.api';

// Orders API
export { ordersAPI, default as ordersAPIDefault } from './orders.api';

// Users API (Admin)
export { usersAPI, default as usersAPIDefault } from './users.api';

// Settings API (Admin)
export { settingsAPI, default as settingsAPIDefault } from './settings.api';

// Analytics API (Admin)
export { analyticsAPI, default as analyticsAPIDefault } from './analytics.api';

// Wishlist API
export { wishlistAPI, default as wishlistAPIDefault } from './wishlist.api';

// Reviews API
export { reviewsAPI, default as reviewsAPIDefault } from './reviews.api';

// Endpoints configuration
export { ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from './endpoints';

// Error handling utilities
export {
  APIError,
  ERROR_TYPES,
  parseAPIError,
  handleAPIError,
  extractValidationErrors,
  safeAPICall,
  retryAPICall,
  batchAPICall,
  testAPIConnection,
} from './errorHandler';

/**
 * Convenience namespace for all API services
 * Usage: API.products.list(), API.orders.create(), etc.
 */
export const API = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  users: usersAPI,
  settings: settingsAPI,
  wishlist: wishlistAPI,
  reviews: reviewsAPI,
};
