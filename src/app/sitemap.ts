import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const SITE_URL = "https://www.apurvsinghal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: new Date("2026-09-28"),
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly" as const,
      priority: 1.0,
      lastModified: new Date("2026-09-29"),
    },
    {
      url: `${SITE_URL}/resume`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      lastModified: new Date("2026-09-29"),
    },
    ...projectPages,
  ];
}
