import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load initial cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );
      if (existing) {
        return prev.map((item) => {
          if (item.id === product.id && item.size === product.size && item.color === product.color) {
            const newQty = item.quantity + (product.quantity || 1);
            return { ...item, quantity: product.maxStock !== undefined ? Math.min(newQty, product.maxStock) : newQty };
          }
          return item;
        });
      }
      return [
        ...prev,
        {
          ...product,
          quantity: product.quantity || 1,
          collection: product.collection || 'LIYARA',
          color: product.color || 'Default',
          size: product.size || 'M',
          maxStock: product.maxStock || 10,
        },
      ];
    });
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + 1;
          return { ...item, quantity: item.maxStock !== undefined ? Math.min(newQty, item.maxStock) : newQty };
        }
        return item;
      })
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const updateCartStocks = (updates) => {
    setCartItems((prev) => 
      prev.map((item) => {
        const update = updates.find(u => u.id === item.id && u.size === item.size);
        if (update) {
          return {
            ...item,
            maxStock: update.maxStock,
            quantity: Math.max(0, Math.min(item.quantity, update.maxStock)) // prevent exceeding stock
          };
        }
        return item;
      })
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        cartCount,
        cartTotal,
        updateCartStocks,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
