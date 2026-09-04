import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { getPosts } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { enhancePost } from "@/lib/blogQuality";

export const metadata = pageMetadata({ title: "UAE Business Setup Guides & PRO Insights | Raneem", description: "Practical, reviewed guides about UAE company formation, visas, PRO services, licensing, attestation and government document processes.", path: "/blog" });
export const dynamic = "force-dynamic";

export default async function Blog() {
  const posts = (await getPosts()).map(enhancePost);
  return (
    <>
      <section className="bg-mist py-16 md:py-24">
        <div className="container">
          <p className="eyebrow">RANEEM INSIGHTS</p>
          <h1 className="display mt-5 max-w-4xl">
            Useful context before you apply.
          </h1>
          <p className="mt-6 max-w-2xl leading-7 text-slate-600">
            Reviewed guidance about business setup, government processes, visas
            and document services in the UAE.
          </p>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container">
          {posts.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  key={post._id}
                >
                  {post.featuredImage && (
                    <div className="-mx-6 -mt-6 mb-6 h-48 overflow-hidden rounded-t-2xl bg-mist">
                      <img
                        src={post.featuredImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-AE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Recently published"}
                  </div>
                  <h2 className="mt-6 text-xl font-extrabold leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                    {post.excerpt}
                  </p>
                  <Link
                    className="mt-6 flex items-center gap-2 text-sm font-bold text-royal"
                    href={`/blog/${post.slug}`}
                  >
                    Read guide <ArrowUpRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-mist p-10 text-center">
              <h2 className="text-xl font-extrabold">
                Guides are being prepared
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Published articles added through the Raneem admin dashboard will
                appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
