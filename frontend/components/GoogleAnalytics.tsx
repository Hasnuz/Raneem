"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const measurementId = "G-NRZZFRKDT9";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function GooglePageView({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!enabled || !window.gtag) return;
    const query = searchParams.toString();
    window.gtag("config", measurementId, {
      page_path: query ? `${pathname}?${query}` : pathname,
    });
  }, [enabled, pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = (event?: Event) => {
      const choice =
        event instanceof CustomEvent
          ? event.detail
          : localStorage.getItem("raneem_consent");
      const accepted = choice === "accepted";
      window.gtag?.("consent", "update", {
        analytics_storage: accepted ? "granted" : "denied",
      });
      setEnabled(accepted);
    };

    syncConsent();
    window.addEventListener("raneem-consent", syncConsent);
    return () => window.removeEventListener("raneem-consent", syncConsent);
  }, []);

  return (
    <Suspense fallback={null}>
      <GooglePageView enabled={enabled} />
    </Suspense>
  );
}
