import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProjectBySlug, projects } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function getOverlapCount(source: string[], target: string[]) {
  const sourceSet = new Set(source);
  return target.filter((item) => sourceSet.has(item)).length;
}

function getRelatedProjectScore(currentSlug: string, currentProject: (typeof projects)[number], candidate: (typeof projects)[number]) {
  if (candidate.slug === currentSlug) {
    return -1;
  }

  const categoryOverlap = getOverlapCount(currentProject.categories, candidate.categories);
  const technologyOverlap = getOverlapCount(currentProject.technologies, candidate.technologies);
  const statusBonus = candidate.status === "Live" ? 1 : 0;

  // Prioritize domain overlap first, then stack similarity, then production readiness.
  return categoryOverlap * 4 + technologyOverlap * 2 + statusBonus;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = `${project.title} | Case Study`;
  const description = project.summary;
  const projectUrl = `https://apurvsinghal.com/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title,
      description,
      url: projectUrl,
      images: [`/projects/${project.slug}/opengraph-image`],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/projects/${project.slug}/opengraph-image`],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = projects
    .map((candidate) => ({
      candidate,
      score: getRelatedProjectScore(project.slug, project, candidate),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ candidate }) => candidate);

  const projectUrl = `https://apurvsinghal.com/projects/${project.slug}`;
  const pageId = `${projectUrl}#webpage`;
  const sourceCodeId = `${projectUrl}#software-source`;
  const breadcrumbsId = `${projectUrl}#breadcrumbs`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageId,
        url: projectUrl,
        name: `${project.title} | Case Study`,
        description: project.summary,
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://apurvsinghal.com/#website",
        },
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": sourceCodeId,
        name: project.title,
        description: project.summary,
        codeRepository: project.githubUrl,
        url: project.liveUrl ?? projectUrl,
        programmingLanguage: project.technologies,
        keywords: [...project.categories, ...project.technologies].join(", "),
        mainEntityOfPage: {
          "@id": pageId,
        },
        creator: {
          "@type": "Person",
          "@id": "https://apurvsinghal.com/#person",
          name: "Apurv Singhal",
          url: "https://apurvsinghal.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbsId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://apurvsinghal.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: "https://apurvsinghal.com/#projects",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: projectUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background py-24">
      <div className="mx-auto max-w-4xl px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <Link
          href="/#projects"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Back to Projects
        </Link>

        <header className="mt-8">
          <p className="text-xs uppercase tracking-wider text-primary font-semibold">Case Study</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-foreground text-balance">
            {project.title}
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{project.summary}</p>
        </header>

        <section className="mt-10 rounded-xl border border-black/[0.08] dark:border-white/[0.08] p-6 bg-white/60 dark:bg-white/[0.04]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Overview</h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {project.technicalDetails}
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-black/[0.08] dark:border-white/[0.08] p-6 bg-white/60 dark:bg-white/[0.04]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Key Highlights
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-xl border border-black/[0.08] dark:border-white/[0.08] p-6 bg-white/60 dark:bg-white/[0.04]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Technology</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary border-0">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-wrap gap-3">
          {project.githubUrl ? (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Github size={16} />
              Source Code
            </Link>
          ) : null}
          {project.liveUrl ? (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:text-primary hover:border-primary/40 transition-colors"
            >
              <ArrowUpRight size={16} />
              Live Demo
            </Link>
          ) : null}
        </section>

        <section className="mt-10 rounded-xl border border-black/[0.08] dark:border-white/[0.08] p-6 bg-white/60 dark:bg-white/[0.04]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Related Projects
          </h2>

          {relatedProjects.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.slug}
                  href={`/projects/${relatedProject.slug}`}
                  className="rounded-lg border border-border px-4 py-3 hover:border-primary/40 transition-colors"
                >
                  <p className="text-sm font-medium text-foreground">{relatedProject.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {relatedProject.summary}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              More case studies are being added soon.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
