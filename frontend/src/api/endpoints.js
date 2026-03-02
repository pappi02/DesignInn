/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API operations
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/users/',
    LOGIN: '/users/',
    PROFILE: '/users/me/',
    UPDATE_PROFILE: '/users/me/',
    CHANGE_PASSWORD: '/users/change_password/',
    VERIFY_TOKEN: '/users/verify_token/',
    LOGOUT: '/users/logout/',
    LIST_USERS: '/users/',
  },

  // Products
  PRODUCTS: {
    LIST: '/products/',
    DETAIL: (slug) => `/products/${slug}/`,
    FEATURED: '/products/featured/',
    NEWEST: '/products/newest/',
    BESTSELLERS: '/products/bestsellers/',
    RELATED: (slug) => `/products/${slug}/related/`,
    TOGGLE_FEATURED: (slug) => `/products/${slug}/toggle_featured/`,
    TOGGLE_STATUS: (slug) => `/products/${slug}/toggle_status/`,
    CREATE: '/products/',
    UPDATE: (slug) => `/products/${slug}/`,
    DELETE: (slug) => `/products/${slug}/`,
    CATEGORIES: '/products/categories/',
    CATEGORY_DETAIL: (id) => `/products/categories/${id}/`,
    VARIANTS: '/products/variants/',
    VARIANT_ADJUST_STOCK: (id) => `/products/variants/${id}/adjust_stock/`,
    IMAGES: '/products/images/',
  },

  // Orders
  ORDERS: {
    CREATE: '/orders/',
    LIST: '/orders/',
    DETAIL: (id) => `/orders/${id}/`,
    UPDATE: (id) => `/orders/${id}/`,
    DELETE: (id) => `/orders/${id}/`,
    MY_ORDERS: '/orders/my_orders/',
    TRACK: (id) => `/orders/${id}/track/`,
    UPDATE_STATUS: (id) => `/orders/${id}/update_status/`,
    MARK_SHIPPED: (id) => `/orders/${id}/mark_shipped/`,
    CANCEL: (id) => `/orders/${id}/cancel/`,
    FEEDBACK: (id) => `/orders/${id}/feedback/`,
    SUMMARY: (id) => `/orders/${id}/summary/`,
  },

  // Quotes
  QUOTES: {
    CREATE: '/quotes/',
    LIST: '/quotes/',
    DETAIL: (id) => `/quotes/${id}/`,
    UPDATE: (id) => `/quotes/${id}/`,
    DELETE: (id) => `/quotes/${id}/`,
    MY_QUOTES: '/quotes/my_quotes/',
    PENDING_REVIEW: '/quotes/pending_review/',
    UPDATE_STATUS: (id) => `/quotes/${id}/update_status/`,
    ADD_COMMENT: (id) => `/quotes/${id}/add_comment/`,
    ACCEPT: (id) => `/quotes/${id}/accept/`,
    REJECT: (id) => `/quotes/${id}/reject/`,
  },

  // Portfolio
  PORTFOLIO: {
    LIST: '/portfolio/',
    DETAIL: (slug) => `/portfolio/${slug}/`,
    FEATURED: '/portfolio/featured/',
    BY_CATEGORY: '/portfolio/by_category/',
    LATEST: '/portfolio/latest/',
    CREATE: '/portfolio/',
    UPDATE: (slug) => `/portfolio/${slug}/`,
    DELETE: (slug) => `/portfolio/${slug}/`,
    IMAGES: '/portfolio/images/',
  },

  // Services
  SERVICES: {
    LIST: '/services/',
    DETAIL: (slug) => `/services/${slug}/`,
    FEATURED: '/services/featured/',
    BY_TYPE: '/services/by_type/',
    ALL_TYPES: '/services/all_types/',
    CREATE: '/services/',
    UPDATE: (slug) => `/services/${slug}/`,
    DELETE: (slug) => `/services/${slug}/`,
  },

  // Users (Admin)
  USERS: {
    LIST: '/users/',
    DETAIL: (id) => `/users/${id}/`,
    UPDATE: (id) => `/users/${id}/`,
    DELETE: (id) => `/users/${id}/`,
    UPDATE_ROLE: (id) => `/users/${id}/update_role/`,
    UPDATE_STATUS: (id) => `/users/${id}/update_status/`,
    STATS: '/users/stats/',
  },

  // Settings (Admin)
  SETTINGS: {
    GET: '/admin/settings/',
    UPDATE: '/admin/settings/',
    EMAIL_TEMPLATES: '/admin/email_templates/',
    EMAIL_TEMPLATE_DETAIL: (id) => `/admin/email_templates/${id}/`,
    UPDATE_TEMPLATE: (id) => `/admin/email_templates/${id}/`,
    API_KEYS: '/admin/api_keys/',
    GENERATE_API_KEY: '/admin/api_keys/generate/',
    DELETE_API_KEY: (id) => `/admin/api_keys/${id}/`,
    SYSTEM_STATS: '/admin/stats/',
  },

  // Reviews
  REVIEWS: {
    LIST: '/reviews/',
    CREATE: '/reviews/',
    UPDATE: (id) => `/reviews/${id}/`,
    DELETE: (id) => `/reviews/${id}/`,
  },

  // Wishlist
  WISHLIST: {
    LIST: '/wishlist/',
    ADD: '/wishlist/',
    REMOVE: (id) => `/wishlist/${id}/`,
    TOGGLE: (id) => `/wishlist/${id}/toggle/`,
  },

  // Analytics & Reporting (Admin)
  ANALYTICS: {
    METRICS: '/analytics/metrics/',
    REVENUE_TRENDS: '/analytics/revenue_trends/',
    ORDER_ANALYTICS: '/analytics/orders/',
    USER_ANALYTICS: '/analytics/users/',
    PRODUCT_PERFORMANCE: '/analytics/products/performance/',
    CUSTOMER_SEGMENTS: '/analytics/customers/segments/',
    CONVERSION_FUNNEL: '/analytics/conversion_funnel/',
    TOP_PRODUCTS: '/analytics/products/top/',
    TRAFFIC_SOURCES: '/analytics/traffic_sources/',
    EXPORT: '/analytics/export/',
    CUSTOM_REPORT: (type) => `/analytics/reports/${type}/`,
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  ORDER_CREATED: 'Order created successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  FEEDBACK_SUBMITTED: 'Thank you for your feedback!',
  QUOTE_SUBMITTED: 'Quote submitted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
};
