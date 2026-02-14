/**
 * Formatter Utilities
 * Data formatting and display functions
 */

import { CURRENCY } from './constants';

// Format price
export const formatPrice = (price, currencySymbol = CURRENCY.SYMBOL) => {
  if (typeof price !== 'number') {
    return `${currencySymbol}0.00`;
  }
  return `${currencySymbol}${price.toFixed(CURRENCY.DECIMAL_PLACES)}`;
};

// Format price range
export const formatPriceRange = (minPrice, maxPrice, currencySymbol = CURRENCY.SYMBOL) => {
  return `${formatPrice(minPrice, currencySymbol)} - ${formatPrice(maxPrice, currencySymbol)}`;
};

// Parse price (removes currency symbol and converts to number)
export const parsePrice = (priceString) => {
  const numericString = priceString.replace(/[^\d.-]/g, '');
  return parseFloat(numericString) || 0;
};

// Format date
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj)) return '';

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  };

  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

// Format date and time
export const formatDateTime = (date) => {
  return formatDate(date, 'datetime');
};

// Format time
export const formatTime = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
};

// Format number with commas
export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return number.toLocaleString('en-US');
};

// Format percentage
export const formatPercentage = (decimal, decimals = 1) => {
  return `${(decimal * 100).toFixed(decimals)}%`;
};

// Format discount
export const formatDiscount = (originalPrice, discountedPrice) => {
  const discountAmount = originalPrice - discountedPrice;
  const discountPercent = (discountAmount / originalPrice) * 100;
  return {
    amount: formatPrice(discountAmount),
    percent: formatPercentage(discountPercent / 100, 0),
  };
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Capitalize all words
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
};

// Format status as badge text
export const formatStatus = (status) => {
  return status
    .split('_')
    .map(capitalize)
    .join(' ');
};

// Truncate text
export const truncate = (text, length = 100, suffix = '...') => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Format address
export const formatAddress = (address) => {
  if (!address) return '';

  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip_code,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};

// Format initials from name
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`.substring(0, 2);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Format bytes to human readable
export const formatBytes = formatFileSize;

// Format order number
export const formatOrderNumber = (id) => {
  return `#${String(id).padStart(8, '0')}`;
};

// Format quote number
export const formatQuoteNumber = (id) => {
  return `QT-${String(id).padStart(6, '0')}`;
};

// Format currency with code
export const formatCurrencyWithCode = (price, code = CURRENCY.CODE) => {
  return `${formatPrice(price)} ${code}`;
};

// Slugify string (for URLs)
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Format search query (add wildcards for partial matching)
export const formatSearchQuery = (query) => {
  if (!query) return '';
  return query.trim().toLowerCase();
};

// Format percentage discount
export const formatDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

export default {
  formatPrice,
  formatPriceRange,
  parsePrice,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatNumber,
  formatPercentage,
  formatDiscount,
  capitalize,
  capitalizeWords,
  formatStatus,
  truncate,
  formatPhoneNumber,
  formatAddress,
  getInitials,
  formatFileSize,
  formatBytes,
  formatOrderNumber,
  formatQuoteNumber,
  formatCurrencyWithCode,
  slugify,
  formatSearchQuery,
  formatDiscountPercentage,
};
