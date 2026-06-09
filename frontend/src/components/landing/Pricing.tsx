import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started with core resume tools.",
    features: ["1 active resume", "Basic ATS score", "PDF export", "Modern template"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    desc: "Everything you need to land the role.",
    features: [
      "Unlimited resumes", "Unlimited ATS analysis", "AI cover letters",
      "All premium templates", "Job matching engine", "Priority AI models",
      "Application tracker", "Email support",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success mb-4">
            Pricing
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade when you're ready to accelerate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                p.highlight
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "glass shadow-card"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full glass-strong px-3 py-1 text-xs font-semibold text-primary shadow-card">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </div>
              )}
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}>{p.desc}</p>
              <div className="mt-6 flex items-end gap-1">
                <div className="font-display text-5xl font-bold tracking-tight">{p.price}</div>
                <div className={`pb-2 text-sm ${p.highlight ? "opacity-80" : "text-muted-foreground"}`}>/ {p.period}</div>
              </div>
              <Button
                size="lg"
                className="mt-6 w-full"
                variant={p.highlight ? "glass" : "hero"}
              >
                {p.cta}
              </Button>
              <div className={`mt-8 h-px ${p.highlight ? "bg-white/20" : "bg-border"}`} />
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${p.highlight ? "" : "text-success"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
