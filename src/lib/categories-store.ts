import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  desc?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  count?: number;
  createdAt?: string;
}

export interface PackageVariant {
  id: number | string;
  name: string;
  subtitle?: string;
  price?: number | null;
  displayOrder?: number;
  createdAt?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Wholesome Laddoo Premix",
    slug: "wholesome-millets",
    desc: "Traditional millet mixes and dry fruit laddoo premixes with zero added sugar.",
    description: "Traditional millet mixes and dry fruit laddoo premixes with zero added sugar.",
    displayOrder: 1,
    isActive: true,
    count: 1,
  },
  {
    id: 2,
    name: "Heritage Wellness",
    slug: "heritage-wellness",
    desc: "Post-meal digestive mixes and royal paan shots inspired by Banaras traditions.",
    description: "Post-meal digestive mixes and royal paan shots inspired by Banaras traditions.",
    displayOrder: 2,
    isActive: true,
    count: 1,
  },
  {
    id: 3,
    name: "Pure Fruit Powders",
    slug: "pure-fruit-powders",
    desc: "100% pure freeze-dried fruit powders with zero preservatives.",
    description: "100% pure freeze-dried fruit powders with zero preservatives.",
    displayOrder: 3,
    isActive: true,
    count: 0,
  },
  {
    id: 4,
    name: "Pure Nut Powders",
    slug: "pure-nut-powders",
    desc: "Stone-ground almond & cashew powders rich in natural oils.",
    description: "Stone-ground almond & cashew powders rich in natural oils.",
    displayOrder: 4,
    isActive: true,
    count: 0,
  },
  {
    id: 5,
    name: "Herbal Haircare",
    slug: "herbal-haircare",
    desc: "Ayurvedic herbal cleansing powders and scalp nourishment.",
    description: "Ayurvedic herbal cleansing powders and scalp nourishment.",
    displayOrder: 5,
    isActive: true,
    count: 0,
  },
];

export const DEFAULT_VARIANTS: PackageVariant[] = [
  {
    id: 1,
    name: "20g Digestive Pouch",
    subtitle: "Makes 4 After-Meal Shots",
    price: 249,
    displayOrder: 1,
  },
  {
    id: 2,
    name: "100g Cooler Pack",
    subtitle: "Makes 10 Refreshment Drinks",
    price: 199,
    displayOrder: 2,
  },
  {
    id: 3,
    name: "200g Standard Pouch",
    subtitle: "Makes 20 Daily Servings",
    price: 299,
    displayOrder: 3,
  },
  {
    id: 4,
    name: "500g Value Pack",
    subtitle: "Family Monthly Wellness Pack",
    price: 699,
    displayOrder: 4,
  },
];

interface CategoriesStore {
  categories: Category[];
  variants: PackageVariant[];
  isLoading: boolean;
  fetchCategories: (all?: boolean) => Promise<void>;
  addCategory: (data: Omit<Category, "id">) => Promise<boolean>;
  updateCategory: (id: number | string, data: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: number | string) => Promise<boolean>;
  fetchVariants: () => Promise<void>;
  addVariant: (data: Omit<PackageVariant, "id">) => Promise<boolean>;
  updateVariant: (id: number | string, data: Partial<PackageVariant>) => Promise<boolean>;
  deleteVariant: (id: number | string) => Promise<boolean>;
}

