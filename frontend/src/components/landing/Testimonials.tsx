import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer · Google", quote: "Got 3 interviews in the first week after rewriting my resume. The ATS score made the difference.", avatar: "PS" },
  { name: "Marcus Johnson", role: "Career Coach", quote: "I recommend CareerForge to every client. The JD analysis agent is genuinely better than what I do manually.", avatar: "MJ" },
  { name: "Elena Rodriguez", role: "Product Manager · Stripe", quote: "Landed my dream PM role. The cover letter generator nailed my tone — felt completely human.", avatar: "ER" },
  { name: "David Kim", role: "Recent Graduate", quote: "From zero callbacks to 4 offers in a month. I wish I'd found this during my senior year.", avatar: "DK" },
  { name: "Alicia Brooks", role: "Senior Recruiter", quote: "Resumes built with CareerForge are noticeably easier to screen. Clean, keyword-aligned, and recruiter-friendly.", avatar: "AB" },
  { name: "Tom Yates", role: "Engineering Manager", quote: "Used it for an internal pivot. Optimized in 20 minutes, interview in 3 days. Wild.", avatar: "TY" },
];

export function Testimonials() {
  return (
    <section className="relative py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
            Loved by job seekers
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Trusted by <span className="text-gradient">50,000+</span> professionals
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="rounded-2xl glass p-6 shadow-card"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustedBy() {
  const groups = ["Students", "Professionals", "Career Coaches", "Recruiters", "Bootcamp Grads", "Executives"];
  return (
    <section className="py-14 border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 font-semibold">
          Trusted by job seekers across every stage
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
          {groups.map((g) => (
            <div key={g} className="text-sm md:text-base font-display font-semibold text-muted-foreground/80">
              {g}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
