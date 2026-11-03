import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id?: number;
  name: string;
  email: string;
  role: "admin";
}

interface AdminAuthState {
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminError: string | null;

  adminLogin: (email: string, pass: string) => Promise<boolean>;
  adminLogout: () => void;
  setAdminError: (err: string | null) => void;
}

const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5000/api";

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminUser: null,
      isAdminLoggedIn: false,
      adminError: null,

      adminLogin: async (email: string, pass: string) => {
        set({ adminError: null });

        // Hardcoded master admin credentials check
        if (email.toLowerCase() === "admin@dustofficial.com" && pass === "DustAdmin@2026") {
          const masterAdmin: AdminUser = {
            id: 1,
            name: "Everest Edges Admin",
            email: "admin@dustofficial.com",
            role: "admin",
          };
          set({
            adminUser: masterAdmin,
            isAdminLoggedIn: true,
            adminError: null,
          });
          return true;
        }

        try {
          // Attempt MySQL backend admin login API call
          const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: pass }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            set({
              adminUser: data.user,
              isAdminLoggedIn: true,
              adminError: null,
            });
            return true;
          } else {
            set({ adminError: data.message || "Invalid Admin email or password." });
          }
        } catch (err) {
          console.warn("⚠️ Admin API server offline. Checked local admin credentials.");
          set({ adminError: "Invalid Admin credentials. Use admin@dustofficial.com / DustAdmin@2026" });
        }

        return false;
      },

      adminLogout: () => {
        set({
          adminUser: null,
          isAdminLoggedIn: false,
          adminError: null,
        });
      },

      setAdminError: (err) => {
        set({ adminError: err });
      },
    }),
    {
      name: "dust_admin_auth_storage",
      partialize: (state) => ({
        adminUser: state.adminUser,
        isAdminLoggedIn: state.isAdminLoggedIn,
      }),
    }
  )
);
