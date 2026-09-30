import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Role {
  period: string;
  title: string;
  client?: string;
  location: string;
  description: string;
  technologies: string[];
}

interface ExperienceGroup {
  company: string;
  companyUrl: string;
  period: string;
  roleBadge?: string;
  roles: Role[];
}

interface VolunteerExperience {
  period: string;
  title: string;
  organization: string;
  organizationUrl: string;
  location: string;
  description: string;
  technologies: string[];
}

const experiences: ExperienceGroup[] = [
  {
    company: "Capgemini",
    companyUrl: "https://www.capgemini.com",
    period: "2021 — Present",
    roleBadge: "Lead Consultant · 5 Client Engagements",
    roles: [
      {
        period: "Aug 2026 — Present",
        title: "Platform Engineer (Observability)",
        client: "Bank of Queensland (BOQ)",
        location: "Melbourne, Australia",
        description:
          "Leading enterprise Dynatrace full-stack observability implementation across banking cloud and platform infrastructure, monitoring 10,000+ microservices and endpoints across multi-cloud environments and enterprise data centers. Architecting custom dashboards, distributed tracing, synthetic transaction monitors, and automated anomaly alert policies to accelerate incident triage and reduce MTTD/MTTR.",
        technologies: ["Dynatrace", "Full-Stack Observability", "Azure", "SRE"],
      },
      {
        period: "Feb 2026 — Aug 2026",
        title: "Lead Cloud DevOps Engineer",
        client: "Australian Gas Infrastructure Group (AGIG)",
        location: "Melbourne, Australia",
        description:
          "Spearheaded Azure DevOps architecture for migrating mission-critical integration workloads to Azure Integration Services (APIM, Logic Apps, Azure Functions) with zero-downtime cutovers. Designed repeatable YAML CI/CD automation pipelines, automated SAST security scanning, and enforced IaC governance.",
        technologies: [
          "Azure Integration Services",
          "APIM",
          "Azure DevOps",
          "DevSecOps",
        ],
      },
      {
        period: "Jun 2025 — Present",
        title: "Salesforce DevOps Lead",
        client: "HPCA",
        location: "Melbourne, Australia",
        description:
          "Engineered automated CI/CD release pipelines utilizing SFDX, Git, and Azure DevOps, eliminating manual deployment overhead across release cycles. Automated multi-sandbox tracking and code promotion workflows, preventing configuration drift and establishing automated quality gates across delivery teams.",
        technologies: [
          "Salesforce SFDX",
          "Azure DevOps",
          "CI/CD Automation",
          "Release Engineering",
        ],
      },
      {
        period: "May 2025 — Jan 2026",
        title: "Senior DevOps Engineer (IaC & Integration)",
        client: "EPA Victoria",
        location: "Melbourne, Australia",
        description:
          "Architected end-to-end Infrastructure as Code (IaC) modules using Terraform and ARM for Azure Integration Services (APIM, Logic Apps, Azure Functions), cutting environment provisioning times from days to under 30 minutes. Enforced enterprise CI/CD templates and Azure Policy security guardrails.",
        technologies: [
          "Terraform",
          "ARM Templates",
          "Azure Integration",
          "Azure Policy",
        ],
      },
      {
        period: "Jun 2021 — May 2025",
        title: "Platform Engineer",
        client: "Toyota Australia",
        location: "Melbourne, Australia",
        description:
          "Executed enterprise platform modernization, transitioning containerized workloads and API delivery from legacy VMware Tanzu to Azure Container Apps. Configured full-stack New Relic observability across hybrid environments (custom NRQL dashboards, synthetic checks, distributed tracing) to reduce MTTD/MTTR. Standardized reusable Azure DevOps YAML pipelines, IaC modules, and cloud cost governance.",
        technologies: [
          "Azure Container Apps",
          "VMware Tanzu",
          "New Relic One",
          "Terraform",
        ],
      },
    ],
  },
  {
    company: "Willow.ai",
    companyUrl: "https://www.willowinc.com",
    period: "2020 — 2021",
    roles: [
      {
        period: "2020 — 2021",
        title: "Software Developer",
        location: "New Delhi, India",
        description:
          "Built and optimized scalable .NET microservices and RESTful APIs for smart building and digital twin platforms within Agile sprint cadences. Diagnosed backend bottlenecks to improve application uptime and response times by ~35%. Initiated early CI/CD pipeline automation and developer enablement.",
        technologies: [".NET Core", "C#", "Microservices", "REST APIs"],
      },
    ],
  },
  {
    company: "TechCompiler Data Systems",
    companyUrl: "https://www.techcompiler.com",
    period: "2018 — 2020",
    roles: [
      {
        period: "2018 — 2020",
        title: "Software Developer",
        location: "New Delhi, India",
        description:
          "Built and maintained robust RESTful APIs and backend microservices using .NET, C#, and relational database systems. Refactored complex SQL schemas, stored procedures, and data pipelines, boosting throughput and cutting latency by ~50%. Configured automated build and test quality checks.",
        technologies: [".NET", "C#", "SQL Server", "Data Pipelines"],
      },
    ],
  },
];

