import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — CareerForge Pro" }] }),
  component: Signup,
});

function Signup() {
  return <AuthShell mode="signup" />;
}

export function AuthShell({ mode }: { mode: "signup" | "login" }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (isSignup && password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await register(name, email, password);
        toast.success("Account created. Welcome!");
        navigate({ to: "/dashboard" });
      } else {
        await login(email, password);
        toast.success("Signed in");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">
              CareerForge<span className="text-gradient"> Pro</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {isSignup
              ? "Start optimizing your resume in under 60 seconds."
              : "Sign in to continue building your career."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
              </div>
            )}

            <Button type="submit" size="lg" variant="hero" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {isSignup ? "Creating..." : "Signing in..."}</>
              ) : (
                <>{isSignup ? "Create Account" : "Sign In"} <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 text-sm text-center text-muted-foreground">
            {isSignup ? (
              <>Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link></>
            ) : (
              <>New here? <Link to="/signup" className="text-primary font-semibold hover:underline">Create an account</Link></>
            )}
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 noise opacity-30" />
        <div className="relative h-full grid place-items-center p-12 text-primary-foreground">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full glass-strong px-3 py-1 text-xs font-semibold text-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-Powered
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight">
              Beat the bots. Impress the recruiters.
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Join 50,000+ professionals using CareerForge to land 3× more interviews.
            </p>
            <div className="mt-8 space-y-3">
              {["94% avg ATS score", "Unlimited AI rewrites on Pro", "Pixel-perfect PDF export"].map((s) => (
                <div key={s} className="flex items-center gap-3 rounded-xl glass-strong text-foreground px-4 py-3">
                  <div className="h-6 w-6 rounded-md bg-gradient-primary grid place-items-center">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
