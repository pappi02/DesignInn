/**
 * API Utilities
 * API and HTTP helper functions
 */

import { HTTP_STATUS, ERROR_MESSAGES_MAP } from './constants';

// Check if response status indicates success
export const isSuccessStatus = (status) => {
  return status >= 200 && status < 300;
};

// Check if response status indicates error
export const isErrorStatus = (status) => {
  return status >= 400 && status < 600;
};

// Check if status is client error (4xx)
export const isClientError = (status) => {
  return status >= 400 && status < 500;
};

// Check if status is server error (5xx)
export const isServerError = (status) => {
  return status >= 500 && status < 600;
};

// Get human readable error message
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // If it's an object with message property
  if (error.message) {
    return error.message;
  }

  // If it's a string
  if (typeof error === 'string') {
    return error;
  }

  // Check mapped error messages
  for (const [key, message] of Object.entries(ERROR_MESSAGES_MAP)) {
    if (error.message?.includes(key)) {
      return message;
    }
  }

  return 'An error occurred. Please try again.';
};

// Handle API error
export const handleApiError = (error) => {
  const response = {
    status: null,
    message: 'An error occurred',
    details: null,
  };

  if (error.response) {
    // Server responded with error
    response.status = error.response.status;
    response.message = error.response.data?.message || error.response.statusText;
    response.details = error.response.data;
  } else if (error.request) {
    // Request made but no response
    response.status = 0;
    response.message = 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    response.message = error.message || 'An error occurred';
  }

  return response;
};

// Build query string
export const buildQueryString = (params) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }

  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
};

// Build URL with params
export const buildUrl = (baseUrl, params) => {
  const queryString = buildQueryString(params);
  return `${baseUrl}${queryString}`;
};

// Parse URL query params
export const parseQueryParams = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};

  for (const [key, value] of params) {
    result[key] = value;
  }

  return result;
};

// Check if URL is valid
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Get API error details
export const getApiErrorDetails = (error) => {
  if (!error || !error.response) {
    return null;
  }

  const { status, data } = error.response;

  return {
    status,
    message: data?.message || 'An error occurred',
    errors: data?.errors || {},
    detail: data?.detail || '',
  };
};

// Format API response
export const formatApiResponse = (response) => {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

// Check if response has pagination
export const hasPagination = (response) => {
  return response && (response.has_next || response.has_previous || response.total_count !== undefined);
};

// Get pagination info
export const getPaginationInfo = (response) => {
  return {
    currentPage: response?.page || 1,
    pageSize: response?.page_size,
    totalCount: response?.total_count || 0,
    totalPages: response?.total_pages || 1,
    hasNext: response?.has_next || false,
    hasPrevious: response?.has_previous || false,
  };
};

// Retry request with exponential backoff
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors or last attempt
      if (isClientError(error.response?.status) || i === maxRetries - 1) {
        break;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw lastError;
};

// Transform API error for UI
export const transformApiError = (error) => {
  const details = getApiErrorDetails(error);

  if (!details) {
    return {
      message: 'Network error. Please check your connection.',
      statusCode: 0,
    };
  }

  const { status, message, errors } = details;

  return {
    message,
    statusCode: status,
    fieldErrors: errors,
  };
};

// Check if error is due to network issues
export const isNetworkError = (error) => {
  return !error.response && error.message && error.message.includes('Network');
};

// Check if error is due to timeout
export const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
};

export default {
  isSuccessStatus,
  isErrorStatus,
  isClientError,
  isServerError,
  getErrorMessage,
  handleApiError,
  buildQueryString,
  buildUrl,
  parseQueryParams,
  isValidUrl,
  getApiErrorDetails,
  formatApiResponse,
  hasPagination,
  getPaginationInfo,
  retryRequest,
  transformApiError,
  isNetworkError,
  isTimeoutError,
};
