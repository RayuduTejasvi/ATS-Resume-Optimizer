ATS-Resume-Optimizer — Product Requirements Document (PRD)

**Project:** ATS-Resume-Optimizer
**Product Brand:** CareerForge Pro
**Codename:** ResumeIQ
**Division:** AI Career Solutions
**Team:** Full Stack Development Team
**Author:** Product Team
**Date:** June 2026
**Version:** 1.0.0
**Status:** Approved for Development
**Organization:** Zaalima Development Pvt. Ltd. — Confidential

---

# Table of Contents

1. Executive Summary
2. Problem Statement
3. Goals & Success Metrics
4. User Personas
5. System Architecture Overview
6. Functional Requirements
7. Non-Functional Requirements
8. Tech Stack Specification
9. Data Models
10. API Specification
11. AI Processing Pipeline
12. Week-Wise Implementation Plan
13. Security & Compliance
14. Deployment & Infrastructure
15. Open Questions & Risks

---

# 1. Executive Summary

ATS-Resume-Optimizer (branded as CareerForge Pro) is a production-grade AI-powered SaaS web application that transforms how job seekers craft and optimize resumes. The platform accepts an uploaded resume and a target Job Description (JD), then intelligently rewrites bullet points to align with extracted ATS keywords, calculates an ATS compatibility score, generates a professionally formatted PDF using Puppeteer (Headless Chrome), and supports a Stripe-powered tiered subscription model.

Unlike basic resume checkers, CareerForge Pro functions as an AI editor — actively rewriting experience content so keywords are naturally embedded and ATS scanners rank the resume higher. Built for scale with Free and Pro tiers, it is accessible to students, job seekers, and career coaches alike.

---

# 2. Problem Statement

## Current Pain Points

- Over 75% of resumes are rejected by ATS before a human recruiter ever sees them.
- Job seekers do not know which keywords to embed or how to phrase bullet points.
- Manual resume tailoring per JD is time-consuming and inconsistent.
- Existing tools only score resumes — they do not rewrite or fix them.
- Generating a professional, print-ready PDF from a resume editor is technically complex.
- Premium career coaching and resume writing services are expensive and inaccessible.

## Opportunity

By combining LLM-powered rewriting, ATS keyword intelligence, and Puppeteer-based PDF rendering into a single SaaS product, CareerForge Pro can automate what takes career coaches hours into a 10-second AI interaction — dramatically improving interview callback rates.

---

# 3. Goals & Success Metrics

## Primary Goals

| Goal | Description |
|---|---|
| JD Keyword Extraction | Semantically parse and rank critical keywords from any job description |
| AI Bullet Rewriting | Rewrite resume bullets to include JD keywords naturally |
| ATS Score Engine | Calculate ATS compatibility % before and after optimization |
| PDF Generation | Render pixel-perfect, non-editable PDFs using Puppeteer + Headless Chrome |
| Subscription Model | Stripe-based Free and Pro tiers with webhook-driven access control |
| Cover Letter AI | Generate tailored cover letters using job and resume context (Pro) |
| Resume Dashboard | Allow users to save, version, and iterate on multiple resumes (Pro) |

## KPIs

| Metric | Target |
|---|---|
| ATS Score Accuracy | ≥ 90% |
| Average Analysis & Rewrite Time | ≤ 10 seconds |
| PDF Generation Time | ≤ 5 seconds |
| User Satisfaction Score | ≥ 4.5 / 5 |
| Resume Upload Success Rate | ≥ 99% |
| Stripe Webhook Reliability | ≥ 99.9% |
| System Uptime | ≥ 99.5% |
| Concurrent Users Supported | ≥ 100 |

---

# 4. User Personas

## Persona 1 — Job Seeker (Primary)

**Name:** Rahul | **Role:** Software Engineer (2 YOE)
**Goal:** Tailor resume to specific JDs and improve ATS pass rate.
**Pain Point:** Low recruiter callback rate despite relevant experience.
**Key Features Used:** JD Analysis + AI Bullet Rewriter + PDF Download.

## Persona 2 — Final Year Student

**Name:** Sneha | **Role:** Computer Science Graduate
**Goal:** Build an ATS-optimized resume for internship applications.
**Pain Point:** No knowledge of ATS systems or keyword importance.
**Key Features Used:** Live Preview + AI Suggestions + Free Tier PDF.

## Persona 3 — Career Coach

**Name:** Priya | **Role:** Freelance Career Consultant
**Goal:** Quickly optimize multiple client resumes against target JDs.
**Pain Point:** Manual keyword analysis and formatting takes too long per client.
**Key Features Used:** Pro Tier — Unlimited Resumes + Cover Letter + Premium Templates.

---

# 5. System Architecture Overview

