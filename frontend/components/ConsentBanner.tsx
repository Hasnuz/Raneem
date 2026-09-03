"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(!localStorage.getItem("raneem_consent")), []);
  function choose(value: "accepted" | "essential") {
    localStorage.setItem("raneem_consent", value);
    window.dispatchEvent(new CustomEvent("raneem-consent", { detail: value }));
    setVisible(false);
  }
  if (!visible) return null;
  return <aside className="fixed inset-x-3 bottom-20 z-[80] mx-auto max-w-3xl rounded-2xl border bg-white p-5 shadow-2xl md:bottom-5"><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><b className="text-navy">Your privacy choices</b><p className="mt-1 text-xs leading-5 text-slate-600">We use necessary browser storage for essential features. Optional first-party analytics helps us understand website usage and is activated only with your permission. <Link href="/cookie-policy" className="font-semibold text-royal underline">Cookie policy</Link></p></div><div className="flex gap-2"><button onClick={()=>choose("essential")} className="rounded-full border px-4 py-2 text-xs font-bold">Essential only</button><button onClick={()=>choose("accepted")} className="rounded-full bg-navy px-4 py-2 text-xs font-bold text-white">Accept analytics</button></div></div></aside>;
}
