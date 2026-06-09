import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, Loader2, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { resumesApi } from "@/lib/api/resumes";
import { aiApi, streamAI } from "@/lib/api/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard/cover-letters")({
  component: CoverLettersPage,
});

function CoverLettersPage() {
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [tone, setTone] = useState("professional");
  const [content, setContent] = useState("");
  const [streaming, setStreaming] = useState(false);

  const { data: resumesData } = useQuery({ queryKey: ["resumes"], queryFn: () => resumesApi.list() });
  const { data: lettersData, isLoading } = useQuery({ queryKey: ["cover-letters"], queryFn: () => aiApi.getCoverLetters() });

  const generateMutation = useMutation({
    mutationFn: () => aiApi.generateCoverLetter({ resumeId, jobDescription, companyName, jobTitle, tone }),
    onSuccess: (res: { data?: { content?: string } }) => {
      setContent(res.data?.content || "");
      toast.success("Cover letter generated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleStream = () => {
    if (!resumeId || !jobDescription.trim()) return;
    setContent("");
    setStreaming(true);
    const prompt = `Write a ${tone} cover letter for ${jobTitle} at ${companyName}. Job: ${jobDescription.substring(0, 2000)}`;
    streamAI(
      prompt,
      (text) => setContent((prev) => prev + text),
      () => setStreaming(false),
      () => { setStreaming(false); toast.error("Stream failed"); },
    );
  };

  const resumes = resumesData?.data?.resumes || [];
  const letters = (lettersData as { data?: { coverLetters?: Array<{ _id: string; companyName?: string; jobTitle?: string; content: string; createdAt: string }> } })?.data?.coverLetters || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Cover Letters</h1>
        <p className="text-muted-foreground mt-1">AI-generated personalized cover letters</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Generate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Resume</Label>
              <Select value={resumeId} onValueChange={setResumeId}>
                <SelectTrigger><SelectValue placeholder="Select resume" /></SelectTrigger>
                <SelectContent>{resumes.map((r) => <SelectItem key={r._id} value={r._id}>{r.originalName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Company</Label><Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></div>
            <div><Label>Job Title</Label><Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} /></div>
            <div><Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["professional", "executive", "technical", "graduate"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Job Description</Label><Textarea rows={5} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} /></div>
            <div className="flex gap-2">
              <Button variant="hero" className="flex-1" disabled={!resumeId || generateMutation.isPending} onClick={() => generateMutation.mutate()}>
                {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
              </Button>
              <Button variant="outline" disabled={streaming} onClick={handleStream}>Stream</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Preview</CardTitle>
            {content && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(content); toast.success("Copied"); }}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {content ? (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                {content}{streaming && <span className="animate-pulse">▊</span>}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-12">Generated cover letter will appear here</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Saved Cover Letters</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20" />) :
            letters.length ? letters.map((l) => (
              <div key={l._id} className="rounded-xl border border-border p-4 hover:bg-muted/30 cursor-pointer" onClick={() => setContent(l.content)}>
                <p className="font-medium text-sm">{l.jobTitle} at {l.companyName}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(l.createdAt).toLocaleDateString()}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground text-center py-6">No saved cover letters yet</p>}
        </CardContent>
      </Card>
    </div>
  );
}
