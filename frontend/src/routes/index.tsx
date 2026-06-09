import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustedBy, Testimonials } from "@/components/landing/Testimonials";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerForge Pro — AI Resume Optimizer & Job Matcher" },
      { name: "description", content: "Land more interviews with AI-powered, ATS-optimized resumes tailored to every job. Free forever plan." },
      { property: "og:title", content: "CareerForge Pro — AI Resume Optimizer" },
      { property: "og:description", content: "AI-optimized, ATS-proof resumes and intelligent job matching." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
