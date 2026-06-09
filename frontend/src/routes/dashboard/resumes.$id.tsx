import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { resumesApi } from "@/lib/api/resumes";
import { billingApi } from "@/lib/api/billing";
import type { ParsedResume } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export const Route = createFileRoute("/dashboard/resumes/$id")({
  component: ResumeBuilderPage,
});

const emptyResume: ParsedResume = {
  name: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

function ResumePreview({ data }: { data: ParsedResume }) {
  return (
    <div className="bg-white text-gray-900 p-8 rounded-lg shadow-inner min-h-full text-sm leading-relaxed">
      <h1 className="text-2xl font-bold text-gray-900">{data.name || "Your Name"}</h1>
      <p className="text-gray-500 text-xs mt-1">
        {[data.email, data.phone, data.location].filter(Boolean).join(" · ")}
      </p>
      {data.summary && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-200 pb-1 mb-2">Summary</h2>
          <p>{data.summary}</p>
        </section>
      )}
      {data.experience && data.experience.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-200 pb-1 mb-2">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-semibold">
                <span>{exp.title}</span>
                <span className="text-gray-400 text-xs">{exp.startDate} – {exp.endDate || "Present"}</span>
              </div>
              <p className="text-gray-600 text-xs">{exp.company}</p>
              {exp.bullets?.map((b, j) => <p key={j} className="text-xs mt-0.5">• {b}</p>)}
            </div>
          ))}
        </section>
      )}
      {data.skills && data.skills.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-200 pb-1 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((s, i) => (
              <span key={i} className="bg-gray-100 text-xs px-2 py-0.5 rounded">{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ResumeBuilderPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ParsedResume>(emptyResume);
  const [skillsText, setSkillsText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["resume", id],
    queryFn: () => resumesApi.get(id),
  });

  useEffect(() => {
    if (data?.data?.resume?.parsedData) {
      setForm(data.data.resume.parsedData);
      setSkillsText((data.data.resume.parsedData.skills || []).join(", "));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      resumesApi.update(id, {
        parsedData: { ...form, skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean) },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume", id] });
      toast.success("Resume saved");
    },
    onError: () => toast.error("Save failed"),
  });

  const handleDownload = async () => {
    try {
      const res = await billingApi.generatePDF(id);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.name || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("PDF export failed");
    }
  };

  const update = useCallback((field: keyof ParsedResume, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Resume Builder</h1>
          <p className="text-sm text-muted-foreground">{data?.data?.resume?.originalName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-12rem)] rounded-xl border border-border">
        <ResizablePanel defaultSize={50} minSize={35}>
          <div className="h-full overflow-y-auto p-6 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Personal Info</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label>Name</Label><Input value={form.name || ""} onChange={(e) => update("name", e.target.value)} /></div>
                <div><Label>Email</Label><Input value={form.email || ""} onChange={(e) => update("email", e.target.value)} /></div>
                <div><Label>Phone</Label><Input value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} /></div>
                <div><Label>Location</Label><Input value={form.location || ""} onChange={(e) => update("location", e.target.value)} /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Professional Summary</CardTitle></CardHeader>
              <CardContent>
                <Textarea rows={4} value={form.summary || ""} onChange={(e) => update("summary", e.target.value)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
              <CardContent>
                <Textarea rows={2} placeholder="JavaScript, React, Node.js..." value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={35}>
          <div className="h-full overflow-y-auto p-6 bg-muted/30">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" /> Live Preview
            </div>
            <ResumePreview data={{ ...form, skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean) }} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
