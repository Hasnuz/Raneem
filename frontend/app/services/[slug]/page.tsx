import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { services, bySlug } from "@/lib/content";
import { BottomCTA } from "@/components/CTAs";
import { LeadForm } from "@/components/LeadForm";
import { site } from "@/lib/site";
import { getService } from "@/lib/api";
import type { Service } from "@/lib/content";
import { defaultSocialImage } from "@/lib/seo";

async function findService(slug: string): Promise<Service | undefined> {
  const managed = await getService(slug);
  if (!managed) {
    const fallback = bySlug(slug);
    return fallback ? { ...fallback, ...guidanceFor(slug) } : undefined;
  }
  const guidance = guidanceFor(slug);
  return {
    slug: managed.slug,
    title: managed.title,
    eyebrow: managed.eyebrow || "BUSINESS SERVICES · UAE",
    summary: managed.summary,
    description: managed.description,
    includes: managed.includes || [],
    audience: managed.audience || [],
    notFor: managed.notFor?.length ? managed.notFor : guidance.notFor || [],
    requiredDocuments: managed.requiredDocuments?.length ? managed.requiredDocuments : guidance.requiredDocuments || [],
    processSteps: managed.processSteps?.length ? managed.processSteps : guidance.processSteps || [],
    costFactors: managed.costFactors?.length ? managed.costFactors : guidance.costFactors || [],
    timingFactors: managed.timingFactors?.length ? managed.timingFactors : guidance.timingFactors || [],
    authorities: managed.authorities?.length ? managed.authorities : guidance.authorities || [],
    delayCauses: managed.delayCauses?.length ? managed.delayCauses : guidance.delayCauses || [],
    reviewedAt: managed.reviewedAt,
    related: managed.related || [],
    faq: (managed.faqs || []).map(({ question, answer }) => ({
      q: question,
      a: answer,
    })),
  };
}

