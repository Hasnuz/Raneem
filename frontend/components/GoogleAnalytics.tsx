"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const measurementId = "G-NRZZFRKDT9";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function GooglePageView({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ready || !window.gtag) return;
    const query = searchParams.toString();
    window.gtag("config", measurementId, {
      page_path: query ? `${pathname}?${query}` : pathname,
    });
  }, [pathname, ready, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncConsent = (event?: Event) => {
      const choice =
        event instanceof CustomEvent
          ? event.detail
          : localStorage.getItem("raneem_consent");
      if (choice === "accepted") setEnabled(true);
    };

    syncConsent();
    window.addEventListener("raneem-consent", syncConsent);
    return () => window.removeEventListener("raneem-consent", syncConsent);
  }, []);

  if (!enabled) return null;

  const initialize = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };
    window.gtag("js", new Date());
    setReady(true);
  };

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={initialize}
        onReady={initialize}
      />
      <Suspense fallback={null}>
        <GooglePageView ready={ready} />
      </Suspense>
    </>
  );
}
