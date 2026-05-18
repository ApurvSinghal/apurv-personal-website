export type ProjectStatus = "Live" | "WIP";

export type ProjectCategory =
  | "Cloud"
  | "Backend"
  | "DevOps"
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
    slug: "apurv-personal-website",
    title: "Apurv Singhal - Personal Website",
    status: "Live",
    summary:
      "A conversion-oriented portfolio platform that presents experience clearly, captures qualified inbound interest, and highlights engineering depth through project case studies.",
    technicalDetails:
      "Built with Next.js App Router, TypeScript, and Tailwind CSS using reusable UI primitives and route-level SEO. The architecture includes a monitored contact pipeline, generated Open Graph assets, structured data, and a layered testing strategy to keep product quality high as the site evolves.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Resend", "Vercel"],
    categories: ["Frontend", "Backend", "DevOps", "Observability"],
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
  "Cloud",
  "Backend",
  "DevOps",
  "Frontend",
  "Observability",
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
