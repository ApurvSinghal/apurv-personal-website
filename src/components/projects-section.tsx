"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projectCategories, projects, type Project, type ProjectStatus } from "@/lib/projects";

function ProjectGroup({
  title,
  items,
}: {
  title: ProjectStatus;
  items: Project[];
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="grid gap-4">
        {items.map((project, index) => (
          <article
            key={`${project.title}-${index}`}
            className="group rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] backdrop-blur-md p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/15 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                {project.status === "Live" && (
                  <span className="relative flex h-2 w-2 mt-1 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
                <h4 className="text-foreground font-medium group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-xs text-primary/80 hover:text-primary underline underline-offset-4"
                >
                  Case Study
                </Link>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github size={16} />
                  </Link>
                )}
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                    aria-label={`View ${project.title} live`}
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                )}
              </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed opacity-80">
              {project.technicalDetails}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
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
  const [selectedStatus, setSelectedStatus] = useState<"All" | ProjectStatus>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | (typeof projectCategories)[number]>(
    "All",
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const statusMatch = selectedStatus === "All" || project.status === selectedStatus;
      const categoryMatch =
        selectedCategory === "All" || project.categories.includes(selectedCategory);
      return statusMatch && categoryMatch;
    });
  }, [selectedCategory, selectedStatus]);

  const liveProjects = filteredProjects.filter((project) => project.status === "Live");
  const wipProjects = filteredProjects.filter((project) => project.status === "WIP");

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

        <div className="mb-8 flex flex-wrap items-center gap-2">
          {(["All", "Live", "WIP"] as const).map((status) => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
                aria-pressed={isActive}
              >
                {status}
              </button>
            );
          })}

          {(["All", ...projectCategories] as const).map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
                aria-pressed={isActive}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="space-y-10">
          {liveProjects.length > 0 && <ProjectGroup title="Live" items={liveProjects} />}
          {wipProjects.length > 0 && <ProjectGroup title="WIP" items={wipProjects} />}
          {filteredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No projects match the selected filters.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
