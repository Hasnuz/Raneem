import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCTA, WhatsApp } from "@/components/CTAs";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { site } from "@/lib/site";
import { getPublicSettings } from "@/lib/api";
import { ChatAssistant } from "@/components/ChatAssistant";
import { ConsentBanner } from "@/components/ConsentBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { headers } from "next/headers";
import { defaultSocialImage } from "@/lib/seo";
const font = Manrope({ subsets: ["latin"], display: "swap" });
const defaultMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Dubai Business Setup & PRO Services | Raneem UAE",
    template: "%s | Raneem",
  },
  description:
    "Dubai business setup, PRO, visa, government transaction, document attestation and legal translation support.",
  alternates: { canonical: site.url },
  openGraph: { type: "website", siteName: site.name, locale: "en_AE", title: "Dubai Business Setup & PRO Services | Raneem UAE", description: "Dubai business setup, PRO, visa, government transaction, document attestation and legal translation support.", url: site.url, images: [defaultSocialImage] },
  twitter: { card: "summary_large_image", images: [defaultSocialImage.url] },
};
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return {
    ...defaultMetadata,
    title: settings.siteTitle || defaultMetadata.title,
    description: settings.siteDescription || defaultMetadata.description,
    alternates: {
      canonical: site.url,
      languages: {
        en: site.url,
        ar: `${site.url}/ar`,
        "x-default": site.url,
      },
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      images: settings.ogImage ? [settings.ogImage] : [defaultSocialImage],
    },
    twitter: { ...defaultMetadata.twitter, images: settings.ogImage ? [settings.ogImage] : [defaultSocialImage.url] },
  };
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-raneem-locale") === "ar" ? "ar" : "en";
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    logo: `${site.url}/images/raneem-logo.png`,
    image: `${site.url}/opengraph-image`,
    priceRange: "Contact for a case-specific quotation",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 3, Sultan Lootah Building, Al Qusais 2",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  };
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-scroll-behavior="smooth">
      <body className={font.className}>
        <GoogleAnalytics />
        <AnalyticsTracker />
        <a
          href="#main"
          className="fixed left-2 top-2 z-[100] -translate-y-20 bg-white p-3 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsApp />
        <ChatAssistant />
        <MobileCTA />
        <ConsentBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
