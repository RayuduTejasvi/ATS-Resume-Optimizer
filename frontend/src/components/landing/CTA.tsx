import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-16 text-center shadow-glow"
        >
          <div className="absolute inset-0 noise opacity-30" />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative text-primary-foreground">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Your next role is one resume away.
            </h2>
            <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">
              Join 50,000+ professionals who landed interviews with AI-optimized resumes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="xl" variant="glass" asChild>
                <Link to="/signup">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
