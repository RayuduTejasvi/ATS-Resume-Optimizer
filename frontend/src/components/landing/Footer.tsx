import { Sparkles, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "@tanstack/react-router";

const cols = [
  { title: "Product", links: ["Features", "Pricing", "Templates", "Job Matcher", "Changelog"] },
  { title: "Resources", links: ["Resume Guide", "ATS Tips", "Cover Letter Tips", "Career Blog", "Help Center"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Press", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies", "DPA"] },
];

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 bg-card/40 border-t border-border">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-6 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">
                CareerForge<span className="text-gradient"> Pro</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered ATS-proof resumes and intelligent job matching for the modern career.
            </p>
            <div className="flex gap-2 mt-5">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-lg glass grid place-items-center hover:bg-primary/10 transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="font-display font-semibold text-sm mb-4">{c.title}</div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} CareerForge Pro. All rights reserved.</div>
          <div>Made with ☕ for the next career chapter.</div>
        </div>
      </div>
    </footer>
  );
}
