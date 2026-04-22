import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    period: "2023 — Present",
    title: "Lead Consultant",
    company: "Capgemini",
    companyUrl: "https://www.capgemini.com",
    description:
      "Leading Azure cloud initiatives, optimizing resource utilization and performance across multiple projects. Enhanced CI/CD pipelines, significantly reducing deployment time and improving system stability. Actively mentoring junior developers and facilitating knowledge-sharing sessions to foster team growth and collaboration.",
    technologies: ["Azure", "Azure DevOps", "CI/CD", ".NET", "Cloud Architecture"],
  },
  {
    period: "2021 — 2023",
    title: "Consultant",
    company: "Capgemini",
    companyUrl: "https://www.capgemini.com",
    description:
      "Implemented Azure DevOps strategies to enhance platform stability and reliability. Led platform migration initiatives, system upgrades, and continuous improvements to ensure optimal performance and scalability.",
    technologies: ["Azure DevOps", "Platform Migration", "System Architecture", ".NET"],
  },
  {
    period: "2021",
    title: "Contractor",
    company: "Capgemini",
    companyUrl: "https://www.capgemini.com",
    description:
      "Contributed to Azure cloud and DevOps initiatives during a 6-month contract period, supporting the team in delivering reliable and scalable solutions.",
    technologies: ["Azure", "DevOps", ".NET"],
  },
  {
    period: "2020 — 2021",
    title: "Software Developer",
    company: "Willow.ai",
    companyUrl: "https://www.willow.ai",
    description:
      "Developed responsive mobile applications with a focus on performance optimization. Streamlined back-end processes to enhance data processing efficiency and improve overall application responsiveness.",
    technologies: ["Mobile Development", "Backend Optimization", "Data Processing"],
  },
  {
    period: "2018 — 2020",
    title: "Software Developer",
    company: "TechCompiler Data Systems",
    companyUrl: "https://www.techcompiler.com",
    description:
      "Developed and maintained reliable and scalable .NET applications. Collaborated with cross-functional teams to deliver high-quality software solutions that met business requirements and user needs.",
    technologies: [".NET", "C#", "SQL Server", "Web Applications"],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-12 md:hidden">
          Experience
        </h2>

        <div className="space-y-2">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative grid md:grid-cols-[140px_1fr] gap-4 md:gap-8 rounded-lg p-4 -mx-4 hover:bg-muted/40 transition-colors duration-200"
            >
              {/* Period */}
              <div className="text-xs text-muted-foreground font-mono pt-1 tabular-nums">
                {exp.period}
              </div>

              {/* Content */}
              <div className="relative">
                <Link
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link"
                >
                  <h3 className="text-foreground font-medium group-hover/link:text-primary transition-colors inline-flex items-center gap-1">
                    {exp.title} · {exp.company}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all"
                    />
                  </h3>
                </Link>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
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

        {/* Resume Link */}
        <div className="mt-12 ml-4">
          <Link
            href="/documents/resume.pdf"
            target="_blank"
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
