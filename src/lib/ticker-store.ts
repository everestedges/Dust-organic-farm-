import { create } from "zustand";

interface TickerState {
  items: string[];
  isLoading: boolean;
  fetchTicker: () => Promise<void>;
  updateTicker: (items: string[]) => Promise<boolean>;
}

const API_BASE =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5000/api";

export const DEFAULT_TICKER_ITEMS = [
  "DUST — CHOICE OF MOTHERLAND",
  "NOT MADE FOR EVERYONE • MADE FOR THOSE WHO CHOOSE BETTER",
  "WHOLESOME LADDOO PREMIX & DRY FRUITS",
  "PAAN DIGESTIVE SHOTS",
  "ZERO ADDED SUGAR",
  "100% NATURAL NUTRITION",
];

export const useTickerStore = create<TickerState>((set) => ({
  items: DEFAULT_TICKER_ITEMS,
  isLoading: false,

  fetchTicker: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/ticker`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          set({ items: data.items });
        }
      }
    } catch (err) {
      console.warn("Could not load ticker items:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateTicker: async (newItems: string[]) => {
    try {
      const res = await fetch(`${API_BASE}/ticker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          set({ items: newItems });
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Error updating ticker items:", err);
      return false;
    }
  },
}));
