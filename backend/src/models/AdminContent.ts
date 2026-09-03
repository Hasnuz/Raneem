import { Schema, model } from "mongoose";
import { options } from "./shared.js";

const mediaSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    alt: { type: String, trim: true, maxlength: 200 },
    imageData: { type: String, required: true, select: false },
    mimeType: {
      type: String,
      required: true,
      enum: ["image/png", "image/jpeg", "image/webp", "image/gif"],
    },
    size: { type: Number, required: true, max: 2_000_000 },
  },
  options,
);

const redirectSchema = new Schema(
  {
    from: { type: String, required: true, unique: true, trim: true },
    to: { type: String, required: true, trim: true },
    permanent: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  options,
);

const auditSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: String,
    action: { type: String, required: true, index: true },
    target: String,
    ip: String,
    details: Schema.Types.Mixed,
  },
  options,
);
const governmentEntitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    nameAr: { type: String, trim: true, maxlength: 160 },
    imageData: { type: String, required: true, select: false },
    website: { type: String, trim: true, maxlength: 500 },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  options,
);

export const MediaAsset = model("MediaAsset", mediaSchema);
export const Redirect = model("Redirect", redirectSchema);
export const AdminAudit = model("AdminAudit", auditSchema);
export const GovernmentEntity = model("GovernmentEntity", governmentEntitySchema);
