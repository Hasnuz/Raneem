"use client";
import { useRef, useState } from "react";
import { services } from "@/lib/content";
import { track } from "@/lib/analytics";
export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const started = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setState("loading");
    setErrorMessage("");
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const api =
        process.env.NEXT_PUBLIC_API_URL ||
        `http://${window.location.hostname}:4000/api/v1`;
      const res = await fetch(`${api}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, sourcePage: location.pathname }),
      });
      if (!res.ok) {
        const result = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(result?.error || `Request failed (${res.status})`);
      }
      setState("success");
      track("form_success", String(payload.service || "Consultation"));
      formElement.reset();
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "The enquiry service is unavailable. Please check that the backend is running and try again.",
      );
      track("form_error", String(payload.service || "Consultation"));
    }
  }
  if (state === "success")
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"
      >
        <b>Thank you. Your enquiry has been received.</b>
        <p className="mt-2 text-sm">
          A member of the Raneem team will contact you using the details
          provided.
        </p>
      </div>
    );
  return (
    <form
      onSubmit={submit}
      onFocusCapture={() => {
        if (!started.current) {
          started.current = true;
          track("form_start", compact ? "Compact lead form" : "Lead form");
        }
      }}
      className={`grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}
    >
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="text-sm font-semibold">
        Name
        <input
          required
          name="firstName"
          minLength={2}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-royal"
          placeholder="Your name"
        />
      </label>
      <label className="text-sm font-semibold">
        Phone / WhatsApp
        <input
          required
          name="phone"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-royal"
          placeholder="+971"
        />
      </label>
      <label className="text-sm font-semibold">
        Email
        <input
          required
          type="email"
          name="email"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-royal"
          placeholder="you@company.com"
        />
      </label>
      <label className="text-sm font-semibold">
        Service
        <select
          name="service"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal"
        >
          <option value="General consultation">Select a service</option>
          {services.map((s) => (
            <option key={s.slug}>{s.title}</option>
          ))}
        </select>
      </label>
      <label
        className={`text-sm font-semibold ${compact ? "" : "md:col-span-2"}`}
      >
        How can we help?
        <textarea
          name="message"
          rows={3}
          maxLength={1000}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal"
          placeholder="Briefly describe your requirement"
        />
      </label>
      <label
        className={`flex items-start gap-2 text-xs font-normal text-slate-500 ${compact ? "" : "md:col-span-2"}`}
      >
        <input
          required
          type="checkbox"
          name="consent"
          value="true"
          className="mt-0.5"
        />
        I agree that Raneem may contact me about this enquiry.
      </label>
      {state === "error" && (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage} You can also call or use WhatsApp.
        </p>
      )}
      <button
        disabled={state === "loading"}
        className={`rounded-full bg-navy px-6 py-3.5 font-bold text-white hover:bg-royal disabled:opacity-60 ${compact ? "" : "md:col-span-2"}`}
      >
        {state === "loading" ? "Sending…" : "Request free consultation"}
      </button>
    </form>
  );
}
