import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LayoutTemplate, Lock, Check } from "lucide-react";
import { billingApi } from "@/lib/api/billing";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/templates")({
  component: TemplatesPage,
});

interface Template {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  isPremium: boolean;
}

function TemplatesPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => billingApi.getTemplates() as Promise<{ data: { templates: Template[] } }>,
  });

  const templates = data?.data?.templates || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Resume Templates</h1>
        <p className="text-muted-foreground mt-1">ATS-friendly professional templates</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => {
            const locked = t.isPremium && user?.subscriptionPlan !== "pro";
            return (
              <motion.div key={t._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`group hover:shadow-card transition-all ${locked ? "opacity-80" : ""}`}>
                  <CardHeader>
                    <div className="h-32 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border flex items-center justify-center mb-2">
                      <LayoutTemplate className="h-10 w-10 text-primary/40" />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      {t.isPremium ? (
                        <Badge variant="secondary"><Lock className="h-3 w-3" /> Pro</Badge>
                      ) : (
                        <Badge variant="outline"><Check className="h-3 w-3" /> Free</Badge>
                      )}
                    </div>
                    <CardDescription>{t.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {locked ? (
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/dashboard/billing">Upgrade to Pro</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/dashboard/resumes">Use Template</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
