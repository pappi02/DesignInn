/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
      if (response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || 'Registration failed',
        details: error.response?.data?.details,
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      if (response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || 'Login failed',
        details: error.response?.data?.details,
      };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || 'Failed to fetch profile',
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(
        ENDPOINTS.AUTH.UPDATE_PROFILE,
        profileData
      );
      if (response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || 'Failed to update profile',
        details: error.response?.data?.details,
      };
    }
  },

  // Change password
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.error || 'Failed to change password',
        details: error.response?.data?.details,
      };
    }
  },

  // Verify token validity
  verifyToken: async (token) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_TOKEN, {
        token,
      });
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status,
        message: 'Invalid token',
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      // Clear token even if request fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return { success: true, message: 'Logged out' };
    }
  },

  // Get stored user from localStorage
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get stored token from localStorage
  getStoredToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

export default authAPI;
