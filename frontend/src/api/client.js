/**
 * API Client Configuration
 * Axios instance with interceptors for token management and error handling
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Handle 401 Unauthorized
    if (status === 401) {
      // Clear stored token and auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Redirect to login (will be handled by React Router)
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (status === 403) {
      console.error('Access forbidden');
    }

    // Handle 404 Not Found
    if (status === 404) {
      console.error('Resource not found');
    }

    // Handle 500 Server Error
    if (status === 500) {
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
