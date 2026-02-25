import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    period: "2023 — Present",
    title: "Senior Software Engineer",
    company: "Tech Company",
    companyUrl: "#",
    description:
      "Build and maintain critical components used to construct the company's frontend, across the whole product. Work closely with cross-functional teams, including developers, designers, and product managers, to implement and advocate for best practices in web development.",
    technologies: ["React", "TypeScript", "Next.js", "Node.js", "AWS"],
  },
  {
    period: "2021 — 2023",
    title: "Software Engineer",
    company: "Startup Inc",
    companyUrl: "#",
    description:
      "Developed and shipped highly interactive web applications for various clients. Led the technical design and implementation of a customer-facing dashboard that improved user engagement by 40%.",
    technologies: ["JavaScript", "React", "Python", "PostgreSQL", "Docker"],
  },
  {
    period: "2019 — 2021",
    title: "Frontend Developer",
    company: "Digital Agency",
    companyUrl: "#",
    description:
      "Collaborated with designers and other developers to build responsive, accessible websites for diverse clients. Implemented pixel-perfect designs while ensuring optimal performance and cross-browser compatibility.",
    technologies: ["HTML", "CSS", "JavaScript", "Vue.js", "SASS"],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-12 md:hidden">
          Experience
        </h2>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative grid md:grid-cols-[140px_1fr] gap-4 md:gap-8"
            >
              {/* Period */}
              <div className="text-sm text-muted-foreground font-mono">
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
                      size={16}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all"
                    />
                  </h3>
                </Link>

                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
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
        <div className="mt-16">
          <Link
            href="/resume.pdf"
            target="_blank"
            className="group inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
          >
            View Full Resume
            <ArrowUpRight
              size={18}
              className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
