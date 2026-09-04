import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/content";
import { getPosts, getServices } from "@/lib/api";
import { enhancePost, isThinPost } from "@/lib/blogQuality";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
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
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  const [managed, posts] = await Promise.all([getServices(), getPosts()]);
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
  const arabicServicePages: MetadataRoute.Sitemap = Array.from(slugs).map((slug) => ({ url: `${site.url}/ar/services/${slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 }));
  const blogPages: MetadataRoute.Sitemap = posts.map(enhancePost).filter((post) => !isThinPost(post)).map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: new Date(post.updatedAt), changeFrequency: "monthly", priority: 0.7 }));
  return pages.concat(servicePages, arabicServicePages, blogPages);
}
