export type ProjectStatus = "Live" | "WIP";

export type ProjectCategory =
  | "Cloud"
  | "Backend"
  | "AI"
  | "Frontend"
  | "Observability";

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  summary: string;
  technicalDetails: string;
  technologies: string[];
  categories: ProjectCategory[];
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "adm-guard",
    title: "ADM Guard — Automated Decision Compliance Platform",
    status: "Live",
    summary:
      "The compliance flight recorder for automated decisions. Built for Australian B2B SaaS, fintech, and HR-tech to meet mandatory Privacy Act APP 1.7–1.9 obligations before the December 2026 enforcement deadline.",
    technicalDetails:
      "Architected as a developer-first compliance evidence layer at the code boundary. Integrates a zero-PII ingestion firewall (422 rejection before persistence), tamper-evident SHA-256 hash chains with Merkle verification, and Azure Australia East WORM (Write-Once-Read-Many) storage with single-call SDKs for Python, Node, and Go.",
    technologies: [
      "TypeScript",
      "Python SDK",
      "Azure AU East (WORM)",
      "Next.js",
      "SHA-256 Merkle",
      "REST API",
      "RegTech",
    ],
    categories: ["AI", "Cloud", "Backend", "Observability"],
    liveUrl: "https://www.admguard.com.au",
    highlights: [
      "Solves the 10 December 2026 Australian Privacy Act APP 1.7–1.9 enforcement cliff with continuous code-level evidence rather than stale PDFs.",
      "Zero-PII ingestion boundary actively rejects personal names, emails, TFNs, and Medicare numbers prior to persistence.",
      "Tamper-evident SHA-256 hash chain and Merkle trees anchored to immutable Azure Australia East WORM storage.",
      "Drop-in REST API and multi-language SDKs with client-generated idempotency keys for instant developer adoption.",
    ],
  },
  {
    slug: "portfolio-rag-ai-agent",
    title: "Interactive RAG Portfolio Agent",
    status: "Live",
    summary:
      "A zero-cost, streaming RAG AI agent integrated directly into production to represent professional experience, demonstrate architectural depth, and capture qualified inbound leads.",
    technicalDetails:
      "Engineered with Next.js 16 (App Router, Turbopack) using a zero-cost architecture on Google Gemini Flash with real-time SSE streaming via ReadableStream. Features strict prompt grounding over professional milestones, sliding-window rate limiting, and an in-chat lead capture pipeline connected directly to Resend.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Google Gemini",
      "RAG",
      "Tailwind CSS",
      "Resend",
      "Vercel",
    ],
    categories: ["AI", "Frontend", "Backend", "Observability"],
    liveUrl: "https://apurvsinghal.com",
    githubUrl: "https://github.com/ApurvSinghal/apurv-personal-website",
    highlights: [
      "Zero-cost production architecture delivering sub-second streaming responses without cloud billing overhead.",
      "Knowledge-grounded system architecture trained on 8+ years of enterprise Azure and AI delivery.",
      "Built-in defensive rate-limiting and session guardrails to protect free quota against automated scraping.",
      "Integrated in-chat lead capture piping recruiter inquiries directly to personal inbox via Resend.",
    ],
  },
  {
    slug: "apurv-personal-website",
    title: "Apurv Singhal - Personal Website",
    status: "Live",
    summary:
      "A conversion-oriented portfolio platform that presents experience clearly, captures qualified inbound interest, and highlights engineering depth through project case studies.",
    technicalDetails:
      "Built with Next.js App Router, TypeScript, and Tailwind CSS using reusable UI primitives and route-level SEO. The architecture includes a monitored contact pipeline, generated Open Graph assets, structured data, and a layered testing strategy to keep product quality high as the site evolves.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Resend", "Vercel"],
    categories: ["Frontend", "Backend", "Cloud", "Observability"],
    liveUrl: "https://apurvsinghal.com",
    githubUrl: "https://github.com/ApurvSinghal/apurv-personal-website",
    highlights: [
      "Implemented content-driven projects and dynamic case-study pages to improve storytelling and SEO coverage.",
      "Instrumented critical user and API flows to track submission conversion and reliability bottlenecks.",
      "Added defensive contact handling with validation, rate limiting, anti-spam checks, and graceful degradation.",
      "Maintained confidence with unit, integration, API, component, E2E, and accessibility testing layers.",
    ],
  },
  {
    slug: "contact-pipeline-observability",
    title: "Contact Pipeline Observability System",
    status: "Live",
    summary:
      "A resilient lead-intake pipeline that validates user input, delivers notifications reliably, and exposes end-to-end flow telemetry.",
    technicalDetails:
      "Implemented as a serverless workflow with strict schema validation, anti-spam controls, and staged failure handling. Notification delivery is handled via Resend with defensive API behavior to protect against message loss.",
    technologies: ["Next.js", "TypeScript", "Zod", "Resend", "Vercel"],
    categories: ["Cloud", "Backend", "Frontend", "Observability"],
    liveUrl: "https://apurvsinghal.com/#contact",
    githubUrl: "https://github.com/ApurvSinghal/apurv-personal-website",
    highlights: [
      "Applied strict input contracts and bounded payload rules to protect API reliability.",
      "Combined rate limiting, honeypot validation, and submission timing checks to reduce spam traffic.",
      "Implemented clear success and failure paths for owner and acknowledgement notifications.",
      "Made owner notification delivery the source of truth to avoid silent lead loss.",
    ],
  },
];

export const projectCategories: ProjectCategory[] = [
  "AI",
  "Cloud",
  "Backend",
  "Frontend",
  "Observability",
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
