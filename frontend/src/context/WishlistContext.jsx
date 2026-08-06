import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { wishlistService } from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(null);
      return;
    }
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const toggle = async (productId) => {
    const data = await wishlistService.toggle(productId);
    setWishlist(data.wishlist);
    return data.added;
  };

  const removeItem = async (itemId) => {
    const data = await wishlistService.removeItem(itemId);
    setWishlist(data);
    return data;
  };

  const moveToCart = async (itemId) => {
    const data = await wishlistService.moveToCart(itemId);
    setWishlist(data);
    return data;
  };

  const isWishlisted = (productId) =>
    !!wishlist?.items?.some((item) => item.product.id === productId);

  const value = {
    wishlist,
    loading,
    itemCount: wishlist?.total_items || 0,
    toggle,
    removeItem,
    moveToCart,
    isWishlisted,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
