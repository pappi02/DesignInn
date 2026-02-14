/**
 * useAuth Hook
 * Provides authentication operations and state
 */

import { useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    initializeAuth,
    clearError,
  } = useAuthStore();

  // Register user
  const handleRegister = useCallback(
    async (email, password, firstName, lastName, phone) => {
      try {
        await register(email, password, firstName, lastName, phone);
        return true;
      } catch (err) {
        console.error('Registration failed:', err);
        return false;
      }
    },
    [register]
  );

  // Login user
  const handleLogin = useCallback(
    async (email, password) => {
      try {
        await login(email, password);
        return true;
      } catch (err) {
        console.error('Login failed:', err);
        return false;
      }
    },
    [login]
  );

  // Logout user
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      return true;
    } catch (err) {
      console.error('Logout failed:', err);
      return false;
    }
  }, [logout]);

  // Fetch current user profile
  const fetchProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      return profile;
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      return null;
    }
  }, [getProfile]);

  // Update user profile
  const handleUpdateProfile = useCallback(
    async (profileData) => {
      try {
        const response = await updateProfile(profileData);
        return response;
      } catch (err) {
        console.error('Profile update failed:', err);
        return null;
      }
    },
    [updateProfile]
  );

  // Change password
  const handleChangePassword = useCallback(
    async (oldPassword, newPassword, confirmPassword) => {
      try {
        const response = await changePassword(
          oldPassword,
          newPassword,
          confirmPassword
        );
        return response;
      } catch (err) {
        console.error('Password change failed:', err);
        return null;
      }
    },
    [changePassword]
  );

  return {
    // State
    user,
    token,
    isLoading,
    error,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),

    // Methods
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    getProfile: fetchProfile,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    initializeAuth,
    clearError,
  };
};

export default useAuth;
