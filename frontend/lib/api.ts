export type PublicPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt?: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  sources?: { title: string; url: string; reviewedAt?: string }[];
  authorName?: string;
  category?: string;
  relatedServices?: string[];
};
export type PublicClientLogo = {
  _id: string;
  name: string;
  imageData: string;
  order: number;
};
export type PublicService = {
  _id: string;
  title: string;
  slug: string;
  eyebrow?: string;
  summary: string;
  description: string;
  includes?: string[];
  audience?: string[];
  notFor?: string[];
  requiredDocuments?: string[];
  processSteps?: string[];
  costFactors?: string[];
  timingFactors?: string[];
  authorities?: string[];
  delayCauses?: string[];
  reviewedAt?: string;
  ar?: { title?: string; eyebrow?: string; summary?: string; description?: string; includes?: string[]; audience?: string[]; notFor?: string[]; requiredDocuments?: string[]; processSteps?: string[]; costFactors?: string[]; timingFactors?: string[]; delayCauses?: string[]; faqs?: { question: string; answer: string }[] };
  related?: string[];
  faqs?: { question: string; answer: string }[];
  seoTitle?: string;
  seoDescription?: string;
  category?: string;
  order?: number;
  featured?: boolean;
  featuredImage?: string;
};
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
export async function getPosts(): Promise<PublicPost[]> {
  try {
    const r = await fetch(`${API}/blog`, { cache: "no-store" });
    if (!r.ok) return [];
    return r.json();
  } catch {
    return [];
  }
}
export async function getPost(slug: string): Promise<PublicPost | null> {
  try {
    const r = await fetch(`${API}/blog/${slug}`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}
export async function getClientLogos(): Promise<PublicClientLogo[]> {
  try {
    const r = await fetch(`${API}/clients`, { cache: "no-store" });
    if (!r.ok) return [];
    return r.json();
  } catch {
    return [];
  }
}
export async function getService(slug: string): Promise<PublicService | null> {
  try {
    const response = await fetch(`${API}/services/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
export async function getServices(): Promise<PublicService[]> {
  try {
    const response = await fetch(`${API}/services`, { cache: "no-store" });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
export type PublicTestimonial = {
  _id: string;
  name: string;
  company?: string;
  rating: number;
  review: string;
};
export async function getTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const response = await fetch(`${API}/testimonials`, { cache: "no-store" });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
export async function getPublicSettings(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${API}/settings/public`, {
      cache: "no-store",
    });
    if (!response.ok) return {};
    const items = (await response.json()) as { key: string; value: string }[];
    return Object.fromEntries(items.map((item) => [item.key, item.value]));
  } catch {
    return {};
  }
}
export type PublicGovernmentEntity = { _id: string; name: string; nameAr?: string; imageData: string; website?: string };
export async function getGovernmentEntities(): Promise<PublicGovernmentEntity[]> {
  try {
    const response = await fetch(`${API}/government-entities`, { cache: "no-store" });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
