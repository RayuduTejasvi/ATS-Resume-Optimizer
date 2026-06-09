import { api, API_BASE } from "./client";
import type { ATSScore } from "./types";

export const aiApi = {
  analyzeJD: (jobDescription: string, resumeId?: string) =>
    api("/ai/analyze-jd", { method: "POST", body: JSON.stringify({ jobDescription, resumeId }) }),

  calculateScore: (resumeId: string, jobDescription: string) =>
    api<{ success: boolean; data: ATSScore }>("/ai/calculate-score", {
      method: "POST",
      body: JSON.stringify({ resumeId, jobDescription }),
    }),

  optimizeResume: (resumeId: string, jobDescription?: string, jobDescriptionId?: string) =>
    api("/ai/optimize-resume", {
      method: "POST",
      body: JSON.stringify({ resumeId, jobDescription, jobDescriptionId }),
    }),

  generateCoverLetter: (data: {
    resumeId: string;
    jobDescription: string;
    companyName?: string;
    jobTitle?: string;
    tone?: string;
  }) => api("/ai/generate-cover-letter", { method: "POST", body: JSON.stringify(data) }),

  jobMatch: (resumeId: string) =>
    api(`/jobs/match?resumeId=${resumeId}`),

  saveATSReport: (data: { resumeId: string; jobDescription: string; title?: string; company?: string }) =>
    api("/ats/report", { method: "POST", body: JSON.stringify(data) }),

  getATSReports: () => api("/ats/reports"),

  getCoverLetters: () => api("/cover-letters"),
};

export function streamAI(prompt: string, onChunk: (text: string) => void, onDone?: () => void, onError?: (e: Error) => void) {
  const token = localStorage.getItem("cf_access_token");
  const controller = new AbortController();
  const url = `${API_BASE}/ai/stream?prompt=${encodeURIComponent(prompt)}`;

  fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok || !res.body) throw new Error("Stream failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const payload = line.slice(6);
            if (payload === "[DONE]") {
              onDone?.();
              return;
            }
            try {
              const { text, error } = JSON.parse(payload);
              if (error) throw new Error(error);
              if (text) onChunk(text);
            } catch {
              /* skip malformed */
            }
          }
        }
      }
      onDone?.();
    })
    .catch((e) => {
      if (e.name !== "AbortError") onError?.(e);
    });

  return () => controller.abort();
}
