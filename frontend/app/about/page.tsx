import { BottomCTA } from "@/components/CTAs";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "About Raneem Businessmen Services | Dubai UAE", description: "Meet the Dubai team supporting companies and individuals with UAE business setup, government transactions and document services since 2001.", path: "/about" });
export default function About() {
  return (
    <>
      <section className="bg-mist py-16 md:py-24">
        <div className="container">
          <p className="eyebrow">ABOUT RANEEM</p>
          <h1 className="display mt-5 max-w-4xl">
            Long UAE experience. Direct, personal support.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            Raneem Businessmen Services is a Dubai-based consultancy
            coordinating business setup, PRO, visa, licensing, attestation and
            related government-document work.
          </p>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="section-title">
              Built around practical follow-through
            </h2>
            <p className="mt-6 leading-8 text-slate-600">
              Established in 2001, Raneem has grown through detailed service and
              long-term client relationships. Our role is to understand the
              requirement, organise the documents, coordinate the relevant
              process and keep the client informed.
            </p>
            <p className="mt-5 leading-8 text-slate-600">
              We work with entrepreneurs, investors, companies, HR teams,
              families and individuals. Multilingual support helps keep
              communication clear across parties.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat n="25+" t="Years of experience" />
            <Stat n="100K+" t="Clients served" />
            <Stat n="Dubai" t="Al Qusais 2 office" />
            <Stat n="MULTI" t="Multilingual support" />
          </div>
        </div>
      </section>
      <section className="bg-ink py-16 text-white md:py-24">
        <div className="container grid gap-8 md:grid-cols-3">
          {[
            [
              "Clarity",
              "Explain the route and requirements without unnecessary complexity.",
            ],
            [
              "Responsibility",
              "Take ownership of coordination and keep communication active.",
            ],
            [
              "Respect",
              "Treat documents, deadlines and personal information with care.",
            ],
          ].map(([h, p]) => (
            <article key={h} className="border-t border-gold pt-6">
              <h3 className="text-2xl font-bold">{h}</h3>
              <p className="mt-4 leading-7 text-slate-300">{p}</p>
            </article>
          ))}
        </div>
      </section>
      <BottomCTA />
    </>
  );
}
function Stat({ n, t }: { n: string; t: string }) {
  return (
    <div className="rounded-2xl bg-mist p-5 md:p-7">
      <b className="text-3xl text-navy">{n}</b>
      <p className="mt-2 text-sm text-slate-500">{t}</p>
    </div>
  );
}
