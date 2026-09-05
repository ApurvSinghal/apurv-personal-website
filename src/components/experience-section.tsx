import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Role {
  period: string;
  title: string;
  location: string;
  description: string;
  technologies: string[];
}

interface ExperienceGroup {
  company: string;
  companyUrl: string;
  period: string;
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
    roles: [
      {
        period: "2023 — Present",
        title: "Lead Consultant (Azure Cloud, DevOps & Platform)",
        location: "Melbourne, Australia",
        description:
          "Leading platform engineering teams and enterprise cloud architecture across client engagements on Azure. Designed automated DevOps CI/CD pipelines, optimized deployment velocity, and improved system reliability and security standards. Mentoring teams on cloud architecture, containerization, and production AI readiness.",
        technologies: [
          "Azure Cloud",
          "DevOps",
          "Platform Engineering",
          "CI/CD Pipelines",
          "Docker",
          ".NET",
          "System Architecture",
        ],
      },
      {
        period: "2021 — 2023",
        title: "Consultant (Platform & Cloud Migration)",
        location: "New Delhi, India",
        description:
          "Led platform migration and cloud reliability initiatives on Azure. Focused on infrastructure automation, developer platform scalability, and automated continuous delivery across multiple enterprise client environments.",
        technologies: [
          "Azure",
          "Platform Migration",
          "DevOps",
          "Infrastructure Automation",
          ".NET",
        ],
      },
      {
        period: "2021",
        title: "Contractor",
        location: "New Delhi, India",
        description:
          "Azure cloud and backend systems delivery during a 6-month contract, supporting reliable and scalable solutions.",
        technologies: ["Azure", "Backend Systems", ".NET"],
      },
    ],
  },
  {
    company: "Willow.ai",
    companyUrl: "https://www.willow.ai",
    period: "2020 — 2021",
    roles: [
      {
        period: "2020 — 2021",
        title: "Software Developer",
        location: "New Delhi, India",
        description:
          "Developed responsive mobile applications with a focus on performance optimization. Streamlined back-end processes to enhance data processing efficiency and improve overall application responsiveness.",
        technologies: [
          "Mobile Development",
          "Backend Optimization",
          "Data Processing",
        ],
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
          "Built and maintained reliable, scalable .NET applications. Collaborated with cross-functional teams to deliver software solutions that met business requirements.",
        technologies: [".NET", "C#", "SQL Server", "Web Applications"],
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
      "End-to-End IT Operations",
      "Microsoft 365 / Entra ID",
      "Cloud & Web Infrastructure",
      "Cyber Hygiene",
      "Identity Governance",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-12 sr-only md:not-sr-only">
          Experience
        </h2>

        <div className="space-y-10">
          {experiences.map((expGroup, groupIndex) => {
            const isGrouped = expGroup.roles.length > 1;

            if (isGrouped) {
              return (
                <div
                  key={groupIndex}
                  className="rounded-xl p-5 -mx-5 bg-card/40 border border-border/40 transition-colors duration-200"
                >
                  {/* Group Header */}
                  <div className="grid md:grid-cols-[140px_1fr] gap-4 md:gap-8 pb-4 border-b border-border/40">
                    <div className="text-xs text-muted-foreground font-mono pt-0.5 tabular-nums">
                      {expGroup.period}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={expGroup.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-1.5"
                      >
                        <h3 className="text-foreground text-base font-semibold group-hover/link:text-primary transition-colors inline-flex items-center gap-1">
                          {expGroup.company}
                          <ArrowUpRight
                            size={15}
                            className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-transform"
                          />
                        </h3>
                      </Link>

                      <span className="text-[11px] font-mono text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">
                        {expGroup.roles.length} Roles · Promoted & Contract
                      </span>
                    </div>
                  </div>

                  {/* Sub-Roles Timeline */}
                  <div className="mt-4 md:ml-[140px] md:pl-8 space-y-6 border-l-2 border-primary/30 ml-2 pl-4">
                    {expGroup.roles.map((role, roleIndex) => (
                      <div
                        key={roleIndex}
                        className="group/role relative rounded-lg p-3 -mx-3 hover:bg-muted/40 transition-colors"
                      >
                        {/* Timeline Node */}
                        <div className="absolute -left-[23px] md:-left-[39px] top-4 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background ring-2 ring-primary/20" />

                        {/* Title & Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h4 className="text-foreground font-medium text-sm group-hover/role:text-primary transition-colors">
                            {role.title}
                          </h4>
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
                              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0 text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Single Role Entry
            const singleRole = expGroup.roles[0];
            return (
              <div
                key={groupIndex}
                className="group relative grid md:grid-cols-[140px_1fr] gap-4 md:gap-8 rounded-lg p-4 -mx-4 hover:bg-muted/40 transition-colors duration-200"
              >
                {/* Period */}
                <div className="text-xs text-muted-foreground font-mono pt-1 tabular-nums">
                  {singleRole.period}
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <Link
                      href={expGroup.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link"
                    >
                      <h3 className="text-foreground font-medium group-hover/link:text-primary transition-colors inline-flex items-center gap-1">
                        {singleRole.title} · {expGroup.company}
                        <ArrowUpRight
                          size={14}
                          className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-transform"
                        />
                      </h3>
                    </Link>

                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={11} className="text-primary" />
                      {singleRole.location}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {singleRole.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {singleRole.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community & Pro Bono Leadership */}
        <div className="mt-16 pt-12 border-t border-black/[0.08] dark:border-white/[0.08]">
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-8">
            Community & Pro Bono Leadership
          </h3>

          <div className="space-y-2">
            {volunteerExperiences.map((item, index) => (
              <div
                key={index}
                className="group relative grid md:grid-cols-[140px_1fr] gap-4 md:gap-8 rounded-lg p-4 -mx-4 hover:bg-muted/40 transition-colors duration-200"
              >
                <div className="text-xs text-muted-foreground font-mono pt-1 tabular-nums">
                  {item.period}
                </div>

                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <Link
                      href={item.organizationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link"
                    >
                      <h4 className="text-foreground font-medium group-hover/link:text-primary transition-colors inline-flex items-center gap-1">
                        {item.title} · {item.organization}
                        <ArrowUpRight
                          size={14}
                          className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-transform"
                        />
                      </h4>
                    </Link>

                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={11} className="text-primary" />
                      {item.location}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Link */}
        <div className="mt-12 ml-4">
          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 text-sm text-foreground font-medium hover:text-primary transition-colors"
          >
            View Full Resume
            <ArrowUpRight
              size={16}
              className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
