import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "./data";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string | undefined;
}

interface CartStore {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  isCartOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;

  // Cart actions
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View actions
  setQuickViewProduct: (product: Product | null) => void;

  // Search actions
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;

  // Computations
  getTotalItems: () => number;
  getSubtotal: () => number;
}

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      isSearchOpen: false,
      quickViewProduct: null,
      hasHydrated: false,

      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),

      addToCart: (product, quantity = 1, selectedVariant) => {
        if (product.stock !== undefined && product.stock <= 0) {
          alert("Sorry, this item is currently out of stock.");
          return;
        }
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.product.id === product.id
          );
          let newCart: CartItem[];

          if (existingIndex > -1) {
            newCart = state.cart.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = selectedVariant !== undefined
              ? { product, quantity, selectedVariant }
              : { product, quantity };
            newCart = [...state.cart, newItem];
          }

          return { cart: newCart, isCartOpen: true };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.product.id === productId) {
              const maxStock =
                item.product.stock !== undefined ? item.product.stock : 999;
              return { ...item, quantity: Math.min(quantity, maxStock) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ cart: [] }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          const newWishlist = exists
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId];
          return { wishlist: newWishlist };
        });
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      setSearchOpen: (open) => set({ isSearchOpen: open }),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "dust-commerce-cart-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : dummyStorage
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
