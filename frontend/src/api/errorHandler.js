/**
 * API Error Handler Utility
 * Centralized error handling for all API requests
 */

import { ERROR_MESSAGES } from './endpoints';

/**
 * Error type classifications
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  CONFLICT: 'CONFLICT_ERROR',
  SERVER: 'SERVER_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * APIError - Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, details = {}) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.details = details;
    this.status = details.status;
    this.validationErrors = details.validationErrors;
    this.retryAfter = details.retryAfter;
  }

  /**
   * Check if error is retryable
   */
  isRetryable() {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(this.status);
  }

  /**
   * Check if error is due to authentication
   */
  isAuthError() {
    return this.type === ERROR_TYPES.AUTHENTICATION;
  }

  /**
   * Check if error is due to validation
   */
  isValidationError() {
    return this.type === ERROR_TYPES.VALIDATION;
  }

  /**
   * Get user-friendly message
   */
  getUserMessage() {
    return this.message;
  }

  /**
   * Get all error details
   */
  getDetails() {
    return {
      message: this.message,
      type: this.type,
      status: this.status,
      validationErrors: this.validationErrors,
      details: this.details,
    };
  }
}

/**
 * Parse API error and create APIError instance
 * @param {Error} error - Original axios error
 * @returns {APIError} Parsed error
 */
export function parseAPIError(error) {
  if (error instanceof APIError) {
    return error;
  }

  // Network error (no response)
  if (!error.response && error.message === 'Network Error') {
    return new APIError(ERROR_MESSAGES.NETWORK_ERROR, ERROR_TYPES.NETWORK, { error });
  }

  // Timeout error
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return new APIError('Request timeout. Please try again.', ERROR_TYPES.TIMEOUT, {
      error,
      status: 408,
    });
  }

  const status = error.response?.status;
  const data = error.response?.data || {};
  const message = data.message || data.detail || error.message;
  const validationErrors = data.errors || data.validation_errors || data.field_errors;

  let type = ERROR_TYPES.UNKNOWN;
  let userMessage = ERROR_MESSAGES.UNKNOWN_ERROR;

  // Determine error type and message based on status code
  switch (status) {
    case 400:
      type = ERROR_TYPES.VALIDATION;
      userMessage = message || ERROR_MESSAGES.VALIDATION_ERROR;
      break;

    case 401:
      type = ERROR_TYPES.AUTHENTICATION;
      userMessage = ERROR_MESSAGES.UNAUTHORIZED;
      break;

    case 403:
      type = ERROR_TYPES.AUTHORIZATION;
      userMessage = ERROR_MESSAGES.FORBIDDEN;
      break;

    case 404:
      type = ERROR_TYPES.NOT_FOUND;
      userMessage = ERROR_MESSAGES.NOT_FOUND;
      break;

    case 409:
      type = ERROR_TYPES.CONFLICT;
      userMessage = message || 'Resource conflict. Please try again.';
      break;

    case 429:
      type = ERROR_TYPES.RATE_LIMIT;
      userMessage = 'Too many requests. Please try again later.';
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      type = ERROR_TYPES.SERVER;
      userMessage = ERROR_MESSAGES.SERVER_ERROR;
      break;

    default:
      if (!error.response) {
        type = ERROR_TYPES.NETWORK;
        userMessage = ERROR_MESSAGES.NETWORK_ERROR;
      }
  }

  return new APIError(userMessage, type, {
    status,
    validationErrors,
    retryAfter: error.response?.headers['retry-after'],
    originalError: error,
  });
}

/**
 * Handle API error with logging and optional callback
 * @param {Error} error - Axios error
 * @param {Function} onError - Optional error callback
 * @returns {APIError} Parsed error
 */
export function handleAPIError(error, onError = null) {
  const apiError = parseAPIError(error);

  // Log error
  console.error('[API Error Handler]', apiError.getDetails());

  // Handle authentication errors
  if (apiError.isAuthError()) {
    // Dispatch custom event for auth handling
    window.dispatchEvent(new CustomEvent('auth:error', { detail: apiError }));
  }

  // Call optional callback
  if (onError && typeof onError === 'function') {
    onError(apiError);
  }

  return apiError;
}

/**
 * Extract validation error messages for form display
 * @param {APIError} error - API error
 * @returns {Object} Error messages keyed by field
 */
export function extractValidationErrors(error) {
  if (!error.validationErrors) {
    return null;
  }

  const errors = {};

  if (typeof error.validationErrors === 'object') {
    Object.entries(error.validationErrors).forEach(([field, messages]) => {
      // Handle both array and string error formats
      errors[field] = Array.isArray(messages) ? messages[0] : messages;
    });
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Safe API call wrapper with error handling
 * @param {Function} apiCall - API call function
 * @param {Object} options - Options
 * @param {boolean} options.showToast - Show toast notification (default: true)
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @returns {Promise<Object>} Result with success/error
 */
export async function safeAPICall(apiCall, options = {}) {
  const { showToast = true, onSuccess = null, onError = null } = options;

  try {
    const result = await apiCall();

    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess(result);
    }

    return {
      success: true,
      data: result.data || result,
    };
  } catch (error) {
    const apiError = handleAPIError(error, onError);

    // Show toast notification if requested
    if (showToast) {
      // This will integrate with react-toastify in components
      return {
        success: false,
        error: apiError,
        message: apiError.getUserMessage(),
      };
    }

    return {
      success: false,
      error: apiError,
    };
  }
}

/**
 * Retry API call with exponential backoff
 * @param {Function} apiCall - API call function
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} delay - Initial delay in ms (default: 1000)
 * @returns {Promise<Object>} Result from API call
 */
export async function retryAPICall(apiCall, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      const apiError = parseAPIError(error);
      if (!apiError.isRetryable() || attempt === maxRetries) {
        throw apiError;
      }

      // Exponential backoff: delay * 2^attempt
      const backoffDelay = delay * Math.pow(2, attempt);
      console.warn(
        `[API] Retrying request (${attempt + 1}/${maxRetries}) after ${backoffDelay}ms`,
        { error: apiError.message }
      );

      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError;
}

/**
 * Batch multiple API calls with error handling
 * @param {Array<Function>} apiCalls - Array of API call functions
 * @param {Object} options - Options
 * @param {boolean} options.stopOnError - Stop on first error (default: false)
 * @returns {Promise<Array>} Results for each call
 */
export async function batchAPICall(apiCalls, options = {}) {
  const { stopOnError = false } = options;
  const results = [];

  for (const apiCall of apiCalls) {
    try {
      const result = await apiCall();
      results.push({
        success: true,
        data: result,
      });
    } catch (error) {
      const apiError = parseAPIError(error);

      if (stopOnError) {
        throw apiError;
      }

      results.push({
        success: false,
        error: apiError,
      });
    }
  }

  return results;
}

/**
 * Test API connectivity
 * @returns {Promise<boolean>} True if API is reachable
 */
export async function testAPIConnection() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/health/`,
      { method: 'HEAD', timeout: 5000 }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export default {
  ERROR_TYPES,
  APIError,
  parseAPIError,
  handleAPIError,
  extractValidationErrors,
  safeAPICall,
  retryAPICall,
  batchAPICall,
  testAPIConnection,
};
