import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, BarChart3, Mail, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { billingApi } from "@/lib/api/billing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const statConfig = [
  { key: "totalResumes", label: "Total Resumes", icon: FileText, color: "text-primary" },
  { key: "avgAtsScore", label: "Avg ATS Score", icon: BarChart3, color: "text-secondary", suffix: "%" },
  { key: "totalCoverLetters", label: "Cover Letters", icon: Mail, color: "text-accent" },
  { key: "totalOptimizations", label: "Optimizations", icon: TrendingUp, color: "text-success" },
] as const;

function DashboardHome() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => billingApi.getDashboard() as Promise<{ success: boolean; data: DashboardData }>,
  });

  const dashboard = data?.data;
  const analytics = dashboard?.analytics;

  const chartData = [
    { month: "Jan", resumes: 2, score: 72 },
    { month: "Feb", resumes: 4, score: 78 },
    { month: "Mar", resumes: analytics?.totalResumes || 3, score: analytics?.avgAtsScore || 81 },
    { month: "Apr", resumes: (analytics?.totalResumes || 0) + 1, score: Math.min((analytics?.avgAtsScore || 75) + 5, 98) },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Welcome back{dashboard?.user?.name ? `, ${dashboard.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">Your AI-powered career command center</p>
        </div>
        <Button variant="hero" asChild>
          <Link to="/dashboard/resumes">
            <Sparkles className="h-4 w-4" /> New Resume <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat, i) => (
          <motion.div key={stat.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass shadow-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold font-display">
                    {analytics?.[stat.key] ?? 0}{stat.suffix || ""}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Resume uploads and ATS score trends</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="url(#scoreGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Resumes</CardTitle>
            <CardDescription>Your latest uploads and optimizations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
            ) : dashboard?.recentResumes?.length ? (
              dashboard.recentResumes.map((r) => (
                <Link
                  key={r._id}
                  to="/dashboard/resumes/$id"
                  params={{ id: r._id }}
                  className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate">{r.originalName}</span>
                  </div>
                  {r.atsScore != null && (
                    <Badge variant={r.atsScore >= 80 ? "default" : "secondary"}>{r.atsScore}%</Badge>
                  )}
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No resumes yet. Upload your first resume to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
