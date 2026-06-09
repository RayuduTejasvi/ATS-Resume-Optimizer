import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function ResumePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const id = setInterval(() => {
      v += 2;
      setScore(Math.min(v, 94));
      if (v >= 94) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [inView]);

  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div ref={ref} className="relative">
      <div className="relative rounded-3xl glass-strong p-2 shadow-elegant">
        {/* mock browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-chart-4/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
        </div>
        <div className="rounded-2xl bg-card p-6 grid grid-cols-5 gap-4">
          {/* resume */}
          <div className="col-span-3 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display font-bold text-lg">Sarah Chen</div>
                <div className="text-xs text-muted-foreground">Senior Product Designer</div>
              </div>
              <div className="text-[9px] text-muted-foreground text-right">
                sarah@chen.io<br/>San Francisco, CA
              </div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-1.5">Experience</div>
              <div className="space-y-2">
                {[
                  { c: "Linear", r: "Lead Designer · 2022 – Present" },
                  { c: "Stripe", r: "Senior Designer · 2019 – 2022" },
                  { c: "Airbnb", r: "Product Designer · 2017 – 2019" },
                ].map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.15 }}
                  >
                    <div className="text-[11px] font-semibold">{e.c}</div>
                    <div className="text-[9px] text-muted-foreground">{e.r}</div>
                    <div className="mt-1 space-y-1">
                      <div className="h-1 w-full bg-muted rounded-full" />
                      <div className="h-1 w-[85%] bg-muted rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-1.5">Skills</div>
              <div className="flex flex-wrap gap-1">
                {["Figma","Design Systems","Research","Prototyping","React","A/B Testing"].map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.05 }}
                    className="text-[9px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* ATS score panel */}
          <div className="col-span-2 rounded-xl bg-gradient-primary p-4 text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 noise opacity-20" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-wide opacity-80">ATS Score</div>
              <div className="mt-4 grid place-items-center">
                <div className="relative">
                  <svg width="100" height="100" className="-rotate-90">
                    <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeOpacity="0.2" strokeWidth="8" fill="none"/>
                    <circle cx="50" cy="50" r={radius} stroke="white" strokeWidth="8" fill="none"
                      strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.1s linear" }}/>
                  </svg>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="font-display font-bold text-2xl">{score}%</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-[10px]">
                {[
                  { l: "Keywords", v: 92 },
                  { l: "Skills", v: 96 },
                  { l: "Format", v: 100 },
                ].map((m, i) => (
                  <div key={m.l}>
                    <div className="flex justify-between"><span>{m.l}</span><span>{m.v}%</span></div>
                    <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${m.v}%` } : {}}
                        transition={{ delay: 0.6 + i * 0.15, duration: 0.8 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
