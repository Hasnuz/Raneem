import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/content";
import { getServices } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contact",
    "/services",
    "/blog",
    "/faq",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  const managed = await getServices();
  const slugs = new Set([
    ...services.map((item) => item.slug),
    ...managed.map((item) => item.slug),
  ]);
  const servicePages: MetadataRoute.Sitemap = Array.from(slugs).map((slug) => ({
    url: `${site.url}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return pages.concat(servicePages);
}
