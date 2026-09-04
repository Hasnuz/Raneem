import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getPost } from "@/lib/api";
import { site } from "@/lib/site";
import { BottomCTA } from "@/components/CTAs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultSocialImage } from "@/lib/seo";
import { enhancePost, isThinPost } from "@/lib/blogQuality";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rawPost = await getPost(slug);
  if (!rawPost) return {};
  const post = enhancePost(rawPost);
  const image = post.featuredImage || defaultSocialImage.url;
  const url = `${site.url}/blog/${post.slug}`;
  return {
    title: { absolute: post.seoTitle || `${post.title} | Raneem` },
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      url,
      siteName: site.name,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.seoDescription || post.excerpt, images: [image] },
    robots: isThinPost(post) ? { index: false, follow: true } : { index: true, follow: true },
  };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawPost = await getPost(slug);
  if (!rawPost) notFound();
  const post = enhancePost(rawPost);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    image: post.featuredImage || `${site.url}/opengraph-image`,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.url }, { "@type": "ListItem", position: 2, name: "Insights", item: `${site.url}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${post.slug}` }] };
  return (
    <>
      <article>
        <header className="bg-mist py-14 md:py-20">
          <div className="container max-w-4xl">
            <nav
              className="flex items-center gap-2 text-xs text-slate-500"
              aria-label="Breadcrumb"
            >
              <Link href="/">Home</Link>
              <ChevronRight size={13} />
              <Link href="/blog">Insights</Link>
              <ChevronRight size={13} />
              <span className="truncate">{post.title}</span>
            </nav>
            <p className="eyebrow mt-12">RANEEM BUSINESS GUIDE</p>
            <h1 className="section-title mt-4">{post.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>
                Published{" "}
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-AE")
                  : "recently"}
              </span>
              <span>
                Updated {new Date(post.updatedAt).toLocaleDateString("en-AE")}
              </span>
              {post.authorName && <span>By {post.authorName}</span>}
              {post.category && <span>{post.category}</span>}
            </div>
          </div>
        </header>
        {post.featuredImage && (
          <div className="container max-w-5xl pt-10">
            <img
              src={post.featuredImage}
              alt=""
              className="max-h-[520px] w-full rounded-2xl object-cover shadow-soft"
            />
          </div>
        )}
        <div className="container max-w-3xl py-14 md:py-20">
          <div className="blog-content text-[17px] leading-8 text-slate-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
          {post.sources?.length ? (
            <section className="mt-14 border-t pt-8">
              <h2 className="text-xl font-extrabold">Sources</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      className="text-royal underline"
                      href={s.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {post.relatedServices?.length ? (
            <section className="mt-10 border-t pt-8">
              <h2 className="text-xl font-extrabold">Related services</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.relatedServices.map((slug) => (
                  <Link
                    key={slug}
                    href={`/services/${slug}`}
                    className="rounded-full border px-4 py-2 text-sm font-semibold"
                  >
                    {slug.replaceAll("-", " ")}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          <p className="mt-12 rounded-xl bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            UAE procedures can change. Confirm current requirements for your
            specific activity, authority and circumstances before applying.
          </p>
        </div>
      </article>
      <BottomCTA title="Have a question about this process?" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