const volunteerExperiences: VolunteerExperience[] = [
  {
    period: "April 2026 — Present",
    title: "Head of IT (Volunteer)",
    organization: "IndianCare Inc.",
    organizationUrl: "https://www.indiancare.org.au",
    location: "Melbourne, Australia",
    description:
      "Managing complete end-to-end IT infrastructure, cloud administration, and digital operations for a Victoria-based community welfare non-profit. Overseeing Microsoft 365 and Entra ID identity governance, domain security, website operations, and digital safeguarding for sensitive community helpline and family welfare support services.",
    technologies: [
      "Microsoft 365 / Entra ID",
      "Cloud Infrastructure",
      "Identity Governance",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Experience
        </h2>
        <p className="text-muted-foreground max-w-3xl leading-relaxed mb-12">
          Enterprise cloud architecture, platform modernization, and backend
          systems engineered across regulated industries.
        </p>

        <div className="space-y-6">
          {experiences.map((expGroup, groupIndex) => {
            const isGrouped = expGroup.roles.length > 1;

            return (
              <div
                key={groupIndex}
                className="rounded-2xl p-6 sm:p-7 bg-card/50 border border-black/[0.08] dark:border-white/[0.08] hover:border-primary/30 transition-[border-color,box-shadow] duration-200"
              >
                {/* Company Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/40">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={expGroup.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5"
                    >
                      <h3 className="text-foreground text-lg font-bold group-hover/link:text-primary transition-colors inline-flex items-center gap-1">
                        {expGroup.company}
                        <ArrowUpRight
                          size={15}
                          className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-transform"
                        />
                      </h3>
                    </Link>

                    {expGroup.roleBadge && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium text-foreground/80 bg-secondary/80 border-0"
                      >
                        {expGroup.roleBadge}
                      </Badge>
                    )}
                  </div>

                  <span className="text-xs font-mono text-muted-foreground tabular-nums">
                    {expGroup.period}
                  </span>
                </div>

                {/* Body Content */}
                {isGrouped ? (
                  /* Nested Client Engagements Timeline */
                  <div className="mt-5 space-y-6 border-l-2 border-primary/25 ml-2 sm:ml-3 pl-4 sm:pl-5">
                    {expGroup.roles.map((role, roleIndex) => (
                      <div key={roleIndex} className="relative group/role">
                        {/* Timeline Node */}
                        <div className="absolute -left-[23px] sm:-left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background ring-2 ring-primary/20" />

                        {/* Role Header */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-foreground font-semibold text-sm sm:text-base group-hover/role:text-primary transition-colors">
                              {role.title}
                            </h4>
                            {role.client && (
                              <Badge
                                variant="outline"
                                className="text-[11px] font-semibold text-primary border-primary/30 bg-primary/5 py-0 px-2"
                              >
                                Client: {role.client}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono tabular-nums">
                            <span>{role.period}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-0.5 text-foreground/80 font-sans">
                              <MapPin size={11} className="text-primary" />
                              {role.location}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {role.description}
                        </p>

                        {/* Tech Badges */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {role.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-secondary/70 text-secondary-foreground hover:bg-secondary border-0 text-xs py-0.5 px-2"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Single Role Employer */
                  <div className="mt-4">
                    {expGroup.roles.map((role, rIndex) => (
                      <div key={rIndex}>
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h4 className="text-foreground font-semibold text-base">
                            {role.title}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={11} className="text-primary" />
                            {role.location}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {role.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {role.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-secondary/70 text-secondary-foreground hover:bg-secondary border-0 text-xs py-0.5 px-2"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Community & Pro Bono Leadership */}
        <div className="mt-12 pt-8 border-t border-black/[0.08] dark:border-white/[0.08]">
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-6">
            Community & Pro Bono Leadership
          </h3>

          <div className="space-y-4">
            {volunteerExperiences.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 bg-card/50 border border-black/[0.08] dark:border-white/[0.08] hover:border-primary/30 transition-[border-color,box-shadow] duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/40">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={item.organizationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5"
                    >
                      <h4 className="text-foreground text-base font-bold group-hover/link:text-primary transition-colors inline-flex items-center gap-1">
                        {item.organization}
                        <ArrowUpRight
                          size={15}
                          className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-transform"
                        />
                      </h4>
                    </Link>
                    <Badge
                      variant="outline"
                      className="text-[11px] font-semibold text-primary border-primary/30 bg-primary/5 py-0 px-2"
                    >
                      {item.title}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono tabular-nums">
                    <span>{item.period}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-0.5 text-foreground/80 font-sans">
                      <MapPin size={11} className="text-primary" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-secondary/70 text-secondary-foreground hover:bg-secondary border-0 text-xs py-0.5 px-2"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Link */}
        <div className="mt-10 pt-4 flex justify-start">
          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 text-sm text-foreground font-semibold hover:text-primary transition-colors"
          >
            <span>View Full Resume</span>
            <ArrowUpRight
              size={16}
              className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform text-primary"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
