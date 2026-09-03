import type { Request, Response } from "express";
import { z } from "zod";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";

const eventSchema = z.object({
  type: z.enum([
    "page_view",
    "cta_click",
    "phone_click",
    "whatsapp_click",
    "email_click",
    "form_start",
    "form_success",
    "form_error",
    "chat_open",
    "chat_message",
  ]),
  path: z.string().min(1).max(500),
  label: z.string().max(160).optional(),
  sessionId: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function recordEvent(req: Request, res: Response) {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid analytics event" });
  await AnalyticsEvent.create({
    ...parsed.data,
    userAgent: req.get("user-agent")?.slice(0, 500),
  });
  return res.status(202).json({ success: true });
}
