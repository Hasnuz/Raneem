import { services } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "UAE Business Setup & PRO Services FAQs | Raneem", description: "Answers to common questions about UAE business setup, PRO services, visas, licensing, attestation and document services.", path: "/faq" });
export default function FAQ() {
  const questions = services.slice(0, 6).flatMap((service) => service.faq).map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } }));
  return (
    <>
      <section className="bg-mist py-24">
        <div className="container">
          <p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p>
          <h1 className="display mt-5">Start with a practical answer.</h1>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions }) }} />
      <section className="py-20">
        <div className="container max-w-4xl">
          {services.slice(0, 6).map((s) => (
            <div className="mb-12" key={s.slug}>
              <h2 className="text-2xl font-extrabold">{s.title}</h2>
              <div className="mt-4 divide-y">
                {s.faq.map((f) => (
                  <details className="py-5" key={f.q}>
                    <summary className="cursor-pointer font-bold">
                      {f.q}
                    </summary>
                    <p className="mt-3 leading-7 text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
