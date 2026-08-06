import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    const data = await cartService.addToCart(productId, quantity);
    setCart(data);
    return data;
  };

  const updateItem = async (itemId, quantity) => {
    const data = await cartService.updateCartItem(itemId, quantity);
    setCart(data);
    return data;
  };

  const removeItem = async (itemId) => {
    const data = await cartService.removeCartItem(itemId);
    setCart(data);
    return data;
  };

  const clearCart = async () => {
    const data = await cartService.clearCart();
    setCart(data);
    return data;
  };

  const value = {
    cart,
    loading,
    itemCount: cart?.total_items || 0,
    subtotal: cart?.subtotal || 0,
    hasUnavailableItems: cart?.has_unavailable_items || false,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