## High-Level Layers

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React.js + Tailwind CSS + Redux | Split-screen UI — live resume editor left, live preview right |
| Backend | Node.js + Express.js | Auth, file handling, ATS scoring, AI integration, Stripe webhooks, Puppeteer PDF |
| Database | MongoDB Atlas + Mongoose | Users, Resumes, Analysis Reports, Job Descriptions, Subscription status |
| AI Layer | OpenAI GPT / Gemini + Prompt Engineering | JD keyword extraction, bullet rewriting, ATS scoring, cover letter generation |

## Architecture Flow

1. User logs in and accesses the Resume Editor.
2. User fills the resume schema (Education, Experience, Skills) OR uploads a PDF/DOCX.
3. User pastes the target Job Description into the JD input panel.
4. JD Analysis Agent extracts and semantically ranks keywords.
5. AI Rewrite Engine rewrites bullet points to embed extracted keywords.
6. ATS Scoring Engine calculates a match % before and after rewriting.
7. Puppeteer backend renders the React preview component into a pixel-perfect PDF.
8. Stripe controls Free vs. Pro access. Webhooks grant immediate Pro access upon payment.

---

# 6. Functional Requirements

## 6.1 Resume Schema & Live Editor

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Define canonical resume schema: Education, Experience, Skills, Projects, Certifications | P0 |
| FR-02 | Split-screen UI: form editor (left) + live styled preview (right) | P0 |
| FR-03 | Full state management (Redux/Context) for real-time preview updates | P0 |
| FR-04 | Support resume upload: PDF or DOCX — auto-populate schema fields from parsed content | P1 |

## 6.2 JD Analysis Agent

| ID | Requirement | Priority |
|---|---|---|
| FR-05 | Accept raw JD text input from user | P0 |
| FR-06 | Semantically extract and rank critical keywords (e.g., Python, Agile, Leadership) | P0 |
| FR-07 | Classify keywords by type: Technical Skills, Soft Skills, Tools, Certifications | P0 |
| FR-08 | Display ranked keyword list on dashboard before rewriting begins | P1 |

## 6.3 AI Rewrite Logic

| ID | Requirement | Priority |
|---|---|---|
| FR-09 | Implement prompt engineering templates: "Rewrite this bullet to be authoritative and include keyword X" | P0 |
| FR-10 | Rewrite selected or all bullet points to embed JD keywords naturally | P0 |
| FR-11 | Show before / after comparison of each rewritten bullet | P0 |
| FR-12 | ATS Score recalculates automatically after each rewrite | P0 |
| FR-13 | Generate a fully optimized resume version in one click | P1 |

## 6.4 ATS Score Engine

| ID | Requirement | Priority |
|---|---|---|
| FR-14 | Calculate ATS compatibility score as keyword match percentage | P0 |
| FR-15 | Display matched vs. missing keywords with visual highlighting | P0 |
| FR-16 | Show score improvement delta after AI rewriting | P0 |
| FR-17 | Analyze formatting quality flags (tables, columns, images that break ATS) | P1 |

## 6.5 PDF Generation (Puppeteer)

| ID | Requirement | Priority |
|---|---|---|
| FR-18 | Backend Puppeteer service renders the React resume preview using Headless Chrome | P0 |
| FR-19 | Output pixel-perfect, non-editable, print-ready PDF | P0 |
| FR-20 | PDF must respect page boundaries and print standards | P0 |
| FR-21 | Free Tier: 1 PDF download. Pro Tier: Unlimited downloads with premium templates | P0 |

## 6.6 Subscription & Payments (Stripe)

| ID | Requirement | Priority |
|---|---|---|
| FR-22 | Implement Stripe Checkout session for Pro plan upgrade | P0 |
| FR-23 | Stripe webhook updates user subscription status in DB immediately upon payment | P0 |
| FR-24 | Pro users gain immediate access to unlimited resumes, cover letters, premium templates | P0 |
| FR-25 | Free tier limited to 1 resume and 1 PDF download | P0 |

## 6.7 Cover Letter Generator (Pro)

| ID | Requirement | Priority |
|---|---|---|
| FR-26 | Generate a personalized cover letter using resume content + JD keywords | P1 |
| FR-27 | Cover letter downloadable as PDF (Pro only) | P1 |

## 6.8 User Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-28 | Dashboard displays all saved resumes with ATS scores and creation dates | P1 |
| FR-29 | User can open, edit, and iterate on any saved resume | P1 |
| FR-30 | User can delete resumes | P2 |

## 6.9 Authentication

| ID | Requirement | Priority |
|---|---|---|
| FR-31 | User registration with email and password | P0 |
| FR-32 | User login / logout with JWT | P0 |
| FR-33 | Profile page showing subscription status | P1 |

---

# 7. Non-Functional Requirements

## Performance
- Resume analysis and AI rewriting completed in ≤ 10 seconds.
- PDF generation via Puppeteer completed in ≤ 5 seconds.
- System supports ≥ 100 concurrent users.
- Resume/file upload size limit: 10 MB.

