// import React, { createContext, useContext, useReducer } from 'react';

// const CartContext = createContext();


// const initialState = {
//   cartItems: [],
//   wishlistItems: [], 
// };

// function cartReducer(state, action) {
//   switch (action.type) {
//     case 'ADD_TO_CART':
//       if (state.cartItems.find(item => item.id === action.payload.id)) {
//         return state;
//       }
//       return {
//         ...state,
//         cartItems: [...state.cartItems, action.payload],
//       };
//       case 'TOGGLE_WISHLIST':
//         const exists = state.wishlistItems.find(item => item.id === action.payload.id);
//         if (exists) {
//           return {
//             ...state,
//             wishlistItems: state.wishlistItems.filter(item => item.id !== action.payload.id),
//           };
//         } else {
//           return {
//             ...state,
//             wishlistItems: [...state.wishlistItems, action.payload],
//           };
//         }
//     case 'REMOVE_FROM_CART':
//       return {
//         ...state,
//         cartItems: state.cartItems.filter(item => item.id !== action.payload),
//       };
//     default:
//       return state;
//   }
// }

// export function CartProvider({ children }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   const addToCart = course => {
//     dispatch({ type: 'ADD_TO_CART', payload: course });
//   };
//   const toggleWishlist = course => {
//     dispatch({ type: 'TOGGLE_WISHLIST', payload: course });
//   };
  
//   const removeFromCart = id => dispatch({ type: 'REMOVE_FROM_CART', payload: id });

//   const subtotal = state.cartItems.reduce((acc, item) => acc + item.price, 0);
//   const promo = 500;
//   const total = subtotal - promo;
//   const cartCount = state.cartItems.length;
//   const wishlistCount = state.wishlistItems.length;



//   return (
//     <CartContext.Provider value={{
//        cartItems: state.cartItems,
//         addToCart,
//         removeFromCart,
//         subtotal,
//         promo,
//         total,
//         cartCount,
//         wishlistItems: state.wishlistItems,
//         toggleWishlist,
//         wishlistCount,
//          }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => useContext(CartContext);


// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";

const CartContext = createContext(null);

const BASE = import.meta.env.VITE_BACKEND_URL || "";

export function CartProvider({ children }) {
  // state
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const [cartError, setCartError] = useState(null);
  const [wishlistError, setWishlistError] = useState(null);

  // fetch cart items
  const fetchCartItems = useCallback(async () => {
    setLoadingCart(true);
    setCartError(null);
    try {
      const res = await axios.get(`${BASE}/api/cart`, { withCredentials: true });
      // Accept either array or object with items property, adjust based on your API
      const data = res?.data ?? [];
      setCartItems(Array.isArray(data) ? data : data.items ?? []);
      return data;
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setCartItems([]); // reset on error
      setCartError(err);
      return null;
    } finally {
      setLoadingCart(false);
    }
  }, []);

  // fetch wishlist items
  const fetchWishlist = useCallback(async () => {
    setLoadingWishlist(true);
    setWishlistError(null);
    try {
      const res = await axios.get(`${BASE}/api/wishlist`, { withCredentials: true });
      const data = res?.data ?? [];
      setWishlistItems(Array.isArray(data) ? data : data.items ?? []);
      return data;
    } catch (err) {
      console.error("Error fetching wishlist items:", err);
      setWishlistItems([]);
      setWishlistError(err);
      return null;
    } finally {
      setLoadingWishlist(false);
    }
  }, []);

  // fetch on mount
  useEffect(() => {
    let mounted = true;
    // call both, but avoid setting state after unmount by checking `mounted`
    (async () => {
      const cart = await fetchCartItems();
      const wish = await fetchWishlist();
      if (!mounted) return;
      // (we already set state inside fetch functions)
    })();
    return () => {
      mounted = false;
    };
  }, [fetchCartItems, fetchWishlist]);

  // convenience values
  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;
  const subtotal = cartItems.reduce((acc, it) => acc + (Number(it.price) || 0), 0);

  // memoize provided context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      // state
      cartItems,
      wishlistItems,

      // meta
      loadingCart,
      loadingWishlist,
      cartError,
      wishlistError,

      // helpers
      fetchCartItems,
      fetchWishlist,

      // derived
      cartCount,
      wishlistCount,
      subtotal,
    }),
    [
      cartItems,
      wishlistItems,
      loadingCart,
      loadingWishlist,
      cartError,
      wishlistError,
      fetchCartItems,
      fetchWishlist,
      cartCount,
      wishlistCount,
      subtotal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// hook for consumers
export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return ctx;
}
