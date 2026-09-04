import type { Metadata } from "next";
import { site } from "./site";

export const defaultSocialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Raneem Businessmen Services in Dubai",
};

export function pageMetadata({
  title,
  description,
  path,
  languages,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  languages?: Record<string, string>;
  type?: "website" | "article";
}): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: site.name,
      locale: path.startsWith("/ar") ? "ar_AE" : "en_AE",
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultSocialImage.url],
    },
  };
}
