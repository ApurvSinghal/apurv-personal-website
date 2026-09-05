export interface ResumeExperience {
  period: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  highlights: string[];
  skills: string[];
}

export interface ResumeVolunteer {
  period: string;
  role: string;
  organization: string;
  organizationUrl?: string;
  location: string;
  highlights: string[];
  skills: string[];
}

export interface ResumeProject {
  name: string;
  url?: string;
  role: string;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
  pillars: string[];
  summary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: ResumeExperience[];
  volunteer: ResumeVolunteer[];
  projects: ResumeProject[];
  education: {
    degree: string;
    institution: string;
    period: string;
    details?: string;
  }[];
  certifications: string[];
}

export const RESUME_DATA: ResumeData = {
  name: "Apurv Singhal",
  title: "Lead Cloud & Platform Consultant · AI Engineer · Founder",
  location: "Melbourne, Victoria, Australia",
  email: "me@apurvsinghal.com",
  website: "https://www.apurvsinghal.com",
  linkedin: "https://www.linkedin.com/in/apurvsinghal28",
  github: "https://github.com/ApurvSinghal",
  pillars: [
    "Azure Cloud + DevOps",
    "Platform Engineering",
    "Applied AI & Systems",
  ],
  summary:
    "Enterprise platform and cloud engineer with 8+ years architecting and shipping mission-critical systems at scale. Currently leading Azure cloud, DevOps automation, and internal platform engineering initiatives at Capgemini. Founder of ADM Guard, the compliance flight recorder for automated decisions. Proven track record navigating complex enterprise governance, migrating enterprise platforms, eliminating deployment friction through automated CI/CD, and deploying resilient, observable AI systems into production.",
  skills: [
    {
      category: "Azure Cloud & DevOps",
      items: [
        "Microsoft Azure",
        "Azure Landing Zones",
        "GitHub Actions CI/CD",
        "Terraform & Bicep IaC",
        "Docker & Containers",
        "Azure Functions (Serverless)",
        "Cosmos DB & Azure SQL",
        "SRE & Observability",
      ],
    },
    {
      category: "Platform Engineering",
      items: [
        "Internal Developer Platforms",
        "Enterprise Platform Migrations",
        "Microservices Architecture",
        "Release Engineering & Automation",
        "Site Reliability & Disaster Recovery",
        "Zero-Trust Architecture",
        "API Gateways",
      ],
    },
    {
      category: "Applied AI & Engineering",
      items: [
        "Azure AI Foundry & Azure OpenAI",
        "Claude API & Agent Architectures",
        "RAG Workflows & Vector Embeddings",
        "Tool Calling & Function Calling",
        "TypeScript & Next.js",
        "Python & FastAPI",
        "C# & .NET Core",
      ],
    },
    {
      category: "Governance & Security",
      items: [
        "Zero-PII Ingestion Boundary Design",
        "Australian Privacy Act APP 1.7–1.9",
        "Immutable Azure WORM Storage",
        "Cryptographic Merkle Hash Chains",
        "Entra ID Identity & Access Governance",
      ],
    },
  ],
  experience: [
    {
      period: "2023 — Present",
      role: "Lead Consultant (Azure Cloud, DevOps & Platform)",
      company: "Capgemini",
      companyUrl: "https://www.capgemini.com",
      location: "Melbourne, Australia",
      highlights: [
        "Architect and lead cloud platform engineering initiatives across enterprise client engagements on Microsoft Azure.",
        "Design production CI/CD automation pipelines using GitHub Actions, reducing release cycle lead time and eliminating manual operational risk.",
        "Establish standardized infrastructure-as-code (Terraform, Bicep) blueprints for cloud landing zones, security guardrails, and compliance governance.",
        "Mentor engineering teams on cloud-native practices, containerization, observability telemetry, and production AI readiness.",
      ],
      skills: [
        "Microsoft Azure",
        "DevOps",
        "GitHub Actions",
        "Terraform",
        "Platform Engineering",
        "Azure Landing Zones",
        "Entra ID",
      ],
    },
    {
      period: "2021 — 2023",
      role: "Consultant (Platform & Cloud Migration)",
      company: "Capgemini",
      companyUrl: "https://www.capgemini.com",
      location: "Melbourne, Australia",
      highlights: [
        "Led platform migration and cloud reliability initiatives across multiple enterprise environments on Azure.",
        "Automated deployment workflows, eliminating cross-team delivery friction and improving system availability SLAs.",
        "Standardized container deployment patterns and cloud monitoring telemetry to maintain enterprise-grade resilience.",
      ],
      skills: ["Azure", "Docker", "CI/CD", "Cloud Migration", "PowerShell", "SRE"],
    },
    {
      period: "2021",
      role: "Contractor (Cloud & Backend Engineering)",
      company: "Capgemini",
      companyUrl: "https://www.capgemini.com",
      location: "Melbourne, Australia",
      highlights: [
        "Delivered critical backend systems and cloud infrastructure components for high-demand client environments.",
        "Collaborated with architecture teams to ensure zero-downtime releases and strict compliance adherence.",
      ],
      skills: ["Azure", "Backend Systems", "APIs", "Agile Delivery"],
    },
    {
      period: "2020 — 2021",
      role: "Software Developer",
      company: "Willow.ai",
      companyUrl: "https://www.willowinc.com",
      location: "Melbourne, Australia",
      highlights: [
        "Engineered scalable web and mobile software solutions for smart building and digital twin platform ecosystems.",
        "Streamlined backend data ingestion and query pipelines to optimize application latency and user experience.",
      ],
      skills: ["Software Engineering", "Full-Stack Development", "APIs", "Cloud Services"],
    },
    {
      period: "2018 — 2020",
      role: "Software Developer",
      company: "TechCompiler Data Systems",
      companyUrl: "https://www.techcompiler.com",
      location: "India",
      highlights: [
        "Engineered robust enterprise applications using .NET, C#, and relational database systems.",
        "Implemented database schema optimizations, indexing strategies, and automated testing suites.",
      ],
      skills: [".NET", "C#", "SQL Server", "Web Applications", "Relational Databases"],
    },
  ],
  volunteer: [
    {
      period: "April 2026 — Present",
      role: "Head of IT (Volunteer)",
      organization: "IndianCare Inc.",
      organizationUrl: "https://www.indiancare.org.au",
      location: "Melbourne, Australia",
      highlights: [
        "Directing complete end-to-end IT operations, cloud administration, and digital strategy for a registered Victorian community welfare non-profit.",
        "Managing Microsoft 365, Entra ID identity governance, multi-factor authentication policies, and endpoint security standards.",
        "Safeguarding confidential digital workflows and infrastructure supporting sensitive community helplines, family counseling, and welfare support services.",
      ],
      skills: [
        "End-to-End IT Operations",
        "Microsoft 365 / Entra ID",
        "Cloud Infrastructure",
        "Cyber Hygiene",
        "Identity Governance",
      ],
    },
  ],
  projects: [
    {
      name: "ADM Guard",
      url: "https://www.admguard.com.au",
      role: "Founder & System Architect",
      description:
        "The compliance flight recorder for automated decision-making systems (APP 1.7–1.9).",
      highlights: [
        "Architected zero-PII ingestion boundary rejecting sensitive personal data at runtime before persistence (HTTP 422).",
        "Implemented cryptographic SHA-256 Merkle hash chains anchored to Azure Australia East WORM (Write-Once-Read-Many) immutable storage.",
        "Built drop-in client SDKs (TypeScript, Python) with client idempotency key retry safety to give Australian SaaS immutable audit readiness.",
      ],
      skills: ["Azure Australia East", "WORM Storage", "SHA-256 Merkle Trees", "Zero-PII", "TypeScript", "Python"],
    },
    {
      name: "Interactive RAG Portfolio Agent",
      url: "https://www.apurvsinghal.com",
      role: "Architect & Developer",
      description:
        "Zero-cost streaming RAG portfolio assistant with deterministic fallback routing and in-chat lead capture.",
      highlights: [
        "Engineered streaming conversational assistant using Next.js 16 App Router, Turbopack, and Google Gemini Flash.",
        "Implemented local deterministic semantic keyword matching ensuring 100% uptime with zero vendor API cost overhead.",
        "Integrated transactional lead capture pipeline with Upstash Redis rate limiting and end-to-end Sentry telemetry.",
      ],
      skills: ["Next.js 16", "React 19", "Gemini Flash API", "Tailwind CSS", "Redis Rate Limiting", "Sentry"],
    },
  ],
  education: [
    {
      degree: "Bachelor of Technology / Engineering in Computer Science",
      institution: "Rajasthan Technical University",
      period: "2014 — 2018",
      details: "Focus on Computer Science, Distributed Systems, Software Engineering, and Algorithms.",
    },
  ],
  certifications: [
    "Microsoft Certified: Azure Solutions Architect Expert",
    "Microsoft Certified: Azure DevOps Engineer Expert",
    "Microsoft Certified: Azure Administrator Associate",
  ],
};
