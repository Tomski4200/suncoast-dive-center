'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductVariantDetail, CartItem } from '@/lib/types';
import { parsePrice } from '@/lib/inventory';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, variant: ProductVariantDetail, quantity: number) => void;
  removeFromCart: (productId: number, variantId: string) => void;
  updateQuantity: (productId: number, variantId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('suncoast-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from storage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('suncoast-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: ProductVariantDetail, quantity: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.productId === product.ID && item.variantId === variant.variantId
      );

      if (existingItem) {
        // Update quantity if item already exists
        return currentItems.map(item =>
          item.productId === product.ID && item.variantId === variant.variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...currentItems, {
          productId: product.ID,
          variantId: variant.variantId,
          product,
          variant,
          quantity
        }];
      }
    });
  };

  const removeFromCart = (productId: number, variantId: string) => {
    setItems(currentItems =>
      currentItems.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      )
    );
  };

  const updateQuantity = (productId: number, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      setItems(currentItems =>
        currentItems.map(item =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + parsePrice(item.variant.Price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}