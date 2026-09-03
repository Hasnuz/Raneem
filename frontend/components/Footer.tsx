import Link from "next/link";
import { Logo } from "./Logo";
import { site, waLink } from "@/lib/site";

const linkClass = "block py-1 text-sm transition hover:text-royal";
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pb-28 pt-14 text-slate-600 md:pb-8 md:pt-16">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Logo size="large" />
            <p className="mt-4 max-w-md text-sm leading-7">
              Dubai-based support for company formation, PRO services, visas,
              government transactions and document services across the UAE.
            </p>
            <Link
              href="/contact"
              className="mt-5 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-royal"
            >
              Request a consultation
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-mist shadow-sm">
            <iframe
              title="Raneem Businessmen Services office location in Al Qusais 2, Dubai"
              src={mapSrc}
              className="h-[240px] w-full border-0 sm:h-[280px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-center text-xs leading-5 sm:text-left">
                Office 3, Sultan Lootah Building, Al Qusais 2, Dubai
              </p>
              <a
                href={site.maps}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-center text-sm font-bold text-royal"
              >
                Open directions →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-t border-slate-200 pt-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1fr_1fr_1.4fr] lg:gap-16">
          <FooterGroup title="Services">
            <Link className={linkClass} href="/services/business-setup-uae">
              Business setup
            </Link>
            <Link className={linkClass} href="/services/pro-services-dubai">
              PRO services
            </Link>
            <Link className={linkClass} href="/services/uae-visa-services">
              Visa services
            </Link>
            <Link
              className={linkClass}
              href="/services/document-attestation-dubai"
            >
              Document attestation
            </Link>
          </FooterGroup>

          <FooterGroup title="Company">
            <Link className={linkClass} href="/about">
              About Raneem
            </Link>
            <Link className={linkClass} href="/blog">
              Insights
            </Link>
            <Link className={linkClass} href="/faq">
              FAQs
            </Link>
            <Link className={linkClass} href="/contact">
              Contact
            </Link>
            <Link className={linkClass} href="/compliance">
              Compliance centre
            </Link>
          </FooterGroup>

          <div className="flex flex-col items-center sm:col-span-2 sm:items-start lg:col-span-1">
            <b className="text-navy">Contact our Dubai office</b>
            <address className="mt-3 max-w-sm text-sm not-italic leading-7">
              {site.address}
            </address>
            <div className="mt-3 flex flex-col items-center gap-2 sm:items-start">
              <a
                className="font-semibold text-navy transition hover:text-royal"
                href={`tel:${site.phone}`}
              >
                {site.phoneDisplay}
              </a>
              <a
                className="break-all font-semibold text-navy transition hover:text-royal"
                href={`mailto:${site.email}`}
              >
                {site.email}
              </a>
              <a
                className="mt-1 text-sm font-semibold text-royal"
                href={waLink()}
              >
                Message on WhatsApp →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-slate-200 pt-6 text-center text-xs leading-5 text-slate-500 md:mt-12 md:flex-row md:items-start md:justify-between md:text-left">
          <span>© {new Date().getFullYear()} Raneem Businessmen Services.</span>
          <span className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/cookie-policy">Cookies</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/security">Security</Link>
          </span>
          <span className="max-w-2xl md:text-right">
            Independent business-services provider. Government approvals remain
            subject to the relevant authorities.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <b className="text-navy">{title}</b>
      <div className="mt-3 space-y-1">{children}</div>
    </div>
  );
}
