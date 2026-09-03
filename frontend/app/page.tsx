import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  FileCheck,
  Languages,
  Landmark,
  ShieldCheck,
  Stamp,
  Users,
} from "lucide-react";
import { BottomCTA } from "@/components/CTAs";
import { LeadForm } from "@/components/LeadForm";
import { services } from "@/lib/content";
import { waLink } from "@/lib/site";
import { getClientLogos, getGovernmentEntities, getServices, getTestimonials } from "@/lib/api";
import { defaultClientLogos } from "@/lib/clients";
const featured = [
  services[0],
  services[4],
  services[5],
  services[6],
  services[7],
  services[8],
];
const icons = [Building2, Landmark, Users, Stamp, Languages, FileCheck];
export default async function Home() {
  const [managedPartners, testimonials, managedServices, governmentEntities] = await Promise.all([
    getClientLogos(),
    getTestimonials(),
    getServices(),
    getGovernmentEntities(),
  ]);
  const homepageServices = [
    ...featured,
    ...managedServices.filter(
      (service) =>
        service.featured &&
        !featured.some((existing) => existing.slug === service.slug),
    ),
  ];
  const partnerLogos = [
    ...defaultClientLogos.map(([name, file]) => ({
      name,
      src: `/clients/${file}`,
    })),
    ...managedPartners.map((partner) => ({
      name: partner.name,
      src: partner.imageData,
    })),
  ];

  return (
    <>
      <section className="relative min-h-[620px] overflow-hidden bg-ink text-white md:min-h-[720px]">
        <Image
          src="/images/dubai-business-hero-v2.png"
          alt="Dubai skyline viewed from a contemporary business office"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/10" />
        <div className="container relative flex min-h-[620px] items-center py-16 md:min-h-[720px] md:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">BUSINESS SERVICES · DUBAI · UAE</p>
            <h1 className="display mt-5">
              Business setup and PRO services, handled with clarity.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 md:mt-7 md:text-lg md:leading-8">
              Raneem supports entrepreneurs, companies, HR teams and individuals
              with UAE company formation, visas, government transactions,
              licensing, attestation and document services.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/contact"
                className="rounded-full bg-white px-6 py-3.5 text-center font-bold text-navy"
              >
                Get a free consultation
              </Link>
              <Link
                href="#services"
                className="rounded-full border border-white/40 px-6 py-3.5 text-center font-bold text-white"
              >
                Explore services
              </Link>
              <a
                href={waLink()}
                className="hidden rounded-full border border-emerald-300/50 px-6 py-3.5 text-center font-bold text-emerald-100 sm:inline-block"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b bg-white">
        <div className="container grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
          <Trust value="25+" label="Years of UAE experience" />
          <Trust value="100K+" label="Clients served" />
          <Trust value="MULTI" label="Multilingual support" />
          <Trust value="A–Z" label="End-to-end coordination" />
        </div>
      </section>
      <TrustedPartners partners={partnerLogos} />
      {governmentEntities.length > 0 && (
        <section className="border-b bg-mist py-14 md:py-20">
          <div className="container text-center">
            <p className="eyebrow">GOVERNMENT SERVICE CHANNELS</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-.035em] md:text-4xl">Authorities and service channels we work with.</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600">Raneem coordinates applications and transactions involving relevant UAE authorities according to each case. Displayed trademarks belong to their respective owners and do not imply endorsement or partnership.</p>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {governmentEntities.map((entity) => {
                const content = <><div className="relative h-16 w-full"><Image src={entity.imageData} alt={`${entity.name} logo`} fill sizes="180px" className="object-contain"/></div><b className="mt-3 block text-xs">{entity.name}</b></>;
                return entity.website ? <a key={entity._id} href={entity.website} target="_blank" rel="noreferrer" className="rounded-xl border bg-white p-4 transition hover:-translate-y-1 hover:shadow-soft">{content}</a> : <div key={entity._id} className="rounded-xl border bg-white p-4">{content}</div>;
              })}
            </div>
          </div>
        </section>
      )}
      <section id="services" className="bg-mist py-16 md:py-24">
        <div className="container">
          <div className="grid items-end gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[1.15fr_.65fr] lg:gap-16 lg:pb-12">
            <div>
              <p className="eyebrow">WHAT WE DO</p>
              <h2 className="mt-4 max-w-4xl text-[clamp(2rem,3.5vw,3.7rem)] font-semibold leading-[1.05] tracking-[-.045em] text-ink">
                Business and government services, all in one place.
              </h2>
            </div>
            <div className="border-l-2 border-gold pl-5 lg:mb-1">
              <p className="text-sm font-bold uppercase tracking-[.14em] text-navy">
                Six core service areas
              </p>
              <p className="mt-3 max-w-lg leading-7 text-slate-600">
                One experienced Dubai team coordinating company formation,
                visas, licensing and essential government processes.
              </p>
            </div>
          </div>
          <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-slate-400 md:hidden">
            Swipe to explore services
          </p>
          <div className="-mx-3 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
            {homepageServices.map((s, i) => {
              const Icon = icons[i] || Building2;
              return (
                <Link
                  href={`/services/${s.slug}`}
                  key={s.slug}
                  className="group min-w-[82vw] snap-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft sm:min-w-[360px] md:min-w-0 md:p-7"
                >
                  <Icon className="text-gold" />
                  <h3 className="mt-8 text-xl font-extrabold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {s.summary}
                  </p>
                  <span className="mt-7 flex items-center gap-2 text-sm font-bold text-royal">
                    View service <ArrowUpRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-end gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[1.15fr_.65fr] lg:gap-16 lg:pb-12">
            <div>
              <p className="eyebrow">CHOOSE THE RIGHT FOUNDATION</p>
              <h2 className="mt-4 max-w-4xl text-[clamp(2rem,3.5vw,3.7rem)] font-semibold leading-[1.05] tracking-[-.045em] text-ink">
                Start with the structure that fits your plans.
              </h2>
            </div>
            <div className="border-l-2 border-gold pl-5 lg:mb-1">
              <p className="text-sm font-bold uppercase tracking-[.14em] text-navy">
                Mainland · Free zone · Offshore
              </p>
              <p className="mt-3 max-w-lg leading-7 text-slate-600">
                Compare operating scope, facilities, visa needs and authority
                requirements before choosing a route.
              </p>
            </div>
          </div>
          <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-slate-400 md:hidden">
            Swipe to compare setup types
          </p>
          <div className="-mx-3 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
            <Setup
              n="01"
              title="Mainland"
              text="For businesses considering broad UAE market access, local premises and activities regulated through the relevant economic authority."
              href="mainland-company-formation"
            />
            <Setup
              n="02"
              title="Free zone"
              text="For founders comparing specialised jurisdictions, facility options, visa packages and internationally focused operating models."
              href="free-zone-company-formation"
            />
            <Setup
              n="03"
              title="Offshore"
              text="For specific international holding or asset structures, subject to professional legal and tax advice and authority requirements."
              href="business-setup-uae"
            />
          </div>
        </div>
      </section>
      <section className="bg-ink py-16 text-white md:py-24">
        <div className="container">
          <div className="grid items-end gap-8 border-b border-white/15 pb-10 lg:grid-cols-[1.15fr_.65fr] lg:gap-16 lg:pb-12">
            <div>
              <p className="eyebrow">WHY RANEEM</p>
              <h2 className="mt-4 max-w-4xl text-[clamp(2rem,3.5vw,3.7rem)] font-semibold leading-[1.05] tracking-[-.045em] text-white">
                Experience that shows up in the details.
              </h2>
            </div>
            <p className="border-l-2 border-gold pl-5 leading-7 text-slate-300 lg:mb-1">
              Government procedures are rarely difficult for just one reason.
              Documents, approvals, translations and timing all connect. Raneem
              coordinates the full picture and keeps communication direct.
            </p>
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <ShieldCheck className="text-gold" size={42} />
              <div>
                <b className="block text-lg text-white">Established in 2001</b>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                  Dubai-based coordination with multilingual support and more
                  than two decades of UAE experience.
                </p>
              </div>
            </div>
            <ol className="space-y-1">
              {[
                "Consultation and route review",
                "Requirement and document check",
                "Application or government submission",
                "Follow-up with the relevant parties",
                "Completion and document delivery",
              ].map((x, i) => (
                <li
                  key={x}
                  className="grid grid-cols-[48px_1fr] border-b border-white/10 py-4 text-sm md:grid-cols-[64px_1fr] md:py-5 md:text-base"
                >
                  <span className="font-mono text-gold">0{i + 1}</span>
                  <b>{x}</b>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-end gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[1.15fr_.65fr] lg:gap-16 lg:pb-12">
            <div>
              <p className="eyebrow">WHO WE HELP</p>
              <h2 className="mt-4 max-w-4xl text-[clamp(2rem,3.5vw,3.7rem)] font-semibold leading-[1.05] tracking-[-.045em] text-ink">
                Support shaped around your responsibilities.
              </h2>
            </div>
            <p className="border-l-2 border-gold pl-5 leading-7 text-slate-600 lg:mb-1">
              From a first licence to a recurring employee transaction, the goal
              is the same: a clear requirement, an organised submission and
              responsive follow-up.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-2 md:mt-12 md:grid md:grid-cols-3 md:gap-px md:overflow-hidden md:rounded-2xl md:bg-slate-200">
            {[
              "Entrepreneurs",
              "Startups",
              "SMEs",
              "Established companies",
              "International investors",
              "HR departments",
              "Families",
              "Individuals",
              "Operations teams",
            ].map((x) => (
              <div
                className="rounded-full bg-mist px-4 py-2.5 text-sm font-bold md:rounded-none md:p-6 md:text-base"
                key={x}
              >
                {x}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-mist py-16 md:py-24">
        {testimonials.length > 0 && (
          <div className="container mb-16 md:mb-24">
            <div className="text-center">
              <p className="eyebrow">CLIENT EXPERIENCES</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">
                What our clients say.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => (
                <figure
                  key={item._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div
                    className="text-gold"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {"★".repeat(item.rating)}
                  </div>
                  <blockquote className="mt-4 text-sm leading-7 text-slate-600">
                    “{item.review}”
                  </blockquote>
                  <figcaption className="mt-5">
                    <b>{item.name}</b>
                    {item.company && (
                      <span className="block text-xs text-slate-500">
                        {item.company}
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
        <div className="container">
          <div className="grid items-end gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[1.15fr_.65fr] lg:gap-16 lg:pb-12">
            <div>
              <p className="eyebrow">FREE CONSULTATION</p>
              <h2 className="mt-4 max-w-4xl text-[clamp(2rem,3.5vw,3.7rem)] font-semibold leading-[1.05] tracking-[-.045em] text-ink">
                Begin with your actual requirement.
              </h2>
            </div>
            <p className="border-l-2 border-gold pl-5 leading-7 text-slate-600 lg:mb-1">
              Tell us the service, current status and preferred contact method.
              We’ll follow up without making you complete a lengthy
              questionnaire.
            </p>
          </div>
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:mt-12 lg:p-10">
            <LeadForm />
          </div>
        </div>
      </section>
      <div className="hidden md:block">
        <BottomCTA title="Your next government process can start with a clear plan." />
      </div>
    </>
  );
}

function TrustedPartners({
  partners,
}: {
  partners: { name: string; src: string }[];
}) {
  return (
    <section
      className="overflow-hidden border-b border-slate-200 bg-white py-14 md:py-20"
      aria-labelledby="trusted-partners-title"
    >
      <div className="container text-center">
        <p className="eyebrow">TRUSTED BY BUSINESSES</p>
        <h2
          id="trusted-partners-title"
          className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-.035em] text-ink md:text-4xl"
        >
          Partners who trust Raneem to keep business moving.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          Proud to support organisations across industries with dependable UAE
          business and government services.
        </p>
      </div>

      <div className="partner-marquee mt-9 md:mt-12">
        <div className="partner-marquee-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="partner-logo-group"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {partners.map(({ name, src }) => (
                <div
                  key={`${copy}-${name}-${src.slice(0, 40)}`}
                  className="group flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_8px_30px_rgba(7,21,38,.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(7,21,38,.12)] md:h-28 md:w-48 md:px-7"
                  title={name}
                >
                  <div className="relative h-14 w-full md:h-16">
                    <Image
                      src={src}
                      alt={copy === 0 ? `${name} logo` : ""}
                      fill
                      sizes="(max-width: 768px) 160px, 192px"
                      className="object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 py-6 text-center md:px-6 md:py-7">
      <b className="text-2xl text-navy">{value}</b>
      <span className="mt-1 block text-[11px] leading-4 text-slate-500 md:text-xs">
        {label}
      </span>
    </div>
  );
}
function Setup({
  n,
  title,
  text,
  href,
}: {
  n: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <article className="min-w-[82vw] snap-start rounded-2xl border border-slate-200 bg-white p-6 sm:min-w-[360px] md:min-w-0 md:p-8">
      <span className="font-mono text-sm text-gold">{n}</span>
      <h3 className="mt-8 text-2xl font-extrabold">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
      <Link
        className="mt-7 inline-block font-bold text-royal"
        href={`/services/${href}`}
      >
        Explore {title} setup →
      </Link>
    </article>
  );
}
