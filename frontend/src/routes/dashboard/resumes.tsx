import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload, FileText, Trash2, Plus, Loader2, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { resumesApi } from "@/lib/api/resumes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard/resumes")({
  component: ResumesPage,
});

function ResumesPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [newName, setNewName] = useState("My Resume");

  const { data, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumesApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resumesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume deleted");
    },
    onError: () => toast.error("Failed to delete resume"),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      resumesApi.create({
        name: "",
        email: "",
        summary: "",
        experience: [],
        education: [],
        skills: [],
      }, newName),
    onSuccess: (res: { data?: { resume?: { _id: string } } }) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume created");
      const id = res?.data?.resume?._id;
      if (id) window.location.href = `/dashboard/resumes/${id}`;
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await resumesApi.upload(file);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume uploaded and parsed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const resumes = data?.data?.resumes || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground mt-1">Upload, build, and manage your resumes</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleUpload} />
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="hero"><Plus className="h-4 w-4" /> Create New</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Resume</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Resume name" />
                <Button className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Building"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : resumes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg">No resumes yet</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
              Upload a PDF or DOCX resume, or create one from scratch with our builder.
            </p>
            <Button variant="hero" className="mt-6" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {resumes.map((resume, i) => (
            <motion.div key={resume._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="group hover:shadow-card transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{resume.originalName}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {resume.isOptimized && (
                    <Badge className="shrink-0"><Sparkles className="h-3 w-3" /> Optimized</Badge>
                  )}
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  {resume.atsScore != null ? (
                    <Badge variant={resume.atsScore >= 80 ? "default" : "secondary"}>
                      ATS {resume.atsScore}%
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">No score yet</span>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/dashboard/resumes/$id" params={{ id: resume._id }}>Edit</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(resume._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
