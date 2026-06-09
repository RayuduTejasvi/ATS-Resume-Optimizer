import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What is an ATS and why does it matter?", a: "An Applicant Tracking System filters resumes before a human sees them. Over 75% of resumes are rejected by ATS software. CareerForge ensures yours passes by optimizing keywords, format, and structure." },
  { q: "How does the AI optimization work?", a: "We combine GPT-4o with a custom keyword-extraction agent. It analyzes the job description, identifies what the ATS and recruiters look for, then rewrites your bullets with stronger action verbs and ATS-friendly phrasing." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your billing dashboard in one click. You keep Pro access until the end of your billing period." },
  { q: "Is my data private?", a: "Always. Your resumes and job descriptions are encrypted at rest and never used to train external models. Delete your account anytime to remove all data." },
  { q: "Do you offer a student discount?", a: "Yes — students get 50% off Pro with a valid .edu email. Contact support after signup to apply it." },
  { q: "Which file formats do you export?", a: "Pixel-perfect PDFs via Puppeteer (recommended for ATS), plus DOCX and TXT for legacy systems." },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-4">
            FAQ
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Questions, <span className="text-gradient">answered</span>
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl glass border-0 px-6 shadow-card">
              <AccordionTrigger className="text-left font-display font-semibold hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
