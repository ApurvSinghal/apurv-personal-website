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
      "Leading engineering teams building production-grade cloud systems at enterprise scale. Optimized infrastructure across multiple client engagements, cutting deployment time and improving system reliability. Mentored teams on architecture and engineering practices.",
    technologies: [
      "Azure",
      "Cloud Architecture",
      ".NET",
      "System Design",
      "Team Leadership",
    ],
  },
  {
    period: "2021 — 2023",
    title: "Consultant",
    company: "Capgemini",
    companyUrl: "https://www.capgemini.com",
    description:
      "Led platform migration and reliability initiatives on Azure. Focused on system stability, scalability, and continuous delivery across multiple client environments.",
    technologies: [
      "Azure",
      "Platform Migration",
      "System Architecture",
      ".NET",
    ],
  },
  {
    period: "2021",
    title: "Contractor",
    company: "Capgemini",
    companyUrl: "https://www.capgemini.com",
    description:
      "Azure cloud and backend systems delivery during a 6-month contract, supporting reliable and scalable solutions.",
    technologies: ["Azure", "Backend Systems", ".NET"],
  },
  {
    period: "2020 — 2021",
    title: "Software Developer",
    company: "Willow.ai",
    companyUrl: "https://www.willow.ai",
    description:
      "Developed responsive mobile applications with a focus on performance optimization. Streamlined back-end processes to enhance data processing efficiency and improve overall application responsiveness.",
    technologies: [
      "Mobile Development",
      "Backend Optimization",
      "Data Processing",
    ],
  },
  {
    period: "2018 — 2020",
    title: "Software Developer",
    company: "TechCompiler Data Systems",
    companyUrl: "https://www.techcompiler.com",
    description:
      "Built and maintained reliable, scalable .NET applications. Collaborated with cross-functional teams to deliver software solutions that met business requirements.",
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
