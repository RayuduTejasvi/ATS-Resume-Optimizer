import { api } from "./client";
import type { User } from "./types";

interface AuthResponse {
  success: boolean;
  data: { user: User; accessToken: string };
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    api<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () => api("/auth/logout", { method: "POST" }),

  me: () => api<{ success: boolean; data: { user: User } }>("/auth/me"),

  forgotPassword: (email: string) =>
    api("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  resetPassword: (token: string, password: string) =>
    api("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
};
