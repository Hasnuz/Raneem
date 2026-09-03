import Link from "next/link";
export default function NotFound() {
  return (
    <section className="grid min-h-[65vh] place-items-center bg-mist px-5 text-center">
      <div>
        <p className="eyebrow">404 · PAGE NOT FOUND</p>
        <h1 className="section-title mt-4">
          This page has moved or does not exist.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-navy px-6 py-3 text-white"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
