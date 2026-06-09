import { createFileRoute } from "@tanstack/react-router";
import { Settings, Moon, Sun, Monitor } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={user?.name || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} readOnly />
          </div>
          <div className="flex items-center gap-2">
            <Label>Plan</Label>
            <Badge className="capitalize">{user?.subscriptionPlan || "free"}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {([
            { value: "light" as const, icon: Sun, label: "Light" },
            { value: "dark" as const, icon: Moon, label: "Dark" },
            { value: "system" as const, icon: Monitor, label: "System" },
          ]).map(({ value, icon: Icon, label }) => (
            <Button key={value} variant={theme === value ? "default" : "outline"} onClick={() => setTheme(value)} className="flex-1">
              <Icon className="h-4 w-4" /> {label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
