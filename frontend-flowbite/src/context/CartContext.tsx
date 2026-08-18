"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;       // límite máximo comprable
  image_url?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(i => i.productId === newItem.productId);
      if (existingIndex >= 0) {
        const updated = [...prevItems];
        const current = updated[existingIndex];
        // No superar el stock disponible
        const newQty = Math.min(current.quantity + newItem.quantity, current.stock);
        updated[existingIndex] = { ...current, quantity: newQty };
        return updated;
      }
      return [...prevItems, newItem];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map(item => {
        if (item.productId !== productId) return item;
        // Clamp: mínimo 1, máximo stock
        const clamped = Math.min(Math.max(1, quantity), item.stock);
        return { ...item, quantity: clamped };
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter(item => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
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
