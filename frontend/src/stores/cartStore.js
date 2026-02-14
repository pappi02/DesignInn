/**
 * Cart Store (Zustand)
 * Global state management for shopping cart
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [], // Array of { id, productId, name, price, quantity, image }
      shippingAddress: null,
      promoCode: null,
      discountPercent: 0,

      // Selectors
      total: () => {
        const subtotal = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const discount = subtotal * (get().discountPercent / 100);
        return subtotal - discount;
      },

      subtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      isEmpty: () => get().items.length === 0,

      // Find item in cart
      findItem: (productId) => {
        return get().items.find((item) => item.productId === productId);
      },

      // Add item to cart
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.productId === product.id);

        if (existingItem) {
          existingItem.quantity += quantity;
          set({ items: [...items] });
        } else {
          const newItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            category: product.category,
          };
          set({ items: [...items, newItem] });
        }
      },

      // Remove item from cart
      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((item) => item.id !== cartItemId),
        });
      },

      // Update item quantity
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        const items = get().items;
        const item = items.find((i) => i.id === cartItemId);
        if (item) {
          item.quantity = quantity;
          set({ items: [...items] });
        }
      },

      // Increment item quantity
      incrementQuantity: (cartItemId) => {
        const items = get().items;
        const item = items.find((i) => i.id === cartItemId);
        if (item) {
          item.quantity += 1;
          set({ items: [...items] });
        }
      },

      // Decrement item quantity
      decrementQuantity: (cartItemId) => {
        const items = get().items;
        const item = items.find((i) => i.id === cartItemId);
        if (item) {
          if (item.quantity > 1) {
            item.quantity -= 1;
            set({ items: [...items] });
          } else {
            get().removeItem(cartItemId);
          }
        }
      },

      // Clear cart
      clearCart: () => {
        set({
          items: [],
          shippingAddress: null,
          promoCode: null,
          discountPercent: 0,
        });
      },

      // Set shipping address
      setShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      // Apply promo code
      applyPromoCode: (code, discountPercent) => {
        set({
          promoCode: code,
          discountPercent: Math.min(discountPercent, 100),
        });
      },

      // Remove promo code
      removePromoCode: () => {
        set({
          promoCode: null,
          discountPercent: 0,
        });
      },
    }),
    {
      name: 'cart-store',
    }
  )
);

export default useCartStore;
