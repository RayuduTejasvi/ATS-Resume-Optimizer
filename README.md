# ATS-Resume-Optimizer

ATS-Resume-Optimizer (CareerForge Pro) is an AI-powered SaaS resume optimization platform that helps job seekers rewrite their resumes to pass Applicant Tracking Systems. It analyzes a target Job Description, extracts critical keywords, rewrites resume bullet points using prompt engineering, calculates an ATS compatibility score, and generates a pixel-perfect PDF using Puppeteer.

---

## What It Solves

Most qualified candidates are rejected before a recruiter ever sees their resume because ATS scanners filter out resumes that lack the right keywords and formatting. ATS-Resume-Optimizer acts as an AI editor — not just a scorer — actively rewriting experience bullet points to embed JD keywords naturally, so candidates pass ATS filters and reach human recruiters.

---

## Core Capabilities

- Split-screen live resume editor with real-time preview
- JD Analysis Agent for semantic keyword extraction and ranking
- AI Rewrite Engine powered by prompt engineering to embed keywords into bullet points
- ATS Compatibility Score calculated before and after rewriting
- Puppeteer-based PDF generation via Headless Chrome for pixel-perfect output
- Stripe subscription model: Free (1 Resume) and Pro (Unlimited, Cover Letters, Premium Templates)
- Cover Letter Generator using resume and JD context (Pro)
- User Dashboard for saving and iterating on multiple resumes (Pro)
- JWT-based authentication with bcrypt password hashing

---

## Product Goals

| Goal | Target |
|---|---|
| ATS Score Accuracy | ≥ 90% |
| Analysis & Rewrite Time | ≤ 10 seconds |
| PDF Generation Time | ≤ 5 seconds |
| User Satisfaction Score | ≥ 4.5 / 5 |
| Resume Upload Success Rate | ≥ 99% |
| Stripe Webhook Reliability | ≥ 99.9% |
| System Uptime | ≥ 99.5% |
| Concurrent Users Supported | ≥ 100 |

---

## Key Users

**Job Seeker:** Uploads resume, pastes JD, receives rewritten bullets and an optimized PDF.  
**Student:** Builds an ATS-friendly resume for internship applications using the live editor.  
**Career Coach:** Uses Pro tier to optimize multiple client resumes quickly and consistently.

---

## System Overview

ATS-Resume-Optimizer uses a three-layer architecture:

- **Frontend:** React.js split-screen editor, live preview, ATS score dashboard, and Stripe checkout
- **Backend:** Node.js + Express API, resume parsing, JD analysis agent, AI rewrite engine, Puppeteer PDF service, and Stripe webhook handling
- **Data Layer:** MongoDB Atlas for users, resumes, analysis reports, and subscription state

The AI layer uses OpenAI GPT for bullet rewriting and cover letter generation, and Google Gemini for JD keyword extraction and ATS scoring assistance.

---

## Project Structure

The repository is organized by responsibility, with the app layer first and the deployment/database configs last:

```text
src/        # Primary frontend app and shared UI logic
backend/    # Express API, AI services, auth, and PDF generation
frontend/   # Static frontend entry and app shell assets
supabase/   # Database and platform configuration
```

---

## High-Level Workflow

### Resume Optimization Flow

1. User registers and accesses the Resume Editor.
2. User fills the resume schema (Education, Experience, Skills) or uploads a PDF/DOCX.
3. User pastes the target Job Description into the JD input panel.
4. JD Analysis Agent semantically extracts and ranks critical keywords.
5. AI Rewrite Engine rewrites bullet points to embed extracted keywords naturally.
6. ATS Score is calculated before and after rewriting — delta shown to user.
7. Puppeteer backend renders the React preview component into a print-ready PDF.
8. User downloads the optimized PDF.

### Stripe Subscription Flow

1. User selects Pro plan and is redirected to Stripe Checkout.
2. On successful payment, Stripe sends a webhook event.
3. Backend validates the webhook signature and updates `subscription_tier` to `pro` in MongoDB.
4. User gains immediate access to unlimited resumes, cover letters, and premium templates.

---

## Functional Requirements Summary

### Resume Editor
- Canonical resume schema: Education, Experience, Skills, Projects, Certifications
- Split-screen UI: form editor left, live styled preview right
- Full state management via Redux / Context API
- Support PDF and DOCX upload with auto-population of schema fields

### JD Analysis Agent
- Accept raw JD text input
- Semantically extract and rank critical keywords
- Classify keywords: Technical Skills, Soft Skills, Tools, Certifications
- Display ranked keyword list before rewriting

### AI Rewrite Engine
- Prompt engineering templates: *"Rewrite this bullet to be authoritative and include keyword X"*
- Rewrite selected or all bullet points
- Show before / after comparison of each rewritten bullet
- ATS Score recalculates after every rewrite
- One-click full resume optimization

### ATS Score Engine
- Calculate keyword match percentage
- Highlight matched and missing keywords
- Show score improvement delta
- Flag formatting issues that break ATS parsing

### PDF Generation
- Puppeteer Headless Chrome renders React resume component to PDF
- Pixel-perfect, non-editable, print-ready output
- Respects page boundaries and print standards
- Free: 1 PDF download. Pro: unlimited downloads with premium templates

### Authentication and Subscription
- JWT email/password authentication
- Free and Pro tiers via Stripe
- Free tier: 1 resume, 1 PDF download
- Pro tier: unlimited resumes, cover letters, premium templates
- Webhook-driven Pro access on payment confirmation

