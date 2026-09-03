"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
export function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track("page_view");
    const consent = () => track("page_view");
    window.addEventListener("raneem-consent", consent);
    return () => window.removeEventListener("raneem-consent", consent);
  }, [pathname]);
  useEffect(() => {
    function click(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const label = (a.textContent || a.getAttribute("aria-label") || href)
        .trim()
        .slice(0, 160);
      if (href.startsWith("tel:")) track("phone_click", label);
      else if (href.startsWith("mailto:")) track("email_click", label);
      else if (href.includes("wa.me")) track("whatsapp_click", label);
      else if (a.closest("main")) track("cta_click", label);
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
