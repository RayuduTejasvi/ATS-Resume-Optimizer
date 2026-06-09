import { motion } from "framer-motion";
import {
  FileSearch, Gauge, Wand2, Mail, LayoutTemplate, Briefcase, FileDown, BarChart3,
} from "lucide-react";

const features = [
  { icon: FileSearch, title: "JD Analysis Agent", desc: "Parses job descriptions, extracts ranked keywords, and categorizes required vs. nice-to-have skills." },
  { icon: Gauge, title: "ATS Score Calculator", desc: "Real-time score across keywords, skills, experience, and formatting — see exactly what to fix." },
  { icon: Wand2, title: "AI Resume Rewriter", desc: "GPT-4o rewrites bullets with stronger action verbs, leadership signals, and ATS-friendly phrasing." },
  { icon: Mail, title: "Cover Letter Generator", desc: "Tailored letters in Professional, Executive, Technical, or Graduate tones — generated in seconds." },
  { icon: LayoutTemplate, title: "Premium Templates", desc: "Recruiter-tested Executive, Modern, Minimal, and Corporate templates. Pixel-perfect, print-safe." },
  { icon: Briefcase, title: "Job Matching Engine", desc: "Upload once, match to thousands of jobs with % fit, missing skills, and improvement suggestions." },
  { icon: FileDown, title: "PDF Export", desc: "Puppeteer-rendered, multi-page, non-editable PDFs that look identical on every device." },
  { icon: BarChart3, title: "Resume Dashboard", desc: "Track applications, ATS scores over time, and monthly activity with interactive charts." },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4"
          >
            Features
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to <span className="text-gradient">get hired</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A complete AI toolkit built around one goal: more interviews.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl glass p-6 shadow-card hover:shadow-elegant transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-[0.04] transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
