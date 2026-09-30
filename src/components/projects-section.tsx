import Link from "next/link";
import { ArrowUpRight, Github, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/projects";

export function ProjectsSection() {
  const [featuredProject, secondaryProject] = projects;

  return (
    <section id="projects" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Apps & Systems
        </h2>
        <p className="text-muted-foreground max-w-3xl leading-relaxed mb-12">
          Production systems and architecture case studies — with technical
          decisions, compliance constraints, and implementation details
          documented.
        </p>

        <div className="space-y-8">
          {/* Featured Venture: ADM Guard */}
          {featuredProject && (
            <article className="group relative rounded-2xl border border-primary/30 bg-gradient-to-br from-card/80 via-card/50 to-primary/5 p-6 sm:p-8 hover:border-primary/60 transition-[border-color,box-shadow] duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="relative flex h-2 w-2">
                      <span className="motion-safe:animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 py-0"
                    >
                      Featured Commercial Venture · Live
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      APP 1.7–1.9 Compliance
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {featuredProject.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/projects/${featuredProject.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Case Study
                  </Link>
                  {featuredProject.liveUrl && (
                    <Link
                      href={featuredProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <span>Live Site</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                {featuredProject.summary}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {featuredProject.technicalDetails}
              </p>

              {/* Architecture Highlights */}
              <div className="mt-5 pt-4 border-t border-border/40 grid sm:grid-cols-2 gap-2.5">
                {featuredProject.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                  >
                    <ShieldCheck
                      size={14}
                      className="text-primary shrink-0 mt-0.5"
                    />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {featuredProject.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0 text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </article>
          )}

          {/* Secondary System Card: Portfolio Platform */}
          {secondaryProject && (
            <article className="group rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-card/40 p-6 hover:border-primary/40 hover:bg-card/60 transition-[border-color,background-color] duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                      Systems Architecture
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {secondaryProject.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/projects/${secondaryProject.slug}`}
                    className="text-xs text-foreground hover:text-primary underline underline-offset-4"
                  >
                    Case Study
                  </Link>
                  {secondaryProject.githubUrl && (
                    <Link
                      href={secondaryProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      aria-label={`View ${secondaryProject.title} on GitHub`}
                    >
                      <Github size={16} />
                    </Link>
                  )}
                  {secondaryProject.liveUrl && (
                    <Link
                      href={secondaryProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      aria-label={`View ${secondaryProject.title} live`}
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {secondaryProject.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {secondaryProject.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0 text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
