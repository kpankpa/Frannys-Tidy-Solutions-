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
import type { Product } from "@/lib/products";

export type CartItem = {
  /** Product UUID (dbId), not the URL slug. */
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  /** Guide fee from admin settings — not added to checkout total. */
  deliveryGuide: number;
  total: number;
  catalogReady: boolean;
  addItem: (productDbId: string, quantity?: number) => void;
  removeItem: (productDbId: string) => void;
  setQuantity: (productDbId: string, quantity: number) => void;
  clear: () => void;
  getLineItems: () => Array<{
    product: Product;
    quantity: number;
    lineTotal: number;
  }>;
};

const CartContext = createContext<CartContextValue | null>(null);
/** v2 keys cart rows by product UUID (dbId). */
const STORAGE_KEY = "frannys-cart-v2";
const CATALOG_CACHE_KEY = "frannys-catalog-cache";
const CONFIG_CACHE_KEY = "frannys-site-config-cache";
const CLIENT_CACHE_TTL_MS = 2 * 60 * 1000;

type CacheEnvelope<T> = {
  savedAt: number;
  data: T;
};

function readClientCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (Date.now() - parsed.savedAt > CLIENT_CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeClientCache<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({ savedAt: Date.now(), data } satisfies CacheEnvelope<T>),
    );
  } catch {
    /* ignore storage quota */
  }
}

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [deliveryGuide, setDeliveryGuide] = useState<number>(SITE.deliveryFee);
  const [hydrated, setHydrated] = useState(false);
  const [catalogReady, setCatalogReady] = useState(false);

  useEffect(() => {
    // Client-only hydration from localStorage (must match SSR empty start).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydrate
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const cachedCatalog = readClientCache<Product[]>(CATALOG_CACHE_KEY);
    if (cachedCatalog?.length) {
      setCatalog(cachedCatalog);
      setCatalogReady(true);
      setItems((prev) => {
        const next = prev.filter((item) =>
          cachedCatalog.some((product) => product.dbId === item.productId),
        );
        return next.length === prev.length ? prev : next;
      });
    }

    const cachedConfig = readClientCache<{ deliveryFee: number }>(CONFIG_CACHE_KEY);
    if (cachedConfig && typeof cachedConfig.deliveryFee === "number") {
      setDeliveryGuide(cachedConfig.deliveryFee);
    }

    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("catalog fetch failed");
        return res.json();
      })
      .then((data: Product[]) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        writeClientCache(CATALOG_CACHE_KEY, list);
        setCatalog(list);
        setCatalogReady(true);
        setItems((prev) => {
          const next = prev.filter((item) =>
            list.some((p) => p.dbId === item.productId),
          );
          return next.length === prev.length ? prev : next;
        });
      })
      .catch(() => {
        if (!cancelled) {
          setCatalogReady(true);
        }
      });

    fetch("/api/site-config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { deliveryFee?: number } | null) => {
        if (cancelled || !data || typeof data.deliveryFee !== "number") return;
        writeClientCache(CONFIG_CACHE_KEY, { deliveryFee: data.deliveryFee });
        setDeliveryGuide(data.deliveryFee);
      })
      .catch(() => {
        /* keep default */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const findProduct = useCallback(
    (productDbId: string) => catalog.find((p) => p.dbId === productDbId),
    [catalog],
  );

  const addItem = useCallback((productDbId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productDbId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productDbId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId: productDbId, quantity }];
    });
  }, []);

  const removeItem = useCallback((productDbId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productDbId));
  }, []);

  const setQuantity = useCallback((productDbId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productDbId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productDbId ? { ...i, quantity } : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const getLineItems = useCallback(() => {
    return items
      .map((item) => {
        const product = findProduct(item.productId);
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
  }, [items, findProduct]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = findProduct(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [items, findProduct],
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const total = subtotal;

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      deliveryGuide,
      total,
      catalogReady,
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
      deliveryGuide,
      total,
      catalogReady,
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
