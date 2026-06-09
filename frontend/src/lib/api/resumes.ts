import { api } from "./client";
import type { ParsedResume, ResumeListItem } from "./types";

export const resumesApi = {
  list: () =>
    api<{ success: boolean; data: { resumes: ResumeListItem[]; total: number } }>("/resumes"),

  get: (id: string) =>
    api<{ success: boolean; data: { resume: { _id: string; parsedData: ParsedResume; originalName: string; atsScore?: number } } }>(
      `/resumes/${id}`,
    ),

  upload: (file: File) => {
    const form = new FormData();
    form.append("resume", file);
    return api<{ success: boolean; data: { resume: { id: string; parsedData: ParsedResume } } }>(
      "/resumes/upload",
      { method: "POST", body: form },
    );
  },

  create: (parsedData: ParsedResume, originalName?: string) =>
    api("/resumes", { method: "POST", body: JSON.stringify({ parsedData, originalName }) }),

  update: (id: string, data: { parsedData?: ParsedResume; originalName?: string }) =>
    api(`/resumes/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string) => api(`/resumes/${id}`, { method: "DELETE" }),
};
