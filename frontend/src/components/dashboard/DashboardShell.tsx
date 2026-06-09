import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Briefcase,
  Mail,
  LayoutTemplate,
  CreditCard,
  Settings,
  Sparkles,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/resumes", label: "My Resumes", icon: FileText },
  { to: "/dashboard/ats", label: "ATS Analysis", icon: BarChart3 },
  { to: "/dashboard/job-matcher", label: "Job Matcher", icon: Briefcase },
  { to: "/dashboard/cover-letters", label: "Cover Letters", icon: Mail },
  { to: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLink({ to, label, icon: Icon, exact }: (typeof navItems)[0]) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = exact ? pathname === to : pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-display font-bold text-sm leading-none">
            CareerForge<span className="text-gradient"> Pro</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">AI Career Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2" onClick={onNavigate}>
        {navItems.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}
      </nav>

      <div className="mt-auto border-t border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Badge variant={user?.subscriptionPlan === "pro" ? "default" : "secondary"} className="shrink-0 capitalize">
            {user?.subscriptionPlan || "free"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-card/50 backdrop-blur-xl fixed inset-y-0 left-0">
          <div className="w-full p-4">
            <SidebarContent />
          </div>
        </aside>

        <div className="flex-1 lg:pl-64">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-8">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4">
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex-1" />
          </header>

          <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 lg:p-8"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}
