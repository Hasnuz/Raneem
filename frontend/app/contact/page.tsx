import { LeadForm } from "@/components/LeadForm";
import { site, waLink } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "Contact Raneem Businessmen Services in Dubai", description: "Contact Raneem in Al Qusais 2, Dubai for a consultation about UAE business setup, PRO services, visas or document processing.", path: "/contact" });
export default function Contact() {
  return (
    <>
      <section className="bg-ink py-14 text-white md:py-20">
        <div className="container">
          <p className="eyebrow">CONTACT · DUBAI</p>
          <h1 className="display mt-5">Let’s review your requirement.</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Use the form or speak to our team directly by phone or WhatsApp.
          </p>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container grid gap-14 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <h2 className="text-2xl font-extrabold">
              Raneem Businessmen Services
            </h2>
            <address className="mt-6 not-italic leading-8 text-slate-600">
              {site.address}
            </address>
            <a
              className="mt-6 block text-xl font-bold text-navy"
              href={`tel:${site.phone}`}
            >
              {site.phoneDisplay}
            </a>
            <a className="mt-3 block text-royal" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="rounded-full bg-[#167d52] px-5 py-3 font-bold text-white"
                href={waLink()}
              >
                WhatsApp Raneem
              </a>
              <a
                className="rounded-full border px-5 py-3 font-bold"
                href={site.maps}
              >
                Get directions
              </a>
            </div>
            <p className="mt-8 text-xs leading-5 text-slate-500">
              Business hours are not shown because they have not yet been
              confirmed. Please call before visiting.
            </p>
          </div>
          <div className="rounded-2xl bg-mist p-5 sm:p-7 md:p-10">
            <h2 className="text-2xl font-extrabold">
              Request a free consultation
            </h2>
            <p className="mb-7 mt-2 text-sm text-slate-600">
              Fields marked by the browser as required must be completed.
            </p>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
