import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("cf_access_token") : null;
    if (!token) throw redirect({ to: "/login" });
  },
  component: DashboardShell,
});
