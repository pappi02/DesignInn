/**
 * Wishlist Store (Zustand)
 * Global state management for user's wishlist/favorites
 * 
 * Features:
 * - Add/remove products from wishlist
 * - Persist to localStorage
 * - Compare products
 * - Get comparison data
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [], // Array of { id, productId, name, price, image, category, addedAt }
      comparingProducts: [], // Array of productIds to compare

      // Selectors
      itemCount: () => get().items.length,

      isEmpty: () => get().items.length === 0,

      /**
       * Check if product is in wishlist
       */
      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      /**
       * Find item by productId
       */
      findItem: (productId) => {
        return get().items.find((item) => item.productId === productId);
      },

      /**
       * Add product to wishlist
       */
      addItem: (product) => {
        const items = get().items;
        const exists = items.find((item) => item.productId === product.id);

        if (!exists) {
          const newItem = {
            id: `wishlist-${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            slug: product.slug,
            addedAt: new Date().toISOString(),
            rating: product.rating || 0,
            reviews: product.reviews || 0,
          };
          set({ items: [...items, newItem] });
          return newItem;
        }
        return exists;
      },

      /**
       * Remove product from wishlist
       */
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
          comparingProducts: get().comparingProducts.filter(
            (id) => id !== productId
          ),
        });
      },

      /**
       * Toggle product in wishlist (add if not present, remove if present)
       */
      toggleItem: (product) => {
        const items = get().items;
        const exists = items.find((item) => item.productId === product.id);

        if (exists) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },

      /**
       * Clear entire wishlist
       */
      clearWishlist: () => {
        set({ items: [], comparingProducts: [] });
      },

      /**
       * Add product to comparison (max 4 products)
       */
      addToComparison: (productId) => {
        const comparing = get().comparingProducts;
        if (!comparing.includes(productId) && comparing.length < 4) {
          set({ comparingProducts: [...comparing, productId] });
        }
      },

      /**
       * Remove product from comparison
       */
      removeFromComparison: (productId) => {
        set({
          comparingProducts: get().comparingProducts.filter(
            (id) => id !== productId
          ),
        });
      },

      /**
       * Toggle product in comparison
       */
      toggleComparison: (productId) => {
        const comparing = get().comparingProducts;
        if (comparing.includes(productId)) {
          get().removeFromComparison(productId);
          return false;
        } else {
          get().addToComparison(productId);
          return true;
        }
      },

      /**
       * Clear comparison list
       */
      clearComparison: () => {
        set({ comparingProducts: [] });
      },

      /**
       * Get products to compare (returns full product details)
       */
      getComparisonProducts: () => {
        const items = get().items;
        const comparing = get().comparingProducts;
        return items.filter((item) => comparing.includes(item.productId));
      },

      /**
       * Get wishlist items sorted by date added (newest first)
       */
      getSortedItems: (sortBy = 'recent') => {
        const items = [...get().items];

        switch (sortBy) {
          case 'recent':
            return items.sort(
              (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
            );
          case 'oldest':
            return items.sort(
              (a, b) => new Date(a.addedAt) - new Date(b.addedAt)
            );
          case 'name':
            return items.sort((a, b) => a.name.localeCompare(b.name));
          case 'price-low':
            return items.sort((a, b) => a.price - b.price);
          case 'price-high':
            return items.sort((a, b) => b.price - a.price);
          case 'rating':
            return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          default:
            return items;
        }
      },

      /**
       * Filter wishlist items by category
       */
      filterByCategory: (category) => {
        return get().items.filter((item) => item.category === category);
      },

      /**
       * Get wishlist statistics
       */
      getStats: () => {
        const items = get().items;
        const totalValue = items.reduce((sum, item) => sum + item.price, 0);
        const averagePrice = items.length > 0 ? totalValue / items.length : 0;
        const categories = new Set(items.map((item) => item.category));

        return {
          count: items.length,
          totalValue: totalValue.toFixed(2),
          averagePrice: averagePrice.toFixed(2),
          categories: Array.from(categories),
          priceRange: {
            min: items.length > 0 ? Math.min(...items.map((i) => i.price)) : 0,
            max: items.length > 0 ? Math.max(...items.map((i) => i.price)) : 0,
          },
        };
      },

      /**
       * Export wishlist data (for sharing)
       */
      exportJSON: () => {
        return JSON.stringify(get().items, null, 2);
      },

      /**
       * Import wishlist from JSON (for sharing)
       */
      importJSON: (jsonString) => {
        try {
          const imported = JSON.parse(jsonString);
          if (Array.isArray(imported)) {
            set({ items: imported });
            return true;
          }
        } catch (error) {
          console.error('Failed to import wishlist:', error);
        }
        return false;
      },
    }),
    {
      name: 'wishlist-store', // localStorage key
      partialize: (state) => ({
        items: state.items,
        comparingProducts: state.comparingProducts,
      }),
    }
  )
);

export default useWishlistStore;
