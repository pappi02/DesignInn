/**
 * Authentication Store (Zustand)
 * Global state management for authentication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authAPI from '../api/auth.api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Selectors
      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.is_staff || false,

      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Register
      register: async (email, password, firstName, lastName, phone) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            phone,
          });
          set({
            user: response.data,
            token: response.data.token,
            isLoading: false,
          });
          return response;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(email, password);
          set({
            user: response.data,
            token: response.data.token,
            isLoading: false,
          });
          return response;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });
        try {
          await authAPI.logout();
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isLoading: false,
          });
        }
      },

      // Get Profile
      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.getProfile();
          set({
            user: response.data,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      // Update Profile
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateProfile(profileData);
          set({
            user: response.data,
            isLoading: false,
          });
          return response;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      // Change Password
      changePassword: async (oldPassword, newPassword, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.changePassword(
            oldPassword,
            newPassword,
            confirmPassword
          );
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const token = authAPI.getStoredToken();
        const user = authAPI.getStoredUser();
        if (token && user) {
          set({ token, user });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
