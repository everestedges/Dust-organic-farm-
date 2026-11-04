import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { products as defaultProducts, Product } from "./data";

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  hasLoadedLive: boolean;

  // Actions
  fetchProducts: () => Promise<void>;
  getProduct: (slugOrId: string | undefined) => Product | undefined;
  addProduct: (product: Product) => Promise<boolean>;
  updateProductPrice: (id: string, newPrice: number) => Promise<boolean>;
  updateProductStock: (id: string, newStock: number) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const API_BASE =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5000/api";

const isLegacyDuplicate = (p: Product) =>
  ["2", "3", "4", "5"].includes(String(p.slug)) ||
  [
    "DUST Almond Powder (500g)",
    "DUST Premium Cashew Powder (500g)",
    "DUST Natural Powder Shampoo for Men (100ml)",
    "Kacha Aam Instant Powder",
  ].includes(p.name);

const getProductKey = (p: Product) => {
  const n = (p.name || "").toLowerCase();
  if (n.includes("ragi")) return "ragi";
  if (n.includes("paan")) return "paan";
  if (n.includes("almond")) return "almond";
  if (n.includes("cashew")) return "cashew";
  if (n.includes("shampoo")) return "shampoo";
  return (p.slug || p.id || p.name).toLowerCase().trim();
};

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: defaultProducts.filter((p) => !isLegacyDuplicate(p)),
      isLoading: false,
      hasLoadedLive: false,

      fetchProducts: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE}/products`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.products)) {
              const dbProducts: Product[] = data.products.filter((p: Product) => !isLegacyDuplicate(p));
              const mergedMap = new Map<string, Product>();

              // Add defaults first
              defaultProducts
                .filter((p) => !isLegacyDuplicate(p))
                .forEach((p) => {
                  mergedMap.set(getProductKey(p), p);
                });

              // Overlay DB products (DB rows take precedence)
              dbProducts.forEach((p) => {
                mergedMap.set(getProductKey(p), p);
              });

              const uniqueList = Array.from(mergedMap.values()).filter(
                (p) => !isLegacyDuplicate(p)
              );
              set({ products: uniqueList, hasLoadedLive: true });
            }
          }
        } catch (err) {
          console.warn("Could not load live products, using cached/default:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      getProduct: (slugOrId: string | undefined) => {
        if (!slugOrId) return undefined;
        const list = get().products;
        return (
          list.find((p) => p.slug === slugOrId || p.id === slugOrId) ||
          list.find((p) => slugOrId.includes("paan") && p.slug.includes("paan")) ||
          list.find((p) => slugOrId.includes("ragi") && p.slug.includes("ragi")) ||
          list.find((p) => slugOrId.includes("shampoo") && p.slug.includes("shampoo")) ||
          list.find((p) => slugOrId.includes("almond") && p.slug.includes("almond")) ||
          list.find((p) => slugOrId.includes("cashew") && p.slug.includes("cashew"))
        );
      },

      addProduct: async (newProd: Product) => {
        // Optimistic update
        set((state) => ({
          products: [newProd, ...state.products.filter((p) => p.slug !== newProd.slug && p.id !== newProd.id)],
        }));

        try {
          const res = await fetch(`${API_BASE}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProd),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            // Re-fetch to synchronize IDs
            get().fetchProducts();
            return true;
          }
        } catch (err) {
          console.warn("Could not sync product with MySQL, kept locally:", err);
        }
        return false;
      },

      updateProductPrice: async (id: string, newPrice: number) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id || p.slug === id
              ? {
                  ...p,
                  price: newPrice,
                  priceDisplay: `₹${newPrice}`,
                }
              : p
          ),
        }));

        try {
          await fetch(`${API_BASE}/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ price: newPrice }),
          });
          return true;
        } catch (err) {
          console.warn("Could not update price in DB:", err);
          return false;
        }
      },

      updateProductStock: async (id: string, newStock: number) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id || p.slug === id ? { ...p, stock: newStock } : p
          ),
        }));

        try {
          await fetch(`${API_BASE}/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: newStock }),
          });
          return true;
        } catch (err) {
          console.warn("Could not update stock in DB:", err);
          return false;
        }
      },

      deleteProduct: async (id: string) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id && p.slug !== id),
        }));

        try {
          await fetch(`${API_BASE}/products/${id}`, {
            method: "DELETE",
          });
          return true;
        } catch (err) {
          console.warn("Could not delete product in DB:", err);
          return false;
        }
      },
    }),
    {
      name: "dust_products_store_v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

