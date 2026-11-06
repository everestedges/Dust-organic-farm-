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
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string, slug?: string, name?: string) => Promise<boolean>;
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

              // Overlay DB products (preserve high-res bundled media for core products unless custom image was uploaded)
              dbProducts.forEach((p) => {
                const key = getProductKey(p);
                const defaultItem = mergedMap.get(key);
                if (defaultItem) {
                  const hasCustomUpload =
                    (p.images?.[0]?.src && (p.images[0].src.startsWith("/uploads/") || p.images[0].src.startsWith("http"))) ||
                    (p.storyImage && (p.storyImage.startsWith("/uploads/") || p.storyImage.startsWith("http")));

                  const validPrice = p.price && p.price > 0 ? p.price : defaultItem.price;
                  const validPriceDisplay = p.price && p.price > 0 ? p.priceDisplay : defaultItem.priceDisplay;

                  mergedMap.set(key, {
                    ...defaultItem,
                    ...p,
                    price: validPrice,
                    priceDisplay: validPriceDisplay,
                    images: hasCustomUpload ? p.images : defaultItem.images,
                    storyImage: hasCustomUpload ? p.storyImage : defaultItem.storyImage,
                  });
                } else {
                  const fallback = p.slug.includes("paan") ? 299 : p.slug.includes("ragi") ? 229 : p.slug.includes("almond") ? 749 : p.slug.includes("cashew") ? 649 : p.slug.includes("shampoo") ? 246 : 299;
                  const validPrice = p.price && p.price > 0 ? p.price : fallback;
                  mergedMap.set(key, {
                    ...p,
                    price: validPrice,
                    priceDisplay: p.price && p.price > 0 ? p.priceDisplay : `₹${validPrice}`,
                  });
                }
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
        const prod = get().products.find((p) => p.id === id || p.slug === id);
        const fallbackPrice = (prod?.slug || id).includes("paan")
          ? 299
          : (prod?.slug || id).includes("ragi")
          ? 229
          : (prod?.slug || id).includes("almond")
          ? 749
          : (prod?.slug || id).includes("cashew")
          ? 649
          : (prod?.slug || id).includes("shampoo")
          ? 246
          : 299;
        const currentPrice =
          prod?.price && prod.price > 0 ? prod.price : fallbackPrice;

        set((state) => ({
          products: state.products.map((p) =>
            p.id === id || p.slug === id
              ? {
                  ...p,
                  stock: newStock,
                  price: p.price > 0 ? p.price : currentPrice,
                  priceDisplay:
                    p.price > 0 ? p.priceDisplay : `₹${currentPrice}`,
                }
              : p
          ),
        }));

        try {
          const res = await fetch(
            `${API_BASE}/products/${encodeURIComponent(prod?.slug || id)}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                stock: newStock,
                isStockOnly: true,
                price: currentPrice,
                slug: prod?.slug,
                name: prod?.name,
              }),
            }
          );
          return res.ok;
        } catch (err) {
          console.warn("Could not update stock in DB:", err);
          return false;
        }
      },

      updateProduct: async (updatedProd: Product) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === updatedProd.id ||
            p.slug === updatedProd.slug ||
            p.name.toLowerCase() === updatedProd.name.toLowerCase()
              ? { ...p, ...updatedProd }
              : p
          ),
        }));

        try {
          const res = await fetch(
            `${API_BASE}/products/${encodeURIComponent(updatedProd.id || updatedProd.slug)}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedProd),
            }
          );
          if (res.ok) {
            await get().fetchProducts();
            return true;
          }
          const errData = await res.json().catch(() => ({}));
          console.error("Backend error updating product:", errData);
          return false;
        } catch (err) {
          console.warn("Could not update product in DB:", err);
          return false;
        }
      },

      deleteProduct: async (id: string, slug?: string, name?: string) => {
        set((state) => ({
          products: state.products.filter(
            (p) =>
              p.id !== id &&
              p.slug !== id &&
              (!slug || p.slug !== slug) &&
              (!name || p.name.toLowerCase() !== name.toLowerCase())
          ),
        }));

        try {
          const params = new URLSearchParams();
          if (slug) params.set("slug", slug);
          if (name) params.set("name", name);
          const qs = params.toString() ? `?${params.toString()}` : "";
          await fetch(`${API_BASE}/products/${encodeURIComponent(id)}${qs}`, {
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
      name: "dust_products_store_v4",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

