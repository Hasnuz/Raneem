import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { MediaAsset, Redirect, AdminAudit, GovernmentEntity } from "../models/AdminContent.js";
import { SiteSetting, Testimonial } from "../models/Content.js";
import { User } from "../models/User.js";

const imageData = z
  .string()
  .max(2_700_000)
  .regex(/^data:image\/(png|jpeg|webp|gif);base64,/);

export async function listMedia(_req: Request, res: Response) {
  return res.json(
    await MediaAsset.find().select("+imageData").sort({ createdAt: -1 }).lean(),
  );
}
export async function createMedia(req: Request, res: Response) {
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(140),
      alt: z.string().max(200).optional(),
      imageData,
      mimeType: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
      size: z.number().max(2_000_000),
    })
    .safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Check the image file and details" });
  return res.status(201).json(await MediaAsset.create(parsed.data));
}
export async function deleteMedia(req: Request, res: Response) {
  const item = await MediaAsset.findByIdAndDelete(req.params.id);
  return item
    ? res.json({ success: true })
    : res.status(404).json({ error: "Media not found" });
}

const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional(),
  rating: z.number().int().min(1).max(5),
  review: z.string().trim().min(10).max(1200),
  source: z.string().trim().max(100).optional(),
  published: z.boolean(),
  order: z.number().int().min(0).max(10000),
});
export async function publicTestimonials(_req: Request, res: Response) {
  return res.json(
    await Testimonial.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean(),
  );
}
export async function listTestimonials(_req: Request, res: Response) {
  return res.json(
    await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean(),
  );
}
export async function createTestimonial(req: Request, res: Response) {
  const parsed = testimonialSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Check the testimonial fields" });
  return res.status(201).json(await Testimonial.create(parsed.data));
}
export async function updateTestimonial(req: Request, res: Response) {
  const parsed = testimonialSchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid testimonial update" });
  const item = await Testimonial.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  });
  return item
    ? res.json(item)
    : res.status(404).json({ error: "Testimonial not found" });
}
export async function deleteTestimonial(req: Request, res: Response) {
  const item = await Testimonial.findByIdAndDelete(req.params.id);
  return item
    ? res.json({ success: true })
    : res.status(404).json({ error: "Testimonial not found" });
}

export async function listSettings(_req: Request, res: Response) {
  const [settings, redirects] = await Promise.all([
    SiteSetting.find().lean(),
    Redirect.find().sort({ createdAt: -1 }).lean(),
  ]);
  return res.json({ settings, redirects });
}
export async function saveSettings(req: Request, res: Response) {
  const parsed = z
    .record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
    .safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid settings" });
  await Promise.all(
    Object.entries(parsed.data).map(([key, value]) =>
      SiteSetting.findOneAndUpdate(
        { key },
        { key, value, group: "seo" },
        { upsert: true },
      ),
    ),
  );
  return res.json({ success: true });
}
export async function createRedirect(req: Request, res: Response) {
  const parsed = z
    .object({
      from: z.string().startsWith("/").max(300),
      to: z.string().min(1).max(500),
      permanent: z.boolean().default(true),
      active: z.boolean().default(true),
    })
    .safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid redirect" });
  return res.status(201).json(
    await Redirect.findOneAndUpdate({ from: parsed.data.from }, parsed.data, {
      upsert: true,
      new: true,
    }),
  );
}
export async function deleteRedirect(req: Request, res: Response) {
  await Redirect.findByIdAndDelete(req.params.id);
  return res.json({ success: true });
}

export async function listUsers(_req: Request, res: Response) {
  const [users, audit] = await Promise.all([
    User.find().sort({ createdAt: -1 }).lean(),
    AdminAudit.find().sort({ createdAt: -1 }).limit(100).lean(),
  ]);
  return res.json({ users, audit });
}
export async function createUser(req: Request, res: Response) {
  const parsed = z
    .object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(12).max(200),
      role: z.enum(["admin", "editor"]),
    })
    .safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Check the account fields" });
  const user = await User.create({
    ...parsed.data,
    email: parsed.data.email.toLowerCase(),
    passwordHash: await bcrypt.hash(parsed.data.password, 12),
    active: true,
  });
  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
export async function updateUser(req: Request, res: Response) {
  const parsed = z
    .object({
      active: z.boolean().optional(),
      role: z.enum(["admin", "editor"]).optional(),
      twoFactorEnabled: z.boolean().optional(),
    })
    .safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid account update" });
  const item = await User.findByIdAndUpdate(
    req.params.id,
    { $set: parsed.data, $inc: { sessionVersion: 1 } },
    { new: true },
  );
  return item
    ? res.json(item)
    : res.status(404).json({ error: "Account not found" });
}
export async function changePassword(req: Request, res: Response) {
  const parsed = z
    .object({
      currentPassword: z.string().min(8),
      newPassword: z.string().min(12).max(200),
    })
    .safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Use a new password of at least 12 characters" });
  const user = await User.findById(res.locals.user.sub).select("+passwordHash");
  if (
    !user ||
    !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))
  )
    return res.status(401).json({ error: "Current password is incorrect" });
  user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  user.sessionVersion += 1;
  await user.save();
  return res.json({ success: true, signedOut: true });
}
export async function revokeSessions(_req: Request, res: Response) {
  await User.findByIdAndUpdate(res.locals.user.sub, {
    $inc: { sessionVersion: 1 },
  });
  res.clearCookie("raneem_admin", { path: "/" });
  return res.json({ success: true });
}

const governmentEntitySchema = z.object({ name: z.string().trim().min(2).max(160), nameAr: z.string().trim().max(160).optional(), imageData, website: z.string().url().max(500).optional().or(z.literal("")), order: z.number().int().min(0).max(10000).default(0), active: z.boolean().default(true) });
export async function publicGovernmentEntities(_req: Request, res: Response) {
  return res.json(await GovernmentEntity.find({ active: true }).select("+imageData").sort({ order: 1, createdAt: 1 }).lean());
}
export async function listGovernmentEntities(_req: Request, res: Response) {
  return res.json(await GovernmentEntity.find().select("+imageData").sort({ order: 1, createdAt: 1 }).lean());
}
export async function createGovernmentEntity(req: Request, res: Response) {
  const parsed = governmentEntitySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Check the authority name, website and logo" });
  return res.status(201).json(await GovernmentEntity.create(parsed.data));
}
export async function updateGovernmentEntity(req: Request, res: Response) {
  const parsed = governmentEntitySchema.omit({ imageData: true }).partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid authority update" });
  const item = await GovernmentEntity.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).select("+imageData");
  return item ? res.json(item) : res.status(404).json({ error: "Authority not found" });
}
export async function deleteGovernmentEntity(req: Request, res: Response) {
  await GovernmentEntity.findByIdAndDelete(req.params.id);
  return res.json({ success: true });
}
