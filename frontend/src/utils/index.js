/**
 * Utils Index
 * Export all utility functions for easy importing
 */

export * from './constants';
export * from './validators';
export * from './formatters';
export * from './storage';
export * from './api';

// Re-export commonly used functions
export {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
} from './validators';

export {
  formatPrice,
  formatDate,
  formatDateTime,
  formatNumber,
  getInitials,
} from './formatters';

export {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getFromStorage,
  setToStorage,
} from './storage';

export {
  isSuccessStatus,
  isErrorStatus,
  getErrorMessage,
  handleApiError,
} from './api';
