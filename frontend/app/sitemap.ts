import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/content";
import { getPosts, getServices } from "@/lib/api";
import { enhancePost, isThinPost } from "@/lib/blogQuality";

// Update this only when shared static page content changes significantly.
const staticContentUpdatedAt = new Date("2026-09-05T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contact",
    "/services",
    "/blog",
    "/faq",
    "/compliance",
    "/privacy-policy",
    "/cookie-policy",
    "/terms",
    "/security",
    "/ar",
    "/ar/services",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: staticContentUpdatedAt,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  const [managed, posts] = await Promise.all([getServices(), getPosts()]);
  const slugs = new Set([
    ...services.map((item) => item.slug),
    ...managed.map((item) => item.slug),
  ]);
  const managedBySlug = new Map(managed.map((item) => [item.slug, item]));
  const servicePages: MetadataRoute.Sitemap = Array.from(slugs).map((slug) => {
    const reviewedAt = managedBySlug.get(slug)?.reviewedAt;
    return {
      url: `${site.url}/services/${slug}`,
      lastModified: reviewedAt ? new Date(reviewedAt) : staticContentUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });
  const arabicServicePages: MetadataRoute.Sitemap = Array.from(slugs).map((slug) => {
    const reviewedAt = managedBySlug.get(slug)?.reviewedAt;
    return {
      url: `${site.url}/ar/services/${slug}`,
      lastModified: reviewedAt ? new Date(reviewedAt) : staticContentUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });
  const blogPages: MetadataRoute.Sitemap = posts.map(enhancePost).filter((post) => !isThinPost(post)).map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: new Date(post.updatedAt), changeFrequency: "monthly", priority: 0.7 }));
  return pages.concat(servicePages, arabicServicePages, blogPages);
}
