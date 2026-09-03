import { services } from "@/lib/content";
export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about UAE business setup, PRO, visa and document services.",
  alternates: { canonical: "/faq" },
};
export default function FAQ() {
  return (
    <>
      <section className="bg-mist py-24">
        <div className="container">
          <p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p>
          <h1 className="display mt-5">Start with a practical answer.</h1>
        </div>
      </section>
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
