# Backlog — AI Pivot for apurvsinghal.com

## Goal

Reposition apurvsinghal.com from "Azure/DevOps Consultant" → "Enterprise engineer going deep on AI."
Keep the Capgemini/consulting background as credibility foundation.
Add AI projects as proof of new direction.

---

## ✅ Done

### Site Infrastructure

- [x] Cloudflare Web Analytics — beacon loaded in production via `src/app/layout.tsx`
- [x] CSP + security headers — `next.config.mjs` allows only self + Cloudflare Insights
- [x] Sitemap & SEO — dynamic sitemap (`/sitemap.xml`) & robots (`/robots.txt`) covering all project pages
- [x] AI chat widget — `/api/chat` backed by Gemini with grounded fallback answers
- [x] X Automation Bot & Daily Briefings — automated daily posting engine with Gemini 2.5/3.x briefing generation & Resend email delivery to `apurv.singhal28@gmail.com`
- [x] Weekly X analytics — `public_metrics` via X API v2, committed to `content/x-analytics.json`
- [x] Rate limiter — shared in-memory limiter (`src/lib/rate-limit.ts`) for contact and chat APIs

### AI Pivot — Design & Content

- [x] Color palette changed — teal → violet (AI-forward)
- [x] Scroll animations — fade-in on all sections via `AnimateOnScroll` + `data-animate`
- [x] Hero rewritten — "AI Engineer & Builder", AI bridge narrative about copy
- [x] Skills rewritten — AI & Agents, Claude API, RAG, MCP, Azure AI, Vector DBs
- [x] Experience reframed — away from DevOps language, toward production systems / enterprise scale
- [x] Projects updated — categories now include AI, DevOps removed
- [x] Meta title/description updated — AI-focused
- [x] OG image updated — violet palette, AI tagline
- [x] Schema.org jobTitle updated — "AI Engineer"

---

## Phase 1 — Build AI Projects (Weeks 1–6)

_Do this before changing more site copy. The portfolio needs proof, not just new copy._

- [ ] **Project 1: AI Agent** — Build an agent using Claude API that automates a real task (e.g., email triage, meeting notes, task extraction). Deploy on Azure or Vercel.
- [ ] **Project 2: RAG Chatbot** — Build a chatbot over a document set (e.g., your own resume/experience, or a niche like Australian tax docs). Show retrieval + generation.
- [ ] **Project 3: Azure AI Tool** — Leverage Azure OpenAI or Azure AI Foundry to build something enterprise-relevant. This bridges old expertise to new direction.
- [ ] Each project must have: live demo link OR demo video, a case study page on the site, and quantified outcome ("processes X in Y seconds vs Z manually").

---

## Phase 2 — Remaining Site Updates (After Phase 1)

### Add: Services / Work With Me Page

- [ ] Define 1–2 clear offers:
  - _"MVP AI agent in 4 weeks — fixed scope, fixed price"_
  - _"AI audit: I map your top 3 workflows for automation — 1-week engagement"_
- [ ] Single CTA at bottom: contact form

### Experience Section

- [ ] Add numbers to every bullet (reduce deployment time by X%, saved X hours/week, X teams, etc.)

### Add: Availability Badge

- [ ] Show current availability status e.g. "Available for contracts from [Month Year]"

### Add: Testimonials Block

- [ ] Pull 2–3 LinkedIn recommendations, display on homepage

---

## Phase 3 — Content & Distribution (Ongoing)

### LinkedIn (Weekly)

- [ ] Post once/week while building Phase 1 projects — "learning in public" format
  - _"Week 1 building my first AI agent — here's what surprised me"_
  - _"Coming from DevOps, here's how I think about deploying AI to production"_
  - _"I automated X using Claude API. Here's how."_
- [ ] Each post links back to site or a project

### Blog / Articles (Monthly)

- [ ] Write 1 article/month on the site. Topic ideas:
  - _"How I migrated my thinking from DevOps to AI agents"_
  - _"RAG vs fine-tuning — what I learned building my first chatbot"_
  - _"Deploying AI agents on Azure — the production pitfalls"_
- [ ] These drive Google search traffic over time

### Lead Magnet (Optional — Phase 3+)

- [ ] Create a free resource: e.g. _"AI Automation Checklist for Teams"_ or _"5 workflows any business can automate with AI"_
- [ ] Gate behind email signup → build email list

---

## Positioning Principles (Keep These in Mind)

1. **Don't hide the past** — reframe it as your AI superpower (enterprise shipping experience)
2. **Be specific over broad** — once you know which vertical resonates, niche down
3. **Live demos beat descriptions** — every AI project needs a link or video
4. **Learn in public** — document the transition, people follow journeys
5. **One clear offer** — visitors need to know what to buy from you

---

## Not Doing (Consciously Deprioritized)

- Removing DevOps/Azure from resume entirely — keep as foundation
- Claiming AI expertise before having projects to back it up
- Newsletter until Phase 3 (premature without audience)
