import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const SITE_URL = "https://apurvsinghal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    lastModified: new Date(),
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    ...projectPages,
  ];
}
