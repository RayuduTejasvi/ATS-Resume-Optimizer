import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Check, Sparkles, FileText, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "./ResumePreview";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>AI-Powered Resume Intelligence</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span className="text-gradient font-semibold">New: GPT-4o</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Land More <br />
            Interviews with{" "}
            <span className="text-gradient-hero">AI-Powered</span> Resume
            Optimization
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Transform your resume into an ATS-optimized career asset tailored
            for every job application. Beat the bots, impress recruiters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Button size="xl" variant="hero" asChild>
              <Link to="/signup">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="xl" variant="glass">
              <Play className="h-4 w-4" /> Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {["No credit card", "Free forever plan", "Cancel anytime"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success" /> {t}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <ResumePreview />
          <FloatingBadge
            icon={<Zap className="h-4 w-4 text-primary" />}
            label="ATS Score"
            value="94%"
            className="absolute -left-4 top-12 lg:-left-12"
            delay={0.8}
          />
          <FloatingBadge
            icon={<FileText className="h-4 w-4 text-success" />}
            label="Keywords Matched"
            value="27/30"
            className="absolute -right-4 bottom-20 lg:-right-10"
            delay={1.1}
          />
        </motion.div>
      </div>
    </section>
  );
}

function FloatingBadge({
  icon, label, value, className, delay,
}: { icon: ReactNode; label: string; value: string; className?: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className={`glass-strong rounded-2xl px-4 py-3 shadow-elegant animate-float ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center">{icon}</div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="font-display font-bold text-lg">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}
