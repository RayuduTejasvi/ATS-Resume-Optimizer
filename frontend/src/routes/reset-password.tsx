import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || "",
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) { toast.error("Invalid reset link"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      toast.success("Password reset! Please sign in.");
      navigate({ to: "/login" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background p-8">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-10">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">CareerForge<span className="text-gradient"> Pro</span></span>
        </Link>
        <h1 className="font-display text-3xl font-bold">Reset password</h1>
        <p className="mt-2 text-muted-foreground text-sm">Enter your new password below.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <Button type="submit" size="lg" variant="hero" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>
      </div>
    </div>
  );
}