## Reliability
- System uptime ≥ 99.5%.
- Stripe webhooks processed with ≥ 99.9% reliability.
- Automatic error recovery and graceful fallback on AI API failures.

## Security
- JWT-based stateless authentication.
- bcrypt password hashing (minimum 12 salt rounds).
- HTTPS enforced on all endpoints.
- Stripe webhooks verified using Stripe signature validation.
- Input validation and sanitization on all API endpoints.
- Rate limiting to prevent abuse.

## Usability
- Live split-screen preview updates with zero perceptible lag.
- ATS score and keyword feedback immediately visible after JD input.
- Generated PDF is visually identical to the live preview.

---

# 8. Tech Stack Specification

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | Component-based UI, live resume preview |
| Frontend | Tailwind CSS | Utility-first styling, responsive design |
| Frontend | Redux / Context API | Global state for resume schema and live updates |
| Frontend | Axios | HTTP client for API communication |
| Frontend | Chart.js | ATS score visualization, keyword match charts |
| Backend | Node.js + Express.js | REST API server, business logic |
| Backend | Multer | Resume file upload handling (PDF, DOCX) |
| Backend | Puppeteer | Headless Chrome — HTML to pixel-perfect PDF rendering |
| Backend | JWT | Stateless user authentication |
| Backend | bcrypt | Secure password hashing |
| Backend | Stripe SDK | Checkout sessions, webhooks, subscription management |
| Database | MongoDB Atlas | Cloud-hosted NoSQL database |
| Database | Mongoose | ODM — schema validation and query interface |
| AI Layer | OpenAI GPT | Bullet point rewriting, cover letter generation |
| AI Layer | Google Gemini | JD keyword extraction, ATS scoring assistance |
| AI Layer | NLP Libraries | Keyword classification and semantic similarity |

---

# 9. Data Models

## Users Collection

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "subscription_tier": "free | pro",
  "stripe_customer_id": "string",
  "created_at": "Date"
}
```

## Resume Collection

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "file_name": "string",
  "resume_schema": {
    "education": [],
    "experience": [],
    "skills": [],
    "projects": [],
    "certifications": []
  },
  "ats_score_before": "number",
  "ats_score_after": "number",
  "uploaded_at": "Date"
}
```

## Analysis Collection

```json
{
  "_id": "ObjectId",
  "resume_id": "ObjectId",
  "jd_text": "string",
  "extracted_keywords": [],
  "matched_keywords": [],
  "missing_keywords": [],
  "rewritten_bullets": [],
  "recommendations": []
}
```

---

# 10. API Specification

## Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

## Resume
```
POST   /api/resume/upload
GET    /api/resume/:id
DELETE /api/resume/:id
GET    /api/resume/all
```

## Analysis & AI
```
POST   /api/analyze
POST   /api/rewrite
GET    /api/report/:id
POST   /api/coverletter
```

## PDF Generation
```
POST   /api/pdf/generate
GET    /api/pdf/download/:id
```

## Stripe & Subscriptions
```
POST   /api/stripe/checkout
POST   /api/stripe/webhook
GET    /api/stripe/status
```

---

# 11. AI Processing Pipeline

```
Resume Upload
     │
     ▼
PDF/DOCX Parser
     │
     ▼
Schema Mapping (Education, Experience, Skills)
     │
     ▼
JD Text Input
     │
     ▼
JD Analysis Agent (Semantic Keyword Extraction & Ranking)
     │
     ▼
Initial ATS Score Calculation
     │
     ▼
AI Rewrite Engine (Prompt Engineering — embed keywords into bullets)
     │
     ▼
Post-Rewrite ATS Score (Delta shown to user)
     │
     ▼
Report Generation (matched, missing, rewritten, score → saved to DB)
     │
     ▼
Puppeteer PDF Rendering (Headless Chrome snapshots React component)
     │
     ▼
Results Dashboard (Score, Keywords, Before/After, PDF Download)
```

---

# 12. Week-Wise Implementation Plan

## Week 1 — The Builder Core (Data Entry to Preview)

**Goal:** Functional resume editor with live preview and authentication.

**Key Tasks:**
- Design the canonical Resume Schema (Education, Experience, Skills, Projects, Certifications).
- Build the split-screen UI: form editor on the left, live styled preview on the right.
- Implement full state management using Redux or Context API for smooth real-time updates.
- Set up MongoDB Atlas, Mongoose models, and JWT Authentication (register, login, profile).

**Review / Verification:**
- Full state management check: live preview updates without lag.
- Schema validation tests pass.
- Auth token generation and expiry verified.

---

## Week 2 — AI Writer & Optimization (The "Magic" Button)

**Goal:** JD analysis agent, AI bullet rewriter, and ATS scoring fully functional.

