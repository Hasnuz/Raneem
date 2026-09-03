import { Schema, model } from "mongoose";
import { options } from "./shared.js";
const schema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
    sessionVersion: { type: Number, default: 0 },
    twoFactorEnabled: { type: Boolean, default: false },
    loginCodeHash: { type: String, select: false },
    loginCodeExpiresAt: { type: Date, select: false },
    resetCodeHash: { type: String, select: false },
    resetCodeExpiresAt: { type: Date, select: false },
  },
  options,
);
export const User = model("User", schema);
