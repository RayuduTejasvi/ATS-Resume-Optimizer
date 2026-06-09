import { motion } from "framer-motion";
import { Upload, ClipboardPaste, Sparkles, Download } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Resume", desc: "Drop your PDF or paste your existing resume — we parse it in seconds." },
  { icon: ClipboardPaste, title: "Paste Job Description", desc: "Drop any JD. Our agent extracts and ranks the keywords that matter." },
  { icon: Sparkles, title: "AI Optimizes Resume", desc: "GPT-4o rewrites bullets, injects keywords, and boosts your ATS score." },
  { icon: Download, title: "Download ATS-Proof Resume", desc: "Export a pixel-perfect PDF tailored for that exact role." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-4">
            How it works
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            From upload to <span className="text-gradient">offer</span> in four steps
          </h2>
        </div>

        <div className="relative grid md:grid-cols-4 gap-6">
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative text-center"
            >
              <div className="relative mx-auto h-24 w-24 rounded-2xl bg-card glass shadow-elegant grid place-items-center mb-5">
                <s.icon className="h-9 w-9 text-primary" />
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold shadow-glow">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
