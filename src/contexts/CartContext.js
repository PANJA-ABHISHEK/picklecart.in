"use client";

import { createContext, useContext, useReducer, useEffect, useState, useCallback } from "react";
import { safeJsonParse, isClient } from "@/lib/utils";

/* ── Constants ── */
const CART_STORAGE_KEY = "picklecart_cart";
const CART_VERSION = 1;

/* ── Initial State ── */
const initialState = {
  items: [],
  isDrawerOpen: false,
  isHydrated: false,
  appliedPromo: null,
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
  SET_PROMO: "SET_PROMO",
  REMOVE_PROMO: "REMOVE_PROMO",
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

    case ACTIONS.SET_PROMO:
      return { ...state, appliedPromo: action.payload };

    case ACTIONS.REMOVE_PROMO:
      return { ...state, appliedPromo: null };

    default:
      return state;
  }
}

/* ── Persistence Helpers ── */
function loadCart() {
  if (!isClient()) return { items: [], promo: null };
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [], promo: null };
    const data = safeJsonParse(raw, null);
    if (!data || data.version !== CART_VERSION || !Array.isArray(data.items)) return { items: [], promo: null };
    // Validate each item has required fields
    const validItems = data.items.filter(
      (item) =>
        item.productId &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
    return { items: validItems, promo: data.appliedPromo || null };
  } catch {
    return { items: [], promo: null };
  }
}

function saveCart(state) {
  if (!isClient()) return;
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: CART_VERSION, items: state.items, appliedPromo: state.appliedPromo })
    );
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

/* ── Context ── */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const [shippingConfig, setShippingConfig] = useState({
    defaultFee: 99,
    freeThreshold: 1500,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedData = loadCart();
    dispatch({ type: ACTIONS.HYDRATE, payload: savedData.items });
    if (savedData.promo) {
      dispatch({ type: ACTIONS.SET_PROMO, payload: savedData.promo });
    }
  }, []);

  // Fetch live store shipping settings on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.settings?.shipping) {
            setShippingConfig({
              defaultFee: Number(data.settings.shipping.defaultFee) >= 0 ? Number(data.settings.shipping.defaultFee) : 99,
              freeThreshold: Number(data.settings.shipping.freeThreshold) >= 0 ? Number(data.settings.shipping.freeThreshold) : 1500,
            });
          }
        }
      } catch (err) {
        // Fallback to default 99 & 1500
      }
    }
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (state.isHydrated) {
      saveCart(state);
    }
  }, [state.items, state.appliedPromo, state.isHydrated]);

  /* ── Derived Values ── */
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discountAmount = 0;
  let isPromoValid = !!state.appliedPromo;
  
  if (state.appliedPromo) {
    if (state.appliedPromo.minOrderValue && subtotal < state.appliedPromo.minOrderValue) {
      isPromoValid = false;
    } else {
      if (state.appliedPromo.type === "percentage") {
        discountAmount = (subtotal * state.appliedPromo.value) / 100;
        if (state.appliedPromo.maxDiscount && discountAmount > state.appliedPromo.maxDiscount) {
          discountAmount = state.appliedPromo.maxDiscount;
        }
      } else {
        discountAmount = state.appliedPromo.value;
      }
      if (discountAmount > subtotal) discountAmount = subtotal;
    }
  }

  // Shipping calculation:
  // Dynamically configured from store settings (defaults: ₹99, Free >= ₹1500)
  const FREE_SHIPPING_THRESHOLD = shippingConfig.freeThreshold;
  const DEFAULT_SHIPPING_FEE = shippingConfig.defaultFee;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : DEFAULT_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const total = Math.max(0, subtotal - discountAmount + shippingFee);

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

  const applyPromo = useCallback((promo) => dispatch({ type: ACTIONS.SET_PROMO, payload: promo }), []);
  const removePromo = useCallback(() => dispatch({ type: ACTIONS.REMOVE_PROMO }), []);

  const value = {
    items: state.items,
    isDrawerOpen: state.isDrawerOpen,
    isHydrated: state.isHydrated,
    appliedPromo: state.appliedPromo,
    isPromoValid,
    discountAmount,
    shippingFee,
    defaultShippingFee: DEFAULT_SHIPPING_FEE,
    isFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountNeededForFreeShipping,
    freeShippingProgress,
    total,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    applyPromo,
    removePromo,
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
