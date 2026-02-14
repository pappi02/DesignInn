/**
 * User Store (Zustand)
 * Global state management for user profile and preferences
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      profile: null,
      addresses: [],
      favorites: [],
      preferences: {
        theme: 'light',
        notifications: true,
        emailUpdates: false,
      },
      isLoading: false,
      error: null,

      // Selectors
      hasProfile: () => !!get().profile,
      defaultAddress: () => {
        return get().addresses.find((addr) => addr.is_default) || null;
      },

      // Profile management
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) => {
        set({
          profile: { ...get().profile, ...updates },
        });
      },

      // Address management
      setAddresses: (addresses) => set({ addresses }),
      addAddress: (address) => {
        set({
          addresses: [...get().addresses, address],
        });
      },
      updateAddress: (addressId, updates) => {
        const addresses = get().addresses.map((addr) =>
          addr.id === addressId ? { ...addr, ...updates } : addr
        );
        set({ addresses });
      },
      removeAddress: (addressId) => {
        set({
          addresses: get().addresses.filter((addr) => addr.id !== addressId),
        });
      },
      setDefaultAddress: (addressId) => {
        const addresses = get().addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId,
        }));
        set({ addresses });
      },

      // Favorites management
      setFavorites: (favorites) => set({ favorites }),
      addFavorite: (productId) => {
        const favorites = get().favorites;
        if (!favorites.includes(productId)) {
          set({ favorites: [...favorites, productId] });
        }
      },
      removeFavorite: (productId) => {
        set({
          favorites: get().favorites.filter((id) => id !== productId),
        });
      },
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },
      toggleFavorite: (productId) => {
        if (get().isFavorite(productId)) {
          get().removeFavorite(productId);
        } else {
          get().addFavorite(productId);
        }
      },

      // Preferences management
      setPreferences: (preferences) => {
        set({
          preferences: { ...get().preferences, ...preferences },
        });
      },
      setTheme: (theme) => {
        set({
          preferences: { ...get().preferences, theme },
        });
      },
      setNotifications: (notifications) => {
        set({
          preferences: { ...get().preferences, notifications },
        });
      },
      setEmailUpdates: (emailUpdates) => {
        set({
          preferences: { ...get().preferences, emailUpdates },
        });
      },

      // Loading and error
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Clear user data
      clearUserData: () => {
        set({
          profile: null,
          addresses: [],
          favorites: [],
          preferences: {
            theme: 'light',
            notifications: true,
            emailUpdates: false,
          },
        });
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        profile: state.profile,
        addresses: state.addresses,
        favorites: state.favorites,
        preferences: state.preferences,
      }),
    }
  )
);

export default useUserStore;