function guidanceFor(slug: string): Partial<Service> {
  const businessSetup = slug.includes("business-setup") || slug.includes("company-formation");
  if (businessSetup) return {
    requiredDocuments: ["Passport copy for each proposed shareholder and manager", "UAE visa and Emirates ID copies where applicable", "Proposed activities, trade names and ownership percentages", "Corporate shareholder documents, if a company will hold shares", "Qualifications, business plan or external approval documents for regulated activities"],
    processSteps: ["Confirm the intended activities, owners, customer market and visa needs.", "Compare suitable mainland or free-zone routes and the complete setup obligations.", "Reserve the trade name and obtain initial or activity approval where required.", "Prepare incorporation documents and satisfy workspace or external-approval requirements.", "Pay confirmed charges, receive the licence and complete applicable post-licensing registrations."],
    costFactors: ["Mainland or free-zone jurisdiction and selected package", "Number and type of licensed activities", "Legal form, shareholder structure and document attestations", "Workspace or facility requirements", "Visa allocation, immigration registration and external approvals"],
    timingFactors: ["Trade-name and activity approval", "Completeness and consistency of shareholder documents", "Corporate shareholder or overseas-document processing", "Premises selection and lease registration", "Review by any sector-specific authority"],
    authorities: ["The relevant emirate economic-development authority or selected free-zone authority", "Immigration, labour, tax, customs or sector regulators where applicable"],
    delayCauses: ["Activity descriptions that do not match the intended business", "Expired, unclear or inconsistent identity documents", "Outstanding external approvals", "Changes to ownership, manager or premises during the application", "Late signatures or payments"],
    notFor: ["Applicants seeking guaranteed government approval or a guaranteed completion date", "Businesses needing independent legal, tax or regulated investment advice beyond company-setup coordination"],
  };
  return {
    requiredDocuments: ["Passport or Emirates ID copy, as applicable", "Existing licence, visa or transaction documents relevant to the request", "Clear supporting documents with consistent names and dates", "Any authority reference number or previous correspondence"],
    costFactors: ["Type and number of transactions", "Official authority charges", "Translation, attestation, courier or urgent-processing requirements", "Complexity of corrections or supporting approvals"],
    timingFactors: ["Document readiness", "Authority review and appointment availability", "External approval or verification requirements", "Public holidays and requested corrections"],
    delayCauses: ["Missing, expired or inconsistent documents", "Unclear scans or incorrect application information", "Pending external approval", "Changes requested after submission"],
  };
}
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const managed = await getService(slug);
  const s = managed ? await findService(slug) : bySlug(slug);
  if (!s) return {};
  return {
    title: { absolute: managed?.seoTitle || `${s.title} Services in Dubai | Raneem UAE` },
    description: managed?.seoDescription || s.summary,
    openGraph: {
      title: s.title,
      description: s.summary,
      url: `/services/${s.slug}`,
      siteName: site.name,
      images: [defaultSocialImage],
    },
    twitter: { card: "summary_large_image", title: s.title, description: managed?.seoDescription || s.summary, images: [defaultSocialImage.url] },
    alternates: { canonical: `/services/${s.slug}`, languages: { en: `/services/${s.slug}`, ar: `/ar/services/${s.slug}`, "x-default": `/services/${s.slug}` } },
  };
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = await findService(slug);
  if (!s) notFound();
  const crumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${site.url}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: s.title,
        item: `${site.url}/services/${s.slug}`,
      },
    ],
  };
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.summary,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
  };
  const faqSchema = s.faq.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faq.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) } : null;
  return (
    <>
      <section className="bg-ink py-14 text-white md:py-20">
        <div className="container">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-400"
          >
            <Link href="/">Home</Link>
            <ChevronRight size={13} />
            <span>Services</span>
            <ChevronRight size={13} />
            <span>{s.title}</span>
          </nav>
          <p className="eyebrow mt-16">{s.eyebrow}</p>
          <h1 className="display mt-5 max-w-4xl">{s.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {s.summary}
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-block rounded-full bg-white px-6 py-3.5 font-bold text-navy"
          >
            Discuss your requirement
          </Link>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container grid gap-16 lg:grid-cols-[1fr_380px]">
          <article>
            <p className="eyebrow">OVERVIEW</p>
            <h2 className="section-title mt-4">
              A clearer route from requirement to completion
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {s.description}
            </p>
            <h2 className="mt-14 text-3xl font-extrabold">
              What Raneem can assist with
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {s.includes.map((x) => (
                <li
                  className="flex gap-3 rounded-xl bg-mist p-4 text-sm"
                  key={x}
                >
                  <Check className="shrink-0 text-gold" size={19} />
                  {x}
                </li>
              ))}
            </ul>
            <h2 className="mt-14 text-3xl font-extrabold">
              Who this service is for
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {s.audience.map((x) => (
                <span
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm"
                  key={x}
                >
                  {x}
                </span>
              ))}
            </div>
            <h2 className="mt-14 text-3xl font-extrabold">
              How the process works
            </h2>
            <ol className="mt-6 border-l border-slate-300 pl-6">
              {(s.processSteps?.length ? s.processSteps : [
                "Tell us the intended outcome and current status.",
                "We review the applicable route and likely document requirements.",
                "Documents are prepared and the application is coordinated.",
                "We follow up and keep you informed through completion.",
              ]).map((x, i) => (
                <li
                  className="relative pb-7 text-slate-600 before:absolute before:-left-[29px] before:top-1 before:h-2 before:w-2 before:rounded-full before:bg-gold"
                  key={x}
                >
                  <b className="block text-ink">0{i + 1}</b>
                  {x}
                </li>
              ))}
            </ol>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <InfoPanel title="Typical documents" items={s.requiredDocuments} empty="Your exact checklist is confirmed after the initial review." />
              <InfoPanel title="Who it may not suit" items={s.notFor} empty="Suitability depends on your activity, jurisdiction and intended outcome." />
              <InfoPanel title="What affects cost" items={s.costFactors} empty="Official fees and professional scope are confirmed before work begins." />
              <InfoPanel title="What affects timing" items={s.timingFactors} empty="Processing time depends on document readiness and authority review." />
              <InfoPanel title="Authorities involved" items={s.authorities} empty="The relevant authority is confirmed for your specific application." />
              <InfoPanel title="Common causes of delay" items={s.delayCauses} empty="Incomplete, inconsistent or expired documents are common causes of delay." />
            </div>
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
              Requirements, fees, eligibility and processing periods can change
              and may depend on the activity, jurisdiction, applicant and
              authority. Raneem confirms current requirements for each case
              before submission.
            </p>
            {s.reviewedAt && <p className="mt-3 text-xs text-slate-500">Information reviewed: {new Date(s.reviewedAt).toLocaleDateString("en-AE", { dateStyle: "long" })}</p>}
          </article>
          <aside>
            <div className="rounded-2xl border border-slate-200 bg-mist p-5 lg:sticky lg:top-28 lg:p-6">
              <h2 className="text-xl font-extrabold">Request a callback</h2>
              <p className="mb-6 mt-2 text-sm text-slate-600">
                A short form for a focused first conversation.
              </p>
              <LeadForm compact />
            </div>
          </aside>
        </div>
      </section>
      <section className="bg-mist py-16 md:py-24">
        <div className="container">
          <p className="eyebrow">COMMON QUESTIONS</p>
          <h2 className="section-title mt-4">Before you begin</h2>
          <div className="mt-10 max-w-4xl divide-y divide-slate-200">
            {s.faq.map((f) => (
              <details className="group py-5" key={f.q}>
                <summary className="cursor-pointer list-none pr-8 text-lg font-bold">
                  {f.q}
                </summary>
                <p className="mt-3 max-w-3xl leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          <h3 className="mt-16 text-xl font-extrabold">Related services</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {s.related.map((r) => {
              const item = bySlug(r);
              return item ? (
                <Link
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                  href={`/services/${r}`}
                  key={r}
                >
                  {item.title}
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </section>
      <BottomCTA title={`Need help with ${s.title.toLowerCase()}?`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }}
      />
    </>
  );
}

function InfoPanel({ title, items, empty }: { title: string; items?: string[]; empty: string }) {
  return <section className="rounded-2xl border border-slate-200 p-5"><h3 className="font-extrabold text-navy">{title}</h3>{items?.length ? <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">{items.map(item => <li key={item}>{item}</li>)}</ul> : <p className="mt-3 text-sm leading-6 text-slate-600">{empty}</p>}</section>;
}
