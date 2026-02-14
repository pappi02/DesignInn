/**
 * Storage Utilities
 * localStorage helper functions
 */

import { STORAGE_KEYS } from './constants';

// Get from localStorage
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Set to localStorage
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

// Remove from localStorage
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// Clear all localStorage
export const clearAllStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Check if key exists
export const hasStorageItem = (key) => {
  return localStorage.getItem(key) !== null;
};

// Auth token helpers
export const getAuthToken = () => {
  return getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
};

export const setAuthToken = (token) => {
  return setToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const removeAuthToken = () => {
  return removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
};

// User data helpers
export const getUserData = () => {
  return getFromStorage(STORAGE_KEYS.USER_DATA);
};

export const setUserData = (userData) => {
  return setToStorage(STORAGE_KEYS.USER_DATA, userData);
};

export const removeUserData = () => {
  return removeFromStorage(STORAGE_KEYS.USER_DATA);
};

// Theme helpers
export const getTheme = (defaultTheme = 'light') => {
  return getFromStorage(STORAGE_KEYS.THEME, defaultTheme);
};

export const setTheme = (theme) => {
  return setToStorage(STORAGE_KEYS.THEME, theme);
};

// Language helpers
export const getLanguage = (defaultLanguage = 'en') => {
  return getFromStorage(STORAGE_KEYS.LANGUAGE, defaultLanguage);
};

export const setLanguage = (language) => {
  return setToStorage(STORAGE_KEYS.LANGUAGE, language);
};

// Clear auth related storage
export const clearAuthStorage = () => {
  removeAuthToken();
  removeUserData();
  return true;
};

// Get all storage keys
export const getAllStorageKeys = () => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
  }
  return keys;
};

// Get storage size (approximate)
export const getStorageSize = () => {
  let size = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const item = localStorage.getItem(key);
    size += key.length + item.length;
  }
  return size;
};

// Format storage size as human readable
export const formatStorageSize = (bytes) => {
  const units = ['B', 'KB', 'MB'];
  let size = bytes;
  let unitIndex = 0;

  while (size > 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

// Sync storage across tabs
export const setupStorageSync = (onStorageChange) => {
  const handleStorageChange = (e) => {
    if (onStorageChange) {
      onStorageChange(e.key, e.newValue);
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

export default {
  getFromStorage,
  setToStorage,
  removeFromStorage,
  clearAllStorage,
  hasStorageItem,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserData,
  setUserData,
  removeUserData,
  getTheme,
  setTheme,
  getLanguage,
  setLanguage,
  clearAuthStorage,
  getAllStorageKeys,
  getStorageSize,
  formatStorageSize,
  setupStorageSync,
};
