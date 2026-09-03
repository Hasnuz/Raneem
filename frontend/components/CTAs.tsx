"use client";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { site, waLink } from "@/lib/site";
export function WhatsApp() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#167d52] text-white shadow-lg md:flex"
      aria-label="Chat with Raneem on WhatsApp"
    >
      <MessageCircle />
    </a>
  );
}
export function MobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-1 border-t border-slate-200 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(7,21,38,.1)] backdrop-blur md:hidden">
      <a
        href={`tel:${site.phone}`}
        className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg p-1 text-[11px] font-semibold"
      >
        <Phone size={18} />
        Call
      </a>
      <a
        href={waLink()}
        className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg bg-[#167d52] p-1 text-[11px] font-semibold text-white"
      >
        <MessageCircle size={18} />
        WhatsApp
      </a>
      <Link
        href="/contact"
        className="grid min-h-12 place-items-center rounded-lg bg-navy p-1 text-center text-[11px] font-semibold text-white"
      >
        Consultation
      </Link>
    </div>
  );
}
export function BottomCTA({
  title = "Tell us what you need. We’ll map the next steps.",
}: {
  title?: string;
}) {
  return (
    <section className="bg-navy py-20 text-white">
      <div className="container grid items-end gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow">START WITH A CLEAR ANSWER</p>
          <h2 className="section-title mt-4 max-w-3xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-slate-300">
            Share your requirement and our Dubai team will review the
            appropriate route, documents and next steps.
          </p>
        </div>
        <Link
          href="/contact"
          className="rounded-full bg-white px-7 py-4 text-center font-bold text-navy"
        >
          Request a free consultation
        </Link>
      </div>
    </section>
  );
}
