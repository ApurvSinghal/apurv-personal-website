import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "Apurv Singhal · Personal Website",
    status: "Live" as "Live" | "WIP",
    summary:
      "A responsive personal website showcasing experience, contact workflow, and technical background with a performance-focused, minimal UI.",
    technicalDetails:
      "Built on Next.js App Router with TypeScript and Tailwind CSS, using a modular component system and lightweight UI primitives. Includes a serverless contact API wired to Supabase for message persistence, and ships with optimized fonts, metadata, and accessible navigation.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
    liveUrl: "https://apurvsinghal.com",
    githubUrl: "https://github.com/ApurvSinghal/apurv-personal-website",
  },
] as const;

const liveProjects = projects.filter((project) => project.status === "Live");
const wipProjects = projects.filter((project) => project.status === "WIP");

function ProjectGroup({
  title,
  items,
}: {
  title: "Live" | "WIP";
  items: (typeof projects)[number][];
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {items.length}
        </Badge>
      </div>

      <div className="grid gap-6">
        {items.map((project, index) => (
          <article
            key={`${project.title}-${index}`}
            className="group rounded-lg border border-border p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-foreground text-lg font-medium">{project.title}</h4>
              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github size={18} />
                  </Link>
                )}
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`View ${project.title} live`}
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                )}
              </div>
            </div>

            <p className="mt-4 text-muted-foreground leading-relaxed">{project.summary}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {project.technicalDetails}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Apps & Projects
        </h2>
        <p className="text-muted-foreground max-w-3xl leading-relaxed mb-12">
          A curated set of production and in-progress systems, focused on cloud architecture,
          DevOps reliability, backend performance, and developer tooling. Each project is documented
          with implementation-level context and core technology decisions.
        </p>

        <div className="space-y-10">
          {liveProjects.length > 0 && <ProjectGroup title="Live" items={liveProjects} />}
          {wipProjects.length > 0 && <ProjectGroup title="WIP" items={wipProjects} />}
        </div>
      </div>
    </section>
  );
}