const API_BASE =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5000/api";

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      variants: DEFAULT_VARIANTS,
      isLoading: false,

      fetchCategories: async (all = true) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE}/categories${all ? "?all=true" : ""}`, {
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.categories)) {
              if (data.categories.length > 0) {
                set({ categories: data.categories });
              } else {
                set({ categories: DEFAULT_CATEGORIES });
              }
            }
          }
        } catch (err) {
          console.warn("Could not load categories from server:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      addCategory: async (catData) => {
        try {
          const res = await fetch(`${API_BASE}/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(catData),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success && data.category) {
            set((state) => ({
              categories: [...state.categories, data.category],
            }));
            await get().fetchCategories(true);
            return true;
          } else {
            alert(`Failed to add category: ${data.error || "Unknown server error"}`);
          }
        } catch (err: any) {
          console.error("Create category error:", err);
          // Local fallback
          const newId = Date.now();
          const cleanSlug = catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const newCat: Category = {
            id: newId,
            name: catData.name,
            slug: cleanSlug,
            desc: catData.desc || catData.description || "",
            description: catData.desc || catData.description || "",
            displayOrder: catData.displayOrder || get().categories.length + 1,
            isActive: catData.isActive !== false,
            count: 0,
          };
          set((state) => ({
            categories: [...state.categories, newCat],
          }));
          return true;
        }
        return false;
      },

      updateCategory: async (id, updatedFields) => {
        try {
          const res = await fetch(`${API_BASE}/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            set((state) => ({
              categories: state.categories.map((c) =>
                String(c.id) === String(id) || c.slug === String(id)
                  ? { ...c, ...updatedFields }
                  : c
              ),
            }));
            await get().fetchCategories(true);
            return true;
          }
        } catch (err) {
          console.error("Update category error:", err);
        }
        // Fallback update local state so UI never fails even if offline
        set((state) => ({
          categories: state.categories.map((c) =>
            String(c.id) === String(id) || c.slug === String(id)
              ? { ...c, ...updatedFields }
              : c
          ),
        }));
        return true;
      },

      deleteCategory: async (id) => {
        try {
          const res = await fetch(`${API_BASE}/categories/${id}`, {
            method: "DELETE",
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            set((state) => ({
              categories: state.categories.filter(
                (c) => String(c.id) !== String(id) && c.slug !== String(id)
              ),
            }));
            return true;
          }
        } catch (err) {
          console.error("Delete category error:", err);
        }
        set((state) => ({
          categories: state.categories.filter(
            (c) => String(c.id) !== String(id) && c.slug !== String(id)
          ),
        }));
        return true;
      },

      fetchVariants: async () => {
        try {
          const res = await fetch(`${API_BASE}/variants`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.variants)) {
              if (data.variants.length > 0) {
                set({ variants: data.variants });
              } else {
                set({ variants: DEFAULT_VARIANTS });
              }
            }
          }
        } catch (err) {
          console.warn("Could not load variants from server:", err);
        }
      },

      addVariant: async (varData) => {
        try {
          const res = await fetch(`${API_BASE}/variants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(varData),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success && data.variant) {
            set((state) => ({
              variants: [...state.variants, data.variant],
            }));
            return true;
          }
        } catch (err) {
          console.error("Create variant error:", err);
          const newVar: PackageVariant = {
            id: Date.now(),
            name: varData.name,
            subtitle: varData.subtitle || "",
            price: varData.price ?? null,
            displayOrder: varData.displayOrder || get().variants.length + 1,
          };
          set((state) => ({
            variants: [...state.variants, newVar],
          }));
          return true;
        }
        return false;
      },

      updateVariant: async (id, updatedFields) => {
        try {
          const res = await fetch(`${API_BASE}/variants/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            set((state) => ({
              variants: state.variants.map((v) =>
                String(v.id) === String(id) ? { ...v, ...updatedFields } : v
              ),
            }));
            return true;
          }
        } catch (err) {
          console.error("Update variant error:", err);
        }
        set((state) => ({
          variants: state.variants.map((v) =>
            String(v.id) === String(id) ? { ...v, ...updatedFields } : v
          ),
        }));
        return true;
      },

      deleteVariant: async (id) => {
        try {
          const res = await fetch(`${API_BASE}/variants/${id}`, {
            method: "DELETE",
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            set((state) => ({
              variants: state.variants.filter((v) => String(v.id) !== String(id)),
            }));
            return true;
          }
        } catch (err) {
          console.error("Delete variant error:", err);
        }
        set((state) => ({
          variants: state.variants.filter((v) => String(v.id) !== String(id)),
        }));
        return true;
      },
    }),
    {
      name: "dust_categories_store_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
