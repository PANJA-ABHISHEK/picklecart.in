"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { safeJsonParse, isClient } from "@/lib/utils";

/* ── Constants ── */
const CART_STORAGE_KEY = "picklecart_cart";
const CART_VERSION = 1;

/* ── Initial State ── */
const initialState = {
  items: [],
  isDrawerOpen: false,
  isHydrated: false,
};

/* ── Action Types ── */
const ACTIONS = {
  HYDRATE: "HYDRATE",
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  TOGGLE_DRAWER: "TOGGLE_DRAWER",
  OPEN_DRAWER: "OPEN_DRAWER",
  CLOSE_DRAWER: "CLOSE_DRAWER",
};

/* ── Reducer ── */
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.HYDRATE:
      return { ...state, items: action.payload, isHydrated: true };

    case ACTIONS.ADD_ITEM: {
      const { productId, variantId, name, variantLabel, price, image } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );

      let newItems;
      if (existingIndex > -1) {
        newItems = state.items.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            productId,
            variantId,
            name,
            variantLabel,
            price,
            image,
            quantity: 1,
          },
        ];
      }
      return { ...state, items: newItems };
    }

    case ACTIONS.REMOVE_ITEM: {
      const { productId, variantId } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        ),
      };
    }

    case ACTIONS.UPDATE_QUANTITY: {
      const { productId, variantId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    case ACTIONS.TOGGLE_DRAWER:
      return { ...state, isDrawerOpen: !state.isDrawerOpen };

    case ACTIONS.OPEN_DRAWER:
      return { ...state, isDrawerOpen: true };

    case ACTIONS.CLOSE_DRAWER:
      return { ...state, isDrawerOpen: false };

    default:
      return state;
  }
}

/* ── Persistence Helpers ── */
function loadCart() {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const data = safeJsonParse(raw, null);
    if (!data || data.version !== CART_VERSION || !Array.isArray(data.items)) return [];
    // Validate each item has required fields
    return data.items.filter(
      (item) =>
        item.productId &&
        item.variantId &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

function saveCart(items) {
  if (!isClient()) return;
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: CART_VERSION, items })
    );
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

/* ── Context ── */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedItems = loadCart();
    dispatch({ type: ACTIONS.HYDRATE, payload: savedItems });
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (state.isHydrated) {
      saveCart(state.items);
    }
  }, [state.items, state.isHydrated]);

  /* ── Derived Values ── */
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ── Actions ── */
  const addItem = useCallback(
    (item) => dispatch({ type: ACTIONS.ADD_ITEM, payload: item }),
    []
  );

  const removeItem = useCallback(
    (productId, variantId) =>
      dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { productId, variantId } }),
    []
  );

  const updateQuantity = useCallback(
    (productId, variantId, quantity) =>
      dispatch({
        type: ACTIONS.UPDATE_QUANTITY,
        payload: { productId, variantId, quantity },
      }),
    []
  );

  const clearCart = useCallback(() => dispatch({ type: ACTIONS.CLEAR_CART }), []);
  const toggleDrawer = useCallback(() => dispatch({ type: ACTIONS.TOGGLE_DRAWER }), []);
  const openDrawer = useCallback(() => dispatch({ type: ACTIONS.OPEN_DRAWER }), []);
  const closeDrawer = useCallback(() => dispatch({ type: ACTIONS.CLOSE_DRAWER }), []);

  const value = {
    items: state.items,
    isDrawerOpen: state.isDrawerOpen,
    isHydrated: state.isHydrated,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
