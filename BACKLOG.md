# Backlog — AI Pivot for apurvsinghal.com

## Goal
Reposition apurvsinghal.com from "Azure/DevOps Consultant" → "Enterprise engineer going deep on AI."
Keep the Capgemini/consulting background as credibility foundation.
Add AI projects as proof of new direction.

---

## ✅ Done

### Site Infrastructure
- [x] Vercel Analytics — package installed, deployed, toggle enabled in dashboard
- [x] Google Analytics — `NEXT_PUBLIC_GA_ID` env var already set, wired via `@next/third-parties`
- [x] Vercel Speed Insights — always-on
- [x] CSP updated — added `va.vercel-scripts.com` to `script-src` and `connect-src`
- [x] Sitemap fixed — now includes all project pages (`/projects/*`)
- [x] Second cron job — `/api/ping-sitemap` pings Google with sitemap daily at 2am UTC
- [x] Vercel Firewall — basic attack protection enabled in dashboard
- [x] Rate limiter updated — now reads `KV_REST_API_URL`/`KV_REST_API_TOKEN` (Vercel KV) with fallback to Upstash vars and in-memory

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

## ⚠️ Pending Manual Step

### Vercel KV — not yet linked to project
The KV store was created in the dashboard but env vars (`KV_REST_API_URL` / `KV_REST_API_TOKEN`) are not showing up in the project.

**Fix:**
1. Vercel dashboard → Storage → click your KV store
2. Go to **Projects** tab → add `apurv-personal-website`
3. Vercel auto-injects the env vars — a redeploy activates them

Until fixed, rate limiting falls back to in-memory (works fine for a personal site).

---

## Phase 1 — Build AI Projects (Weeks 1–6)
*Do this before changing more site copy. The portfolio needs proof, not just new copy.*

- [ ] **Project 1: AI Agent** — Build an agent using Claude API that automates a real task (e.g., email triage, meeting notes, task extraction). Deploy on Azure or Vercel.
- [ ] **Project 2: RAG Chatbot** — Build a chatbot over a document set (e.g., your own resume/experience, or a niche like Australian tax docs). Show retrieval + generation.
- [ ] **Project 3: Azure AI Tool** — Leverage Azure OpenAI or Azure AI Foundry to build something enterprise-relevant. This bridges old expertise to new direction.
- [ ] Each project must have: live demo link OR demo video, a case study page on the site, and quantified outcome ("processes X in Y seconds vs Z manually").

---

## Phase 2 — Remaining Site Updates (After Phase 1)

### Add: Services / Work With Me Page
- [ ] Define 1–2 clear offers:
  - *"MVP AI agent in 4 weeks — fixed scope, fixed price"*
  - *"AI audit: I map your top 3 workflows for automation — 1-week engagement"*
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
  - *"Week 1 building my first AI agent — here's what surprised me"*
  - *"Coming from DevOps, here's how I think about deploying AI to production"*
  - *"I automated X using Claude API. Here's how."*
- [ ] Each post links back to site or a project

### Blog / Articles (Monthly)
- [ ] Write 1 article/month on the site. Topic ideas:
  - *"How I migrated my thinking from DevOps to AI agents"*
  - *"RAG vs fine-tuning — what I learned building my first chatbot"*
  - *"Deploying AI agents on Azure — the production pitfalls"*
- [ ] These drive Google search traffic over time

### Lead Magnet (Optional — Phase 3+)
- [ ] Create a free resource: e.g. *"AI Automation Checklist for Teams"* or *"5 workflows any business can automate with AI"*
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
