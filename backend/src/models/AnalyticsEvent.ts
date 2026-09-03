import { Schema, model } from "mongoose";
import { options } from "./shared.js";

const analyticsEventSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
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
      ],
      required: true,
      index: true,
    },
    path: { type: String, required: true, index: true, maxlength: 500 },
    label: { type: String, maxlength: 160 },
    sessionId: { type: String, maxlength: 100, index: true },
    referrer: { type: String, maxlength: 500 },
    userAgent: { type: String, maxlength: 500 },
    metadata: { type: Schema.Types.Mixed },
  },
  options,
);

analyticsEventSchema.index({ createdAt: -1, type: 1 });
analyticsEventSchema.index({ path: 1, createdAt: -1 });

export const AnalyticsEvent = model("AnalyticsEvent", analyticsEventSchema);