**Key Tasks:**
- Build the JD Analysis Agent: semantic keyword extraction and classification.
- Develop Prompt Engineering templates, e.g.: *"Rewrite this bullet point to sound authoritative and include the keyword 'Leadership'."*
- Implement ATS Scoring Logic (keyword match %).
- Build before/after bullet comparison UI.
- Integrate OpenAI GPT and Google Gemini APIs.

**Review / Verification:**
- AI latency check: rewrite completes in ≤ 10 seconds.
- Quality assessment of rewritten bullet content.
- ATS score delta accuracy verified.
- Keyword classification validated across multiple JD samples.

---

## Week 3 — PDF Generation & Payment (The Product)

**Goal:** Puppeteer PDF export working and Stripe subscriptions live.

**Key Tasks:**
- Set up the Puppeteer backend service to snapshot the React resume component via Headless Chrome and convert it to PDF.
- Integrate Stripe Checkout session and webhooks for Pro plan upgrade.
- Webhook handler updates `subscription_tier` in MongoDB immediately on `payment_intent.succeeded`.
- Verify Pro users gain immediate access to premium templates upon webhook confirmation.
- Build resume template system (Free vs. Pro templates).

**Review / Verification:**
- PDF visually identical to live preview.
- Page boundary and print standard compliance verified.
- Stripe webhook tested end-to-end with Stripe CLI.
- Template switching verified for both tiers.

---

## Week 4 — Final Polish (Delivery)

**Goal:** Cover letter, dashboard, performance optimization, and production deployment.

**Key Tasks:**
- Implement the Cover Letter Generator using resume + JD context (Pro only).
- Build User Dashboard: view, open, iterate, and delete saved resumes.
- Performance optimization: caching, lazy loading, API response compression.
- End-to-end testing: upload → rewrite → PDF → Stripe upgrade → Pro access.
- Deploy: Vercel (frontend), Render (backend), MongoDB Atlas (database).

**Review / Verification:**
- Cover letter quality assessment.
- Dashboard load time verified.
- Generated PDF respects page boundaries in print preview.
- Stripe webhook reliability tested with Stripe CLI.
- Full E2E smoke test completed across Free and Pro flows.

---

# 13. Security & Compliance

| Control | Implementation |
|---|---|
| JWT Authentication | Signed tokens with expiry (15m access / 7d refresh) |
| Password Hashing | bcrypt with ≥ 12 salt rounds |
| HTTPS Encryption | TLS enforced on all endpoints via hosting platform |
| Stripe Webhook Signature | Validated using `stripe.webhooks.constructEvent()` on every event |
| Input Validation | Joi / express-validator on all API endpoints |
| Rate Limiting | express-rate-limit on auth and AI endpoints |
| Secure File Upload | Multer + file type validation (PDF/DOCX only) + 10 MB size limit |
| Environment Variables | All secrets in `.env` — never committed to version control |

---

# 14. Deployment & Infrastructure

## Services

| Component | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploy from GitHub main branch |
| Backend + Puppeteer | Render | Node.js service with Headless Chrome support |
| Database | MongoDB Atlas | M0 (dev) → M10 (production) |
| File Storage | Cloudinary / AWS S3 | Uploaded resumes and generated PDFs |
| Payments | Stripe | Checkout, webhooks, subscription management |
| AI APIs | OpenAI + Google AI Studio | Secured in environment variables |

## Environment Variables

```
OPENAI_API_KEY=
GEMINI_API_KEY=
MONGO_URI=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_URL=
```

---

# 15. Open Questions & Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Puppeteer on cloud environments requires Chromium configuration | High | Use `puppeteer-core` + `@sparticuz/chromium` for serverless compatibility |
| AI hallucinations in bullet rewrites produce inaccurate content | High | Add validation layer + user review before accepting rewrites |
| OpenAI / Gemini API rate limits under high concurrent usage | High | Request queuing, caching of identical JD analyses, and retry logic |
| Stripe webhook delivery failures causing delayed Pro access | High | Idempotent webhook handlers + manual reconciliation job |
| PDF page boundary violations (content overflow) | Medium | Print CSS rules + Puppeteer page format enforcement |
| Large or unstructured uploaded resumes failing to parse correctly | Medium | Fallback to manual schema entry if auto-parse confidence is low |
| Keyword extraction misclassifying non-critical terms as P0 | Medium | NLP model improvement + allow user to edit keyword list |
| DOCX parsing inconsistencies across resume templates | Medium | Use mammoth.js with custom style mapping; test 20+ templates |
| MongoDB Atlas free tier throttling in production | Low | Upgrade to M10 at launch; implement connection pooling |

---

**End of Document — ATS-Resume-Optimizer PRD v1.0.0**
**Zaalima Development Pvt. Ltd. | Confidential | June 2026**