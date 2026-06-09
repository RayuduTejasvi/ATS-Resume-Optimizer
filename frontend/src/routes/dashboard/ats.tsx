import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Loader2, Target, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { resumesApi } from "@/lib/api/resumes";
import { aiApi } from "@/lib/api/ai";
import type { ATSScore } from "@/lib/api/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

export const Route = createFileRoute("/dashboard/ats")({
  component: ATSPage,
});

function ScoreRing({ score }: { score: number }) {
  const data = [{ name: "score", value: score, fill: score >= 80 ? "hsl(var(--success))" : score >= 60 ? "hsl(var(--primary))" : "hsl(var(--destructive))" }];
  return (
    <ResponsiveContainer width={160} height={160}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={data} startAngle={90} endAngle={-270}>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background dataKey="value" cornerRadius={6} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-bold">
          {score}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

function ATSPage() {
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ATSScore | null>(null);

  const { data: resumesData } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumesApi.list(),
  });

  const analyzeMutation = useMutation({
    mutationFn: () => aiApi.calculateScore(resumeId, jobDescription) as Promise<{ data: ATSScore }>,
    onSuccess: (res) => {
      setResult(res.data);
      toast.success("ATS analysis complete");
    },
    onError: (e: Error) => toast.error(e.message || "Analysis failed"),
  });

  const optimizeMutation = useMutation({
    mutationFn: () => aiApi.optimizeResume(resumeId, jobDescription),
    onSuccess: () => toast.success("Resume optimized! Check My Resumes."),
    onError: (e: Error) => toast.error(e.message || "Optimization failed"),
  });

  const resumes = resumesData?.data?.resumes || [];
  const subscores = result?.subscores;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">ATS Analysis</h1>
        <p className="text-muted-foreground mt-1">Score your resume against any job description</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Analyze Resume</CardTitle>
          <CardDescription>Select a resume and paste the target job description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Resume</Label>
            <Select value={resumeId} onValueChange={setResumeId}>
              <SelectTrigger><SelectValue placeholder="Select resume" /></SelectTrigger>
              <SelectContent>
                {resumes.map((r) => (
                  <SelectItem key={r._id} value={r._id}>{r.originalName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea rows={8} placeholder="Paste the full job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button
              variant="hero"
              disabled={!resumeId || !jobDescription.trim() || analyzeMutation.isPending}
              onClick={() => analyzeMutation.mutate()}
            >
              {analyzeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
              Calculate ATS Score
            </Button>
            {result && (
              <Button variant="outline" disabled={optimizeMutation.isPending} onClick={() => optimizeMutation.mutate()}>
                {optimizeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Optimize Resume"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col items-center justify-center py-8">
            <CardHeader className="text-center pb-0">
              <CardTitle>Overall ATS Score</CardTitle>
            </CardHeader>
            <CardContent><ScoreRing score={result.overallScore} /></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Subscores</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {subscores && Object.entries(subscores).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium">{val}%</span>
                  </div>
                  <Progress value={val} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Matched Keywords</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.matchedKeywords?.map((kw) => <Badge key={kw} variant="default">{kw}</Badge>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-destructive" /> Missing Keywords</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.missingKeywords?.map((kw) => <Badge key={kw} variant="outline">{kw}</Badge>)}
            </CardContent>
          </Card>

          {result.recommendations?.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 text-sm"><span className="text-primary">•</span>{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
