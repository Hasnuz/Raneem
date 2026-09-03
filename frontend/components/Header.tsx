"use client";
import Link from "next/link";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { site, waLink } from "@/lib/site";
const groups = [
  {
    label: "Business Setup",
    links: [
      ["Business Setup UAE", "/services/business-setup-uae"],
      ["Business Setup Dubai", "/services/business-setup-dubai"],
      ["Mainland Formation", "/services/mainland-company-formation"],
      ["Free Zone Formation", "/services/free-zone-company-formation"],
    ],
  },
  {
    label: "PRO Services",
    links: [
      ["PRO Services Dubai", "/services/pro-services-dubai"],
      ["Trade Licence Renewal", "/services/trade-license-renewal-dubai"],
    ],
  },
  {
    label: "Visa Services",
    links: [["UAE Visa Services", "/services/uae-visa-services"]],
  },
  {
    label: "Documents",
    links: [
      ["Document Attestation", "/services/document-attestation-dubai"],
      ["Legal Translation", "/services/legal-translation-dubai"],
    ],
  },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const languageHref = arabic ? (pathname.replace(/^\/ar/, "") || "/") : `/ar${pathname === "/" ? "" : pathname}`;
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container flex h-[76px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <Link href="/" className="text-sm font-semibold text-slate-700">
            {arabic ? "الرئيسية" : "Home"}
          </Link>
          {groups.map((g) => (
            <div className="group relative" key={g.label}>
              <button className="focus-ring rounded py-5 text-sm font-semibold text-slate-700">
                {g.label}
              </button>
              <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {g.links.map(([l, h]) => (
                  <Link
                    className="block rounded-lg px-3 py-2.5 text-sm hover:bg-mist"
                    href={h}
                    key={h}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            href={arabic ? "/ar/services" : "/services"}
            className="text-sm font-semibold text-slate-700"
          >
            {arabic ? "جميع الخدمات" : "All services"}
          </Link>
          <Link href="/about" className="text-sm font-semibold text-slate-700">
            {arabic ? "من نحن" : "About"}
          </Link>
          <Link href={languageHref} className="rounded-full border px-4 py-2 text-sm font-bold">{arabic ? "English" : "العربية"}</Link>
          <Link
            href="/contact"
            className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-royal"
          >
            {arabic ? "استشارة مجانية" : "Free consultation"}
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="focus-ring rounded-lg p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="absolute inset-x-0 top-full max-h-[calc(100svh-76px)] overflow-y-auto border-t bg-white px-5 pb-6 shadow-xl lg:hidden"
        >
          <Link
            href={arabic ? "/ar" : "/"}
            onClick={() => setOpen(false)}
            className="block border-b border-slate-100 py-4 text-sm font-semibold"
          >
            {arabic ? "الرئيسية" : "Home"}
          </Link>
          {groups.map((g) => (
            <div key={g.label}>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-gold">
                {g.label}
              </p>
              {g.links.map(([l, h]) => (
                <Link
                  onClick={() => setOpen(false)}
                  className="block border-b border-slate-100 py-3 text-sm"
                  href={h}
                  key={h}
                >
                  {l}
                </Link>
              ))}
            </div>
          ))}
          <Link
            href={arabic ? "/ar/services" : "/services"}
            onClick={() => setOpen(false)}
            className="mt-4 block border-b border-slate-100 py-3 text-sm font-semibold"
          >
            {arabic ? "جميع الخدمات" : "All services"}
          </Link>
          <Link href={languageHref} onClick={() => setOpen(false)} className="block border-b border-slate-100 py-3 text-sm font-semibold">{arabic ? "English" : "العربية"}</Link>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <a
              href={`tel:${site.phone}`}
              className="flex items-center justify-center gap-2 rounded-lg border p-3"
            >
              <Phone size={17} /> Call
            </a>
            <a
              href={waLink()}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#167d52] p-3 text-white"
            >
              <MessageCircle size={17} /> WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
