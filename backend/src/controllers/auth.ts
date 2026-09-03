import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { AdminAudit } from "../models/AdminContent.js";
import {
  sendAdminLoginCode,
  sendPasswordResetCode,
} from "../services/email.js";
import crypto from "node:crypto";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});
const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
});

function setSession(
  res: Response,
  user: { _id: unknown; role: string; email: string; sessionVersion?: number },
) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return false;
  const token = jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
      email: user.email,
      ver: user.sessionVersion || 0,
    },
    secret,
    { expiresIn: "8h" },
  );
  res.cookie("raneem_admin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 8 * 60 * 60 * 1000,
    path: "/",
  });
  return true;
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Enter a valid email and password" });
  const user = await User.findOne({
    email: parsed.data.email.toLowerCase(),
    active: true,
  }).select("+passwordHash");
  if (
    !user ||
    !(await bcrypt.compare(parsed.data.password, user.passwordHash))
  ) {
    await AdminAudit.create({
      email: parsed.data.email.toLowerCase(),
      action: "login_failed",
      ip: req.ip,
    });
    return res.status(401).json({ error: "Invalid email or password" });
  }
  if (user.twoFactorEnabled) {
    const code = String(crypto.randomInt(100000, 1000000));
    user.loginCodeHash = await bcrypt.hash(code, 10);
    user.loginCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendAdminLoginCode(user.email, code);
    return res.json({ requiresTwoFactor: true, email: user.email });
  }
  if (!setSession(res, user))
    return res.status(503).json({ error: "Authentication is not configured" });
  user.lastLoginAt = new Date();
  await user.save();
  await AdminAudit.create({
    userId: user._id,
    email: user.email,
    action: "login_success",
    ip: req.ip,
  });
  return res.json({
    user: { name: user.name, email: user.email, role: user.role },
  });
}

export async function verifyTwoFactor(req: Request, res: Response) {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Enter the six-digit code" });
  const user = await User.findOne({
    email: parsed.data.email.toLowerCase(),
    active: true,
  }).select("+loginCodeHash +loginCodeExpiresAt");
  if (
    !user?.loginCodeHash ||
    !user.loginCodeExpiresAt ||
    user.loginCodeExpiresAt < new Date() ||
    !(await bcrypt.compare(parsed.data.code, user.loginCodeHash))
  )
    return res
      .status(401)
      .json({ error: "The verification code is invalid or expired" });
  user.loginCodeHash = undefined;
  user.loginCodeExpiresAt = undefined;
  user.lastLoginAt = new Date();
  await user.save();
  if (!setSession(res, user))
    return res.status(503).json({ error: "Authentication is not configured" });
  await AdminAudit.create({
    userId: user._id,
    email: user.email,
    action: "login_2fa_success",
    ip: req.ip,
  });
  return res.json({
    user: { name: user.name, email: user.email, role: user.role },
  });
}

export async function requestPasswordReset(req: Request, res: Response) {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Enter a valid email" });
  const user = await User.findOne({
    email: parsed.data.email.toLowerCase(),
    active: true,
  }).select("+resetCodeHash +resetCodeExpiresAt");
  if (user) {
    const code = String(crypto.randomInt(100000, 1000000));
    user.resetCodeHash = await bcrypt.hash(code, 10);
    user.resetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendPasswordResetCode(user.email, code);
  }
  return res.json({
    success: true,
    message: "If the account exists, a reset code has been emailed.",
  });
}

export async function resetPassword(req: Request, res: Response) {
  const parsed = z
    .object({
      email: z.string().email(),
      code: z.string().regex(/^\d{6}$/),
      password: z.string().min(12).max(200),
    })
    .safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Check the reset code and new password" });
  const user = await User.findOne({
    email: parsed.data.email.toLowerCase(),
    active: true,
  }).select("+resetCodeHash +resetCodeExpiresAt +passwordHash");
  if (
    !user?.resetCodeHash ||
    !user.resetCodeExpiresAt ||
    user.resetCodeExpiresAt < new Date() ||
    !(await bcrypt.compare(parsed.data.code, user.resetCodeHash))
  )
    return res
      .status(401)
      .json({ error: "The reset code is invalid or expired" });
  user.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  user.resetCodeHash = undefined;
  user.resetCodeExpiresAt = undefined;
  user.sessionVersion += 1;
  await user.save();
  await AdminAudit.create({
    userId: user._id,
    email: user.email,
    action: "password_reset",
    ip: req.ip,
  });
  return res.json({ success: true });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("raneem_admin", { path: "/" });
  return res.json({ success: true });
}

export function me(_req: Request, res: Response) {
  return res.json({ user: res.locals.user });
}
