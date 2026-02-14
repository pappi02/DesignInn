/**
 * Application Constants
 * Centralized constants used throughout the app
 */

// User types
export const USER_TYPES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin',
};

// Product statuses
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
};

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

// Quote statuses
export const QUOTE_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  QUOTED: 'quoted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Service types
export const SERVICE_TYPES = {
  CUSTOM_DESIGN: 'custom_design',
  CONSULTATION: 'consultation',
  BRANDING: 'branding',
  RENOVATION: 'renovation',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_LIMIT: 20,
};

// Date formats
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
};

// Currency
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  DECIMAL_PLACES: 2,
};

// API pagination
export const API_PAGINATION = {
  MIN_PAGE: 1,
  MAX_PAGE_SIZE: 100,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART: 'cart_store',
  USER_STORE: 'user_store',
  AUTH_STORE: 'auth_store',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Session timeout (in milliseconds)
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// API endpoints base
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/checkout/confirmation/:id',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  ORDERS: '/dashboard/orders',
  ORDER_DETAIL: '/dashboard/orders/:id',
  ADDRESSES: '/dashboard/addresses',
  FAVORITES: '/dashboard/favorites',
  QUOTES: '/dashboard/quotes',
  QUOTE_DETAIL: '/dashboard/quotes/:id',
  SERVICES: '/services',
  SERVICE_DETAIL: '/services/:id',
  PORTFOLIO: '/portfolio',
  PORTFOLIO_ITEM: '/portfolio/:id',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_QUOTES: '/admin/quotes',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// toast notification types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Modal types
export const MODAL_TYPES = {
  CONFIRM: 'confirm',
  ALERT: 'alert',
  FORM: 'form',
  INFO: 'info',
};

// Default values for products
export const PRODUCT_DEFAULTS = {
  MIN_PRICE: 0,
  MAX_PRICE: 10000,
  DEFAULT_PAGE_SIZE: 12,
};

// Discount types
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
};

// Error messages mapping
export const ERROR_MESSAGES_MAP = {
  'Network Error': 'Network connection failed. Please check your internet connection.',
  'timeout of': 'Request timeout. Please try again.',
  'Request failed': 'Request failed. Please try again.',
};

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
};

export default {
  USER_TYPES,
  PRODUCT_STATUS,
  ORDER_STATUS,
  QUOTE_STATUS,
  PAYMENT_STATUS,
  SERVICE_TYPES,
  PAGINATION,
  DATE_FORMATS,
  CURRENCY,
  API_PAGINATION,
  STORAGE_KEYS,
  SESSION_TIMEOUT,
  API_BASE_URL,
  ROUTES,
  HTTP_STATUS,
  TOAST_TYPES,
  MODAL_TYPES,
  PRODUCT_DEFAULTS,
  DISCOUNT_TYPES,
  PASSWORD_REQUIREMENTS,
  ERROR_MESSAGES_MAP,
  FILE_UPLOAD,
};
