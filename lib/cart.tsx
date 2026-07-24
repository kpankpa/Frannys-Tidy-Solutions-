"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SITE } from "@/lib/constants";
import { getProduct, type Product } from "@/lib/products";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  getLineItems: () => Array<{
    product: Product;
    quantity: number;
    lineTotal: number;
  }>;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "frannys-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const getLineItems = useCallback(() => {
    return items
      .map((item) => {
        const product = getProduct(item.productId);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean) as Array<{
      product: Product;
      quantity: number;
      lineTotal: number;
    }>;
  }, [items]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProduct(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [items],
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const delivery = items.length > 0 ? SITE.deliveryFee : 0;
  const total = subtotal + delivery;

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      delivery,
      total,
      addItem,
      removeItem,
      setQuantity,
      clear,
      getLineItems,
    }),
    [
      items,
      count,
      subtotal,
      delivery,
      total,
      addItem,
      removeItem,
      setQuantity,
      clear,
      getLineItems,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
