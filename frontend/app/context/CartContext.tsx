"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService';

interface CartItem {
  id: number;
  quantity: number;
  variant: any;
  bundle: any;
}

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (variantId?: number, bundleId?: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.data && res.data.items) {
        setCartItems(res.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch cart if user has a token or guest session
    const hasSession = localStorage.getItem('auriqAccessToken') || localStorage.getItem('auriqGuestSessionId');
    if (hasSession) refreshCart();
    window.addEventListener('loginStateChange', refreshCart);
    return () => {
      window.removeEventListener('loginStateChange', refreshCart);
    };
  }, []);

  const addToCart = async (variantId?: number, bundleId?: number, quantity: number = 1) => {
    const result = await cartService.addToCart(variantId, bundleId, quantity);
    // Backend returns the full updated cart — use it directly, no second GET needed
    if (result?.data?.items) {
      setCartItems(result.data.items);
    } else {
      refreshCart();
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    // Update UI immediately — no waiting for network
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    try {
      await cartService.updateCartItem(itemId, quantity);
    } catch (error) {
      // Revert to server state on failure
      refreshCart();
    }
  };

  const removeItem = async (itemId: number) => {
    // Remove from UI immediately
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    try {
      await cartService.removeFromCart(itemId);
    } catch (error) {
      // Revert to server state on failure
      refreshCart();
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.variant ? Number(item.variant.discount_price || item.variant.price) : Number(item.bundle.price);
    return total + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, cartCount, isLoading, refreshCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
