import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

type TokenPayload = {
  sub: string;
  role: "admin" | "editor";
  email: string;
  ver?: number;
};

function readCookie(req: Request, name: string) {
  const cookies = req.headers.cookie?.split(";") ?? [];
  const match = cookies
    .map((item) => item.trim().split("="))
    .find(([key]) => key === name);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = readCookie(req, "raneem_admin");
  const secret = process.env.JWT_SECRET;
  if (!token || !secret)
    return res.status(401).json({ error: "Authentication required" });
  try {
    const payload = jwt.verify(token, secret) as TokenPayload;
    const user = await User.findById(payload.sub)
      .select("active role email sessionVersion")
      .lean();
    if (!user?.active || user.sessionVersion !== (payload.ver || 0))
      return res.status(401).json({ error: "Session revoked" });
    res.locals.user = { ...payload, role: user.role, email: user.email };
    next();
  } catch {
    return res.status(401).json({ error: "Session expired" });
  }
}

export function requireAdmin(_req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.role !== "admin")
    return res.status(403).json({ error: "Admin access required" });
  next();
}
