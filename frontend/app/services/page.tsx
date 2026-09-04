import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services as existingServices } from "@/lib/content";
import { getServices } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "UAE Business Setup, PRO & Visa Services | Raneem", description: "Explore Raneem's UAE business setup, PRO, visa, licensing, attestation and government document services in Dubai.", path: "/services", languages: { en: "/services", ar: "/ar/services", "x-default": "/services" } });

export default async function ServicesPage() {
  const managed = await getServices();
  const items = [
    ...existingServices,
    ...managed.filter(
      (item) =>
        !existingServices.some((existing) => existing.slug === item.slug),
    ),
  ];

  return (
    <>
      <section className="bg-ink py-16 text-white md:py-24">
        <div className="container">
          <p className="eyebrow">OUR SERVICES</p>
          <h1 className="display mt-5 max-w-4xl">
            Practical support for business in the UAE.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Explore company formation, government transactions, visas,
            licensing, attestation and document support.
          </p>
        </div>
      </section>
      <section className="bg-mist py-16 md:py-24">
        <div className="container grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
            <Link
              href={`/services/${service.slug}`}
              key={service.slug}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft md:p-7"
            >
              <p className="eyebrow">{service.eyebrow || "RANEEM · UAE"}</p>
              <h2 className="mt-5 text-xl font-extrabold">{service.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                {service.summary}
              </p>
              <span className="mt-7 flex items-center gap-2 text-sm font-bold text-royal">
                View service <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
