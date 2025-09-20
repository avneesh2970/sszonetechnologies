import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();


const initialState = {
  cartItems: [],
  wishlistItems: [], 
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      if (state.cartItems.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
      case 'TOGGLE_WISHLIST':
        const exists = state.wishlistItems.find(item => item.id === action.payload.id);
        if (exists) {
          return {
            ...state,
            wishlistItems: state.wishlistItems.filter(item => item.id !== action.payload.id),
          };
        } else {
          return {
            ...state,
            wishlistItems: [...state.wishlistItems, action.payload],
          };
        }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = course => {
    dispatch({ type: 'ADD_TO_CART', payload: course });
  };
  const toggleWishlist = course => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: course });
  };
  
  const removeFromCart = id => dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const subtotal = state.cartItems.reduce((acc, item) => acc + item.price, 0);
  const promo = 500;
  const total = subtotal - promo;
  const cartCount = state.cartItems.length;
  const wishlistCount = state.wishlistItems.length;



  return (
    <CartContext.Provider value={{
       cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        subtotal,
        promo,
        total,
        cartCount,
        wishlistItems: state.wishlistItems,
        toggleWishlist,
        wishlistCount,
         }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);