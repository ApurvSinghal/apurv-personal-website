export interface ResumeExperience {
  period: string;
  role: string;
  company: string;
  client?: string;
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
  workRights?: string;
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
  title: "Lead Cloud & Platform Architect · AI Engineer · Founder",
  location: "Melbourne, Victoria, Australia",
  workRights: "Full Australian Working Rights",
  email: "me@apurvsinghal.com",
  website: "https://apurvsinghal.com",
  linkedin: "https://www.linkedin.com/in/apurvsinghal28",
  github: "https://github.com/ApurvSinghal",
  pillars: [
    "Azure Cloud + DevOps",
    "Platform Engineering",
    "Applied AI & Systems",
  ],
  summary:
    "Enterprise cloud and platform architect with 8+ years architecting and shipping mission-critical systems across enterprise clients including Bank of Queensland (BOQ), AGIG, Toyota Australia, EPA Victoria, and HPCA. Currently Lead Consultant at Capgemini and Founder of ADM Guard (the compliance flight recorder for automated decisions). Proven track record executing enterprise platform migrations (VMware Tanzu to Azure Container Apps), architecting Infrastructure as Code (Terraform/Bicep), driving full-stack observability (Dynatrace, New Relic), and building resilient, observable systems at scale.",
  skills: [
    {
      category: "Azure Cloud & DevOps",
      items: [
        "Microsoft Azure",
        "Azure Integration Services (APIM, Logic Apps)",
        "Azure Container Apps & Tanzu",
        "GitHub Actions & Azure DevOps CI/CD",
        "Terraform & Bicep IaC",
        "Full-Stack Observability (New Relic, Dynatrace, NRQL)",
        "Docker & Microservices",
        "Azure Functions (Serverless)",
        "Cosmos DB & Azure SQL",
      ],
    },
    {
      category: "Platform Engineering",
      items: [
        "Internal Developer Platforms & Golden Paths",
        "Enterprise Platform Migrations",
        "Salesforce DevOps (SFDX)",
        "Release Engineering & Quality Gates",
        "Cloud Cost Governance & FinOps",
        "Site Reliability & Disaster Recovery",
        "Zero-Trust & Policy-as-Code",
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
        "Azure Policy Guardrails & RBAC",
        "SAST & DevSecOps",
      ],
    },
  ],
  experience: [
    {
      period: "Aug 2026 — Present",
      role: "Platform Engineer (Observability)",
      company: "Capgemini",
      client: "Bank of Queensland (BOQ)",
      companyUrl: "https://www.capgemini.com",
      location: "Melbourne, Australia",
      highlights: [
        "Leading enterprise Dynatrace full-stack observability implementation across banking cloud and platform infrastructure, monitoring 10,000+ microservices and endpoints across multi-cloud environments and enterprise data centers.",
        "Architecting distributed tracing, custom service dashboards, synthetic transaction monitors, and Davis AI anomaly alert policies to accelerate incident triage and reduce MTTD/MTTR.",
        "Partnering with platform and engineering squads to embed observability standards into CI/CD pipelines, automating monitoring agent deployments and reliability guardrails.",
      ],
      skills: ["Dynatrace", "Full-Stack Observability", "Azure", "SRE"],
    },
    {
      period: "Feb 2026 — Aug 2026",
      role: "Lead Cloud DevOps Engineer",
      company: "Capgemini",
      client: "Australian Gas Infrastructure Group (AGIG)",
      companyUrl: "https://www.capgemini.com",
      location: "Melbourne, Australia",
      highlights: [
        "Spearheaded Azure DevOps architecture for migrating mission-critical integration workloads to Azure Integration Services (APIM, Logic Apps, Azure Functions) with zero downtime.",
        "Standardized automated release workflows and rollback capabilities through modular Azure DevOps YAML templates across all migration phases.",
        "Enforced DevSecOps guardrails, automated SAST security scanning, and Azure RBAC/IaC governance to maintain platform compliance and stability.",
      ],
      skills: [
        "Azure Integration Services",
        "APIM",
        "Azure DevOps",
        "DevSecOps",
      ],
    },
    {
      period: "Jun 2025 — Present",
      role: "Salesforce DevOps Lead",
      company: "Capgemini",
      client: "HPCA",
      companyUrl: "https://www.capgemini.com",
      location: "Melbourne, Australia",
      highlights: [
        "Engineered automated CI/CD release pipelines utilizing SFDX, Git, and Azure DevOps, eliminating manual deployment overhead across release cycles.",
        "Automated multi-sandbox tracking and code promotion workflows, preventing configuration drift and accelerating production release frequency.",
        "Led delivery pods as Salesforce DevOps SME, establishing standardized Git branching strategies, automated quality gates, and deployment runbooks.",
      ],
      skills: [
        "Salesforce SFDX",
        "Azure DevOps",
        "CI/CD Automation",
        "Release Engineering",
      ],
    },
    {
      period: "May 2025 — Jan 2026",
      role: "Senior DevOps Engineer (IaC & Integration)",
      company: "Capgemini",
      client: "EPA Victoria",
      companyUrl: "https://www.capgemini.com",
      location: "Melbourne, Australia",
      highlights: [
        "Architected end-to-end Infrastructure as Code (IaC) modules using Terraform and ARM for Azure Integration Services (APIM, Logic Apps, Azure Functions), cutting environment provisioning time from days to under 30 minutes.",
        "Designed reusable Azure DevOps YAML pipelines for integration workloads, driving zero-downtime cutovers and environment configuration parity.",
        "Served as Azure DevOps SME, enforcing enterprise-wide CI/CD templates, Azure Policy security guardrails, and compliance baselines.",
      ],
      skills: [
        "Terraform",
        "ARM Templates",
        "Azure Integration",
        "Azure Policy",
      ],
    },
    {
      period: "Jun 2021 — May 2025",
      role: "Platform Engineer",
      company: "Capgemini",
      client: "Toyota Australia",
      companyUrl: "https://www.capgemini.com",
      location: "Melbourne, Australia",
      highlights: [
        "Transitioned legacy VMware Tanzu container workloads to Azure Container Apps, modernizing containerized API delivery and developer platform velocity.",
        "Engineered enterprise observability across hybrid environments using New Relic One (APM agents, distributed tracing, custom NRQL dashboards, and synthetic monitors), reducing MTTD/MTTR.",
        "Authored standardized Azure DevOps YAML CI/CD pipelines, reusable Terraform/Bicep IaC modules, and cloud governance frameworks.",
        "Re-architected Azure resource allocation, autoscaling, and monitoring policies to optimize performance and control operational cloud expenditure.",
      ],
      skills: [
        "Azure Container Apps",
        "VMware Tanzu",
        "New Relic One",
        "Terraform",
      ],
    },
    {
      period: "May 2020 — Jun 2021",
      role: "Software Developer",
      company: "Willow.ai",
      companyUrl: "https://www.willowinc.com",
      location: "New Delhi, India",
      highlights: [
        "Engineered scalable .NET microservices and RESTful APIs for smart building and digital twin platforms within Agile sprint cadences.",
        "Diagnosed backend system bottlenecks to enhance application uptime, error handling, and end-to-end API response times by ~35%.",
        "Identified environment deployment friction, implementing early CI/CD pipeline automation and developer enablement tooling.",
      ],
      skills: [
        ".NET",
        "C#",
        "REST APIs",
        "Microservices",
        "CI/CD Automation",
        "Agile",
      ],
    },
    {
      period: "Jul 2018 — Feb 2020",
      role: "Software Developer",
      company: "TechCompiler Data Systems",
      companyUrl: "https://www.techcompiler.com",
      location: "New Delhi, India",
      highlights: [
        "Built and maintained robust RESTful APIs and backend microservices using .NET, C#, and relational database systems.",
        "Refactored complex SQL schemas, stored procedures, and data pipelines, boosting throughput and cutting query latency by ~50%.",
        "Configured automated build and testing checks across multi-platform application endpoints to guarantee reliable releases.",
      ],
      skills: [
        ".NET",
        "C#",
        "SQL Server",
        "Database Optimization",
        "Data Pipelines",
        "APIs",
      ],
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
      skills: [
        "Azure Australia East",
        "WORM Storage",
        "SHA-256 Merkle Trees",
        "Zero-PII",
        "TypeScript",
        "Python",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Technology in Computer Science & Engineering",
      institution: "Guru Gobind Singh Indraprastha University (GGSIPU)",
      period: "2014 — 2018",
      details:
        "Amity School of Engineering and Technology, New Delhi. Focus on Computer Science, Distributed Systems, Software Engineering, and Algorithms.",
    },
  ],
  certifications: [
    "Microsoft Certified: Azure Fundamentals (AZ-900)",
    "Applied Skills: Microsoft Azure",
  ],
};
