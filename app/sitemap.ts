import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ProjectService } from "@/servers/services/project.service";
import { PostService } from "@/servers/services/post.service";
import { ServiceService } from "@/servers/services/service.service";

// Re-generate hourly so new projects/posts show up without a redeploy
export const revalidate = 3600;

const STATIC_ROUTES = ["", "/work", "/about", "/services", "/journal", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, services] = await Promise.all([
    ProjectService.listCards(),
    PostService.getAll(),
    ServiceService.getAll(),
  ]);

  return [
    ...STATIC_ROUTES.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      priority: path === "" ? 1 : 0.8,
    })),
    ...services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      priority: 0.7,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      priority: 0.7,
    })),
    ...posts
      .filter((p) => p.published)
      .map((p) => ({
        url: `${SITE_URL}/journal/${p.slug}`,
        lastModified: p.createdAt,
        priority: 0.6,
      })),
  ];
}
