import { api } from "./client";

export const billingApi = {
  createCheckout: () =>
    api<{ success: boolean; data: { checkoutUrl: string } }>("/billing/checkout", { method: "POST" }),

  getSubscription: () => api("/billing/subscription"),

  cancel: () => api("/billing/cancel", { method: "POST" }),

  getDashboard: () => api("/dashboard"),

  getTemplates: () => api("/templates"),

  generatePDF: (resumeId: string, templateSlug = "modern") =>
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/pdf/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("cf_access_token")}`,
      },
      credentials: "include",
      body: JSON.stringify({ resumeId, templateSlug }),
    }),
};
