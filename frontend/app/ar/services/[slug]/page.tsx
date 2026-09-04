import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/lib/api";
import { arabicServiceNames, arabicServiceSummary } from "@/lib/arabic";
import { bySlug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const managed = await getService(slug);
  const fallback = bySlug(slug);
  if (!managed && !fallback) return {};
  const title = managed?.ar?.title || arabicServiceNames[slug] || managed?.title || fallback!.title;
  const description = managed?.ar?.summary || arabicServiceSummary;
  return pageMetadata({ title: `${title} | رَنيم دبي`, description, path: `/ar/services/${slug}`, languages: { en: `/services/${slug}`, ar: `/ar/services/${slug}`, "x-default": `/services/${slug}` } });
}

export default async function ArabicService({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const managed = await getService(slug);
  const fallback = bySlug(slug);
  if (!managed && !fallback) notFound();
  const ar = managed?.ar;
  const title = ar?.title || arabicServiceNames[slug] || managed?.title || fallback!.title;
  const summary = ar?.summary || arabicServiceSummary;
  const description = ar?.description || "تختلف المتطلبات والرسوم والمدة حسب النشاط والجهة وحالة مقدم الطلب. يؤكد فريق رَنيم المعلومات الحالية قبل البدء.";
  const blocks = [
    ["المستندات المتوقعة", ar?.requiredDocuments || managed?.requiredDocuments],
    ["خطوات الإجراء", ar?.processSteps || managed?.processSteps],
    ["العوامل المؤثرة في التكلفة", ar?.costFactors || managed?.costFactors],
    ["العوامل المؤثرة في المدة", ar?.timingFactors || managed?.timingFactors],
    ["أسباب التأخير الشائعة", ar?.delayCauses || managed?.delayCauses],
  ] as const;
  return <><section className="bg-ink py-20 text-white"><div className="container"><Link href="/ar/services" className="text-sm text-slate-300">الخدمات ←</Link><h1 className="display mt-7">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{summary}</p></div></section><article className="container py-16"><h2 className="section-title">نظرة عامة</h2><p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">{description}</p><div className="mt-12 grid gap-5 md:grid-cols-2">{blocks.map(([heading, items]) => <section className="rounded-2xl border p-6" key={heading}><h2 className="text-xl font-extrabold">{heading}</h2>{items?.length ? <ul className="mt-4 list-disc space-y-2 pr-5 text-slate-600">{items.map(item => <li key={item}>{item}</li>)}</ul> : <p className="mt-4 text-sm leading-6 text-slate-600">يتم تأكيد التفاصيل الدقيقة بعد مراجعة الحالة.</p>}</section>)}</div><p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">المعلومات إرشادية وقد تتغير متطلبات الجهات ورسومها ومددها. سنؤكد التفاصيل الحالية قبل تقديم الطلب.</p><Link href="/contact" className="mt-8 inline-block rounded-full bg-navy px-6 py-3 text-white">اطلب استشارة</Link></article></>;
}
