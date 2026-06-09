import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { resumesApi } from "@/lib/api/resumes";
import { aiApi } from "@/lib/api/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/job-matcher")({
  component: JobMatcherPage,
});

interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  matchPercentage: number;
  missingSkills: string[];
  matchedSkills: string[];
  learningPaths: string[];
  recommendations: string[];
}

function JobMatcherPage() {
  const [resumeId, setResumeId] = useState("");
  const [matches, setMatches] = useState<JobMatch[]>([]);

  const { data: resumesData } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumesApi.list(),
  });

  const matchMutation = useMutation({
    mutationFn: () => aiApi.jobMatch(resumeId) as Promise<{ data: { matches: JobMatch[] } }>,
    onSuccess: (res) => {
      setMatches(res.data?.matches || []);
      toast.success("Job matching complete");
    },
    onError: (e: Error) => toast.error(e.message || "Matching failed"),
  });

  const resumes = resumesData?.data?.resumes || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Job Matcher</h1>
        <p className="text-muted-foreground mt-1">AI-powered job fit analysis using vector similarity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Find Matching Jobs</CardTitle>
          <CardDescription>Matches your resume against saved job descriptions using semantic search</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Resume</Label>
            <Select value={resumeId} onValueChange={setResumeId}>
              <SelectTrigger><SelectValue placeholder="Choose a resume" /></SelectTrigger>
              <SelectContent>
                {resumes.map((r) => (
                  <SelectItem key={r._id} value={r._id}>{r.originalName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="hero" disabled={!resumeId || matchMutation.isPending} onClick={() => matchMutation.mutate()}>
            {matchMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
            Find Matches
          </Button>
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <div className="space-y-4">
          {matches.map((match, i) => (
            <motion.div key={match.jobId || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{match.title}</CardTitle>
                      <CardDescription>{match.company}</CardDescription>
                    </div>
                    <Badge variant={match.matchPercentage >= 75 ? "default" : "secondary"} className="text-base px-3">
                      {match.matchPercentage}%
                    </Badge>
                  </div>
                  <Progress value={match.matchPercentage} className="h-2 mt-3" />
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium mb-2">Matched Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {match.matchedSkills?.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Missing Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {match.missingSkills?.map((s) => <Badge key={s} variant="destructive">{s}</Badge>)}
                    </div>
                  </div>
                  {match.learningPaths?.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium mb-2 flex items-center gap-1"><BookOpen className="h-4 w-4" /> Learning Paths</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {match.learningPaths.map((p, j) => <li key={j}>• {p}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {matches.length === 0 && !matchMutation.isPending && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            Analyze job descriptions in ATS Analysis first, then run job matching here.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
