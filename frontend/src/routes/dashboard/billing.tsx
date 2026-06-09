import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreditCard, Check, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { billingApi } from "@/lib/api/billing";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

const plans = [
  { id: "free", name: "Free", price: "$0", features: ["1 Resume optimization", "Basic ATS score", "1 Cover letter"] },
  { id: "pro", name: "Pro", price: "$9.99/mo", features: ["Unlimited resumes", "Unlimited ATS analysis", "Cover letters", "Premium templates", "Job matching"] },
];

function BillingPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => billingApi.getSubscription(),
  });

  const checkoutMutation = useMutation({
    mutationFn: () => billingApi.createCheckout(),
    onSuccess: (res: { data?: { checkoutUrl?: string } }) => {
      if (res.data?.checkoutUrl) window.location.href = res.data.checkoutUrl;
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMutation = useMutation({
    mutationFn: () => billingApi.cancel(),
    onSuccess: () => toast.success("Subscription will cancel at period end"),
    onError: (e: Error) => toast.error(e.message),
  });

  const sub = (data as { data?: { subscription?: { plan: string; status: string; cancelAtPeriodEnd?: boolean }; billingHistory?: Array<{ amount: number; createdAt: string; status: string }> } })?.data;
  const history = sub?.billingHistory || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and invoices</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan, i) => {
          const isCurrent = user?.subscriptionPlan === plan.id;
          return (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={isCurrent ? "border-primary shadow-glow" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {plan.id === "pro" && <Crown className="h-5 w-5 text-primary" />}
                      {plan.name}
                    </CardTitle>
                    {isCurrent && <Badge>Current</Badge>}
                  </div>
                  <CardDescription className="text-2xl font-bold text-foreground">{plan.price}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success shrink-0" />{f}</li>
                    ))}
                  </ul>
                  {plan.id === "pro" && !isCurrent && (
                    <Button variant="hero" className="w-full" disabled={checkoutMutation.isPending} onClick={() => checkoutMutation.mutate()}>
                      {checkoutMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                      Upgrade to Pro
                    </Button>
                  )}
                  {isCurrent && plan.id === "pro" && (
                    <Button variant="outline" className="w-full" disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
                      Cancel Subscription
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Invoice History</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-20" /> : history.length ? (
            <div className="space-y-2">
              {history.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0 text-sm">
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  <span className="font-medium">${(p.amount / 100).toFixed(2)}</span>
                  <Badge variant="outline" className="capitalize">{p.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No invoices yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
