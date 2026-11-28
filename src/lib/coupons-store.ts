import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Coupon {
  id: number | string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  maxDiscount?: number | null;
  expiryDate?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export type CouponInput = Omit<Coupon, "id" | "createdAt">;

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 1,
    code: "PANINDIA15",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 500,
    expiryDate: "2026-12-31",
    description: "15% OFF on orders above ₹500 across India",
    isActive: true,
  },
  {
    id: 2,
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 299,
    expiryDate: "2026-12-31",
    description: "10% OFF on your first wellness order above ₹299",
    isActive: true,
  },
  {
    id: 3,
    code: "DUST50",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 499,
    expiryDate: "2026-12-31",
    description: "Flat ₹50 Instant Cashback/Discount on orders above ₹499",
    isActive: true,
  },
];

interface CouponsStore {
  coupons: Coupon[];
  isLoading: boolean;
  fetchCoupons: (isAdmin?: boolean) => Promise<void>;
  addCoupon: (data: CouponInput) => Promise<boolean>;
  updateCoupon: (id: number | string, data: Partial<Coupon> & { originalCode?: string | undefined }) => Promise<boolean>;
  deleteCoupon: (id: number | string) => Promise<boolean>;
  toggleCouponActive: (id: number | string) => Promise<boolean>;
  validateCoupon: (
    code: string,
    subtotal: number
  ) => {
    isValid: boolean;
    discountAmount: number;
    message: string;
    coupon?: Coupon;
  };
}

const getApiBase = () =>
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5000/api";

export const useCouponsStore = create<CouponsStore>()(
  persist(
    (set, get) => ({
      coupons: DEFAULT_COUPONS,
      isLoading: false,

      fetchCoupons: async (isAdmin = false) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${getApiBase()}/coupons${isAdmin ? "?all=true" : ""}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.coupons) && data.coupons.length > 0) {
              set({ coupons: data.coupons });
            }
          }
        } catch (e) {
          console.warn("Could not fetch remote coupons, using cached/local store:", e);
        } finally {
          set({ isLoading: false });
        }
      },

      addCoupon: async (data: CouponInput) => {
        const cleanCode = data.code.trim().toUpperCase();
        const newLocal: Coupon = {
          ...data,
          code: cleanCode,
          id: Date.now(),
        };

        // Optimistically update local store
        set((state) => ({
          coupons: [newLocal, ...state.coupons.filter((c) => c.code !== cleanCode)],
        }));

        try {
          const res = await fetch(`${getApiBase()}/coupons`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const result = await res.json().catch(() => null);
            if (result?.success) {
              await get().fetchCoupons(true);
              return true;
            }
          }
        } catch (err) {
          console.error("Failed to sync coupon to database:", err);
        }
        return true;
      },

      updateCoupon: async (id: number | string, updates: Partial<Coupon> & { originalCode?: string | undefined }) => {
        const cleanCode = updates.code ? updates.code.trim().toUpperCase() : undefined;
        // Optimistically update local store
        set((state) => ({
          coupons: state.coupons.map((c) =>
            String(c.id) === String(id) ||
            (updates.originalCode && c.code === updates.originalCode) ||
            (cleanCode && c.code === cleanCode) ||
            c.code === String(id)
              ? {
                  ...c,
                  ...updates,
                  code: cleanCode || c.code,
                }
              : c
          ),
        }));

        try {
          const res = await fetch(`${getApiBase()}/coupons/${encodeURIComponent(String(id))}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data?.success) {
              await get().fetchCoupons(true);
              return true;
            }
          }
        } catch (err) {
          console.error("Failed to update coupon on server:", err);
          return false;
        }
        return false;
      },

      deleteCoupon: async (id: number | string) => {
        set((state) => ({
          coupons: state.coupons.filter(
            (c) => String(c.id) !== String(id) && c.code !== String(id)
          ),
        }));

        try {
          const res = await fetch(`${getApiBase()}/coupons/${encodeURIComponent(String(id))}`, {
            method: "DELETE",
          });
          if (res.ok) {
            await get().fetchCoupons(true);
            return true;
          }
        } catch (err) {
          console.error("Failed to delete coupon on server:", err);
          return false;
        }
        return false;
      },

      toggleCouponActive: async (id: number | string) => {
        const target = get().coupons.find(
          (c) => String(c.id) === String(id) || c.code === String(id)
        );
        if (!target) return false;
        const newActive = !target.isActive;
        return get().updateCoupon(id, { isActive: newActive });
      },

      validateCoupon: (code: string, subtotal: number) => {
        if (!code || !code.trim()) {
          return { isValid: false, discountAmount: 0, message: "Please enter a coupon code." };
        }

        const clean = code.trim().toUpperCase();
        const coupon = get().coupons.find((c) => c.code.toUpperCase() === clean);

        if (!coupon) {
          return {
            isValid: false,
            discountAmount: 0,
            message: `Coupon "${clean}" is invalid or does not exist.`,
          };
        }

        if (!coupon.isActive) {
          return {
            isValid: false,
            discountAmount: 0,
            message: `Coupon "${clean}" is currently inactive.`,
          };
        }

        // Check expiry date
        if (coupon.expiryDate) {
          const exp = new Date(coupon.expiryDate);
          exp.setHours(23, 59, 59, 999);
          if (exp.getTime() < Date.now()) {
            return {
              isValid: false,
              discountAmount: 0,
              message: `Coupon "${clean}" expired on ${coupon.expiryDate}.`,
            };
          }
        }

        // Check minimum order amount
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          const needed = coupon.minOrderAmount - subtotal;
          return {
            isValid: false,
            discountAmount: 0,
            message: `Coupon requires minimum order of ₹${coupon.minOrderAmount}. Add ₹${needed} more to apply.`,
          };
        }

        // Calculate discount
        let calculated = 0;
        if (coupon.discountType === "percentage") {
          calculated = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && calculated > coupon.maxDiscountAmount) {
            calculated = coupon.maxDiscountAmount;
          }
        } else {
          calculated = Math.min(coupon.discountValue, subtotal);
        }

        return {
          isValid: true,
          discountAmount: calculated,
          message: `Success! ${
            coupon.discountType === "percentage"
              ? `${coupon.discountValue}% discount applied (-₹${calculated})`
              : `₹${calculated} flat discount applied!`
          }`,
          coupon,
        };
      },
    }),
    {
      name: "dust_coupons_store_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
