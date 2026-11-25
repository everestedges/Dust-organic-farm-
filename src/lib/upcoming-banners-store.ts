import { create } from "zustand";

export interface UpcomingBanner {
  id: number;
  title: string;
  subtitle?: string;
  tagline?: string;
  launch_date?: string;
  image_url: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
  display_order?: number;
  is_active?: boolean | number;
  created_at?: string;
}

export const DEFAULT_UPCOMING_BANNERS: UpcomingBanner[] = [
  {
    id: 1,
    title: "Dragon Berry Blast Fruit Drink Powder",
    subtitle: "Real Fruit Goodness • Instant Refreshment • Energizing & Reviving",
    tagline: "COMING SOON",
    launch_date: "Expected Launch: Q1 2027",
    image_url: "/banners/dragon-berry-blast-upcoming.jpg",
    description: "Pure dried dragon fruit, strawberries & blueberries. Just add water, shake and energize your day.",
    cta_text: "Stay Tuned",
    cta_link: "/contact",
    display_order: 1,
    is_active: 1,
  },
];

interface UpcomingBannersState {
  banners: UpcomingBanner[];
  isLoading: boolean;
  fetchBanners: (all?: boolean) => Promise<void>;
  createBanner: (banner: Omit<UpcomingBanner, "id">) => Promise<boolean>;
  updateBanner: (id: number, banner: Partial<UpcomingBanner>) => Promise<boolean>;
  deleteBanner: (id: number) => Promise<boolean>;
}

const API_BASE =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5000/api";

export const useUpcomingBannersStore = create<UpcomingBannersState>((set, get) => ({
  banners: DEFAULT_UPCOMING_BANNERS,
  isLoading: false,

  fetchBanners: async (all = false) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/upcoming-banners${all ? "?all=true" : ""}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.banners)) {
          if (data.banners.length > 0) {
            set({ banners: data.banners });
          } else if (!all) {
            set({ banners: DEFAULT_UPCOMING_BANNERS });
          } else {
            set({ banners: [] });
          }
        }
      }
    } catch (err) {
      console.warn("Could not load upcoming banners from server:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  createBanner: async (newBanner) => {
    try {
      const res = await fetch(`${API_BASE}/upcoming-banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        await get().fetchBanners(true);
        return true;
      }
    } catch (err) {
      console.error("Create upcoming banner failed:", err);
    }
    return false;
  },

  updateBanner: async (id, updatedFields) => {
    try {
      const res = await fetch(`${API_BASE}/upcoming-banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        await get().fetchBanners(true);
        return true;
      }
    } catch (err) {
      console.error("Update upcoming banner failed:", err);
    }
    return false;
  },

  deleteBanner: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/upcoming-banners/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        }));
        return true;
      }
    } catch (err) {
      console.error("Delete upcoming banner failed:", err);
    }
    return false;
  },
}));
