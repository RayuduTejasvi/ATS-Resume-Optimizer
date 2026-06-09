import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => localStorage.setItem("cf_access_token", token),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login({ email, password });
          localStorage.setItem("cf_access_token", res.data.accessToken);
          set({ user: res.data.user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register({ name, email, password });
          localStorage.setItem("cf_access_token", res.data.accessToken);
          set({ user: res.data.user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          localStorage.removeItem("cf_access_token");
          set({ user: null, isAuthenticated: false });
        }
      },

      fetchUser: async () => {
        const token = localStorage.getItem("cf_access_token");
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        set({ isLoading: true });
        try {
          const res = await authApi.me();
          set({ user: res.data.user, isAuthenticated: true });
        } catch {
          localStorage.removeItem("cf_access_token");
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "cf-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
