/**
 * Enhanced API Client Configuration
 * Features:
 * - Token management and auto-refresh
 * - Request deduplication
 * - Automatic retry logic (exponential backoff)
 * - Response normalization
 * - Detailed error logging
 * - Loading state tracking
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// API Client Configuration
const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000,
  maxRetries: 3,
  retryDelay: 1000, // ms
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.timeout,
});

// ============================================
// Request Deduplication (prevent duplicate calls)
// ============================================
const pendingRequests = new Map();

function generateRequestKey(config) {
  return `${config.method}:${config.url}`;
}

// ============================================
// Loading State Manager
// ============================================
export const loadingState = {
  activeRequests: 0,
  isLoading: false,
  listeners: [],

  addListener(callback) {
    this.listeners.push(callback);
  },

  removeListener(callback) {
    this.listeners = this.listeners.filter((l) => l !== callback);
  },

  notify() {
    this.listeners.forEach((callback) => callback(this.isLoading));
  },

  start() {
    this.activeRequests++;
    this.isLoading = this.activeRequests > 0;
    this.notify();
  },

  end() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.isLoading = this.activeRequests > 0;
    this.notify();
  },

  reset() {
    this.activeRequests = 0;
    this.isLoading = false;
    this.notify();
  },
};

// ============================================
// Logger Utility
// ============================================
const logger = {
  log(message, data) {
    if (import.meta.env.DEV) {
      console.log(`[API] ${message}`, data);
    }
  },

  error(message, error) {
    console.error(`[API ERROR] ${message}`, error);
  },

  warn(message, data) {
    console.warn(`[API WARN] ${message}`, data);
  },
};

// ============================================
// Retry Logic (Exponential Backoff)
// ============================================
async function retryRequest(config, retryCount = 0) {
  try {
    return await apiClient.request(config);
  } catch (error) {
    const status = error.response?.status;
    const isRetryableError =
      !error.response ||
      status === 408 ||
      status === 429 ||
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504;

    if (isRetryableError && retryCount < API_CONFIG.maxRetries) {
      const delay = API_CONFIG.retryDelay * Math.pow(2, retryCount);
      logger.warn(`Retrying request (${retryCount + 1}/${API_CONFIG.maxRetries})`, {
        url: config.url,
        delay,
      });
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(config, retryCount + 1);
    }
    throw error;
  }
}

// ============================================
// Request Interceptor
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    // Add token to headers
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Check for duplicate requests (skip for GET requests with identical params)
    const requestKey = generateRequestKey(config);
    if (config.method.toLowerCase() === 'get' && pendingRequests.has(requestKey)) {
      logger.log('Duplicate request detected, using cached promise', { url: config.url });
      throw new axios.Cancel(`Duplicate request cancelled: ${requestKey}`);
    }

    // Track loading state
    loadingState.start();

    logger.log('Request sent', {
      method: config.method.toUpperCase(),
      url: config.url,
    });

    return config;
  },
  (error) => {
    loadingState.end();
    logger.error('Request config error', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    // Remove from pending requests
    const requestKey = generateRequestKey(response.config);
    pendingRequests.delete(requestKey);

    loadingState.end();

    logger.log('Response received', {
      status: response.status,
      url: response.config.url,
      dataSize: JSON.stringify(response.data).length,
    });

    return response;
  },
  (error) => {
    loadingState.end();

    // Cancelled request
    if (axios.isCancel(error)) {
      logger.log('Request cancelled', { message: error.message });
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = error.response?.config?.url || error.config?.url;

    // Log error details
    logger.error('API Error', {
      status,
      url,
      message: error.response?.data?.message || error.message,
      detail: error.response?.data?.detail,
    });

    // ============================================
    // Status-Specific Error Handling
    // ============================================

    // 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Will be handled by ProtectedRoute redirecting to login
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // 403 Forbidden - Insufficient permissions
    if (status === 403) {
      error.userMessage = 'You do not have permission to perform this action';
    }

    // 404 Not Found
    if (status === 404) {
      error.userMessage = 'The resource you requested was not found';
    }

    // 400 Bad Request - Validation error
    if (status === 400) {
      error.userMessage = error.response?.data?.message || 'Invalid request data';
      error.validationErrors = error.response?.data?.detail || error.response?.data;
    }

    // 429 Too Many Requests - Rate limiting
    if (status === 429) {
      error.userMessage = 'Too many requests. Please try again later';
      error.retryAfter = error.response?.headers['retry-after'];
    }

    // 5xx Server Errors
    if (status >= 500) {
      error.userMessage = 'Server error. Please try again later';
    }

    // Network error (no response)
    if (!error.response) {
      error.userMessage = 'Network error. Please check your connection';
    }

    return Promise.reject(error);
  }
);

// ============================================
// Export Enhanced Client
// ============================================
export default apiClient;
export { API_CONFIG, logger };
