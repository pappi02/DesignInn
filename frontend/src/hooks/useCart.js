/**
 * useCart Hook
 * Provides cart operations and state
 */

import { useCallback } from 'react';
import { useCartStore } from '../stores/cartStore';

export const useCart = () => {
  const {
    items,
    shippingAddress,
    promoCode,
    discountPercent,
    total,
    subtotal,
    itemCount,
    isEmpty,
    findItem,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    setShippingAddress,
    applyPromoCode,
    removePromoCode,
  } = useCartStore();

  // Add item
  const handleAddItem = useCallback(
    (product, quantity = 1) => {
      addItem(product, quantity);
    },
    [addItem]
  );

  // Remove item
  const handleRemoveItem = useCallback(
    (cartItemId) => {
      removeItem(cartItemId);
    },
    [removeItem]
  );

  // Update quantity
  const handleUpdateQuantity = useCallback(
    (cartItemId, quantity) => {
      updateQuantity(cartItemId, quantity);
    },
    [updateQuantity]
  );

  // Increment quantity
  const handleIncrementQuantity = useCallback(
    (cartItemId) => {
      incrementQuantity(cartItemId);
    },
    [incrementQuantity]
  );

  // Decrement quantity
  const handleDecrementQuantity = useCallback(
    (cartItemId) => {
      decrementQuantity(cartItemId);
    },
    [decrementQuantity]
  );

  // Clear cart
  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  // Set shipping address
  const handleSetShippingAddress = useCallback(
    (address) => {
      setShippingAddress(address);
    },
    [setShippingAddress]
  );

  // Apply promo code
  const handleApplyPromoCode = useCallback(
    (code, discountPercent) => {
      applyPromoCode(code, discountPercent);
    },
    [applyPromoCode]
  );

  // Remove promo code
  const handleRemovePromoCode = useCallback(() => {
    removePromoCode();
  }, [removePromoCode]);

  return {
    // State
    items,
    shippingAddress,
    promoCode,
    discountPercent,
    total: total(),
    subtotal: subtotal(),
    itemCount: itemCount(),
    isEmpty: isEmpty(),

    // Methods
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    incrementQuantity: handleIncrementQuantity,
    decrementQuantity: handleDecrementQuantity,
    clearCart: handleClearCart,
    setShippingAddress: handleSetShippingAddress,
    applyPromoCode: handleApplyPromoCode,
    removePromoCode: handleRemovePromoCode,
    findItem,
  };
};

export default useCart;
