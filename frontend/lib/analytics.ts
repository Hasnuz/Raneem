const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
export type EventType =
  | "page_view"
  | "cta_click"
  | "phone_click"
  | "whatsapp_click"
  | "email_click"
  | "form_start"
  | "form_success"
  | "form_error"
  | "chat_open"
  | "chat_message";
export function track(type: EventType, label?: string) {
  if (typeof window === "undefined" || location.pathname.startsWith("/admin"))
    return;
  if (localStorage.getItem("raneem_consent") !== "accepted") return;
  let sessionId = sessionStorage.getItem("raneem_session");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("raneem_session", sessionId);
  }
  fetch(`${API}/analytics/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      path: location.pathname,
      label,
      sessionId,
      referrer: document.referrer,
    }),
    keepalive: true,
  }).catch(() => undefined);
}
