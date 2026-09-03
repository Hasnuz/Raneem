import { Schema, model } from "mongoose";
import { options } from "./shared.js";
const leadSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, required: true, trim: true },
    countryCode: String,
    service: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, maxlength: 120 },
    message: { type: String, trim: true, maxlength: 1000 },
    sourcePage: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,
    gclid: String,
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted", "Closed", "Spam"],
      default: "New",
      index: true,
    },
    notes: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
      index: true,
    },
    assignedTo: { type: String, trim: true, maxlength: 120 },
    followUpAt: Date,
    viewedAt: Date,
    activity: [
      {
        action: { type: String, required: true },
        detail: String,
        by: String,
        at: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    notificationSent: { type: Boolean, default: false },
    customerConfirmationSent: { type: Boolean, default: false },
    consent: { type: Boolean, required: true },
  },
  options,
);
leadSchema.index({ createdAt: -1, status: 1 });
export const Lead = model("Lead", leadSchema);