---

## Non-Functional Requirements

- Resume analysis and rewriting: ≤ 10 seconds
- PDF generation: ≤ 5 seconds
- Upload size limit: 10 MB
- Concurrent users: ≥ 100 active sessions
- Uptime: 99.5%
- Security: JWT, bcrypt, HTTPS, Stripe signature validation, input validation, rate limiting

---

## Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- Redux / Context API
- Axios
- Chart.js

### Backend
- Node.js + Express.js
- Puppeteer (Headless Chrome PDF rendering)
- Multer (file upload handling)
- jsonwebtoken + bcrypt
- Stripe Node SDK

### Database
- MongoDB Atlas
- Mongoose

### AI Layer
- OpenAI GPT (bullet rewriting, cover letter generation)
- Google Gemini (JD keyword extraction, ATS scoring)
- NLP Libraries (keyword classification, semantic similarity)

---

## Data Model Overview

**users**  
Stores authentication credentials, subscription tier, Stripe customer ID, and account metadata.

**resumes**  
Stores uploaded file metadata, structured resume schema (Education, Experience, Skills), and ATS scores before and after rewriting.

**analysis**  
Stores JD text, extracted keywords, matched and missing keywords, rewritten bullets, and AI recommendations per resume.

---

## API Overview

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

### Resume
```
POST   /api/resume/upload
GET    /api/resume/:id
DELETE /api/resume/:id
GET    /api/resume/all
```

### Analysis & AI
```
POST   /api/analyze
POST   /api/rewrite
GET    /api/report/:id
POST   /api/coverletter
```

### PDF Generation
```
POST   /api/pdf/generate
GET    /api/pdf/download/:id
```

### Stripe & Subscriptions
```
POST   /api/stripe/checkout
POST   /api/stripe/webhook
GET    /api/stripe/status
```

---

## AI Processing Pipeline

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
Report Generation (saved to DB)
     │
     ▼
Puppeteer PDF Rendering (Headless Chrome)
     │
     ▼
Results Dashboard (Score, Keywords, Before/After, PDF Download)
```

---

## Implementation Plan

### Week 1: The Builder Core
Build the live resume editor with split-screen preview, canonical resume schema, Redux state management, MongoDB setup, and JWT authentication.

### Week 2: AI Writer & Optimization
Develop the JD Analysis Agent, prompt engineering templates for bullet rewriting, ATS scoring logic, and OpenAI/Gemini API integration.

### Week 3: PDF Generation & Payment
Set up the Puppeteer backend PDF service, integrate Stripe Checkout and webhooks, and implement Free vs. Pro template access control.

### Week 4: Final Polish
Implement the Cover Letter Generator, User Dashboard, performance optimization, end-to-end testing, and production deployment.

---

## Security and Compliance

- JWT access tokens expire after 15 minutes; refresh tokens after 7 days
- Passwords hashed with bcrypt (≥ 12 salt rounds)
- HTTPS enforced on all endpoints
- Stripe webhooks validated using `stripe.webhooks.constructEvent()`
- Input validation and sanitization on all API endpoints via Joi / express-validator
- Rate limiting on auth and AI endpoints via express-rate-limit
- File uploads restricted to PDF/DOCX only with a 10 MB size limit
- All secrets stored in environment variables — never committed to version control

---

## Deployment

The platform deploys with separate frontend and backend services. Production requires environment variables for MongoDB, OpenAI, Gemini, JWT, Stripe, and file storage.

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend + Puppeteer | Render |
| Database | MongoDB Atlas |
| File Storage | Cloudinary / AWS S3 |
| Payments | Stripe |

---

## Run Locally

### 1. Environment

Create a `.env` in the project root:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ats-resume-optimizer
JWT_SECRET=local-dev-jwt-secret-change-me
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
CLOUDINARY_URL=your-cloudinary-url
```

### 2. Start Backend

```bash
npm run dev
```

Health check:
```
http://localhost:5000/health
```

### 3. Start Frontend

```bash
npm run frontend:dev
```

Frontend URL:
```
http://localhost:5173
```

### 4. Basic Flow

1. Register an account.
2. Fill in the Resume Editor or upload a PDF/DOCX resume.
3. Paste a Job Description into the JD input panel.
4. Click **Analyze** — view extracted keywords and initial ATS score.
5. Click **Rewrite** — view AI-rewritten bullets and improved ATS score.
6. Click **Download PDF** — receive a pixel-perfect, print-ready resume.

---

## Open Questions and Risks

- Puppeteer on Render requires `puppeteer-core` + `@sparticuz/chromium` for serverless compatibility
- AI hallucinations in bullet rewrites require a user review step before accepting changes
- OpenAI / Gemini rate limits under high load require request queuing and caching
- Stripe webhook failures require idempotent handlers and a manual reconciliation job
- DOCX parsing inconsistencies across resume templates require testing against 20+ formats
- Large or unstructured uploaded resumes may need fallback to manual schema entry

---

## Submission Requirements

A working demo should include:

- Resume upload or manual schema entry
- JD paste and keyword extraction
- AI bullet rewriting with before/after comparison
- ATS score before and after
- PDF download
- Stripe Pro upgrade flow (or mocked checkout for local demo)

---

*Zaalima Development Pvt. Ltd. — Confidential*
```