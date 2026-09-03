import type { Request, Response } from "express";
import { z } from "zod";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { BlogPost, ClientLogo, Service } from "../models/Content.js";
import { Lead } from "../models/Lead.js";

const postSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(10).max(400),
  content: z.string().min(20),
  status: z.enum(["draft", "review", "published"]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
  tags: z.array(z.string().max(40)).max(15).default([]),
  featuredImage: z.string().max(2_700_000).optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
  authorName: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  relatedServices: z.array(z.string().trim().max(160)).max(20).default([]),
});
const leadStatus = z.object({
  status: z
    .enum(["New", "Contacted", "Qualified", "Converted", "Closed", "Spam"])
    .optional(),
  notes: z.string().max(2000).optional(),
  priority: z.enum(["Low", "Normal", "High", "Urgent"]).optional(),
  assignedTo: z.string().trim().max(120).optional(),
  followUpAt: z.coerce.date().nullable().optional(),
});
const clientLogoSchema = z.object({
  name: z.string().trim().min(2).max(100),
  imageData: z
    .string()
    .max(2_100_000)
    .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/),
  mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  order: z.number().int().min(0).max(10000).default(0),
  active: z.boolean().default(true),
});
const clientLogoUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  order: z.number().int().min(0).max(10000).optional(),
  active: z.boolean().optional(),
});
const serviceSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  eyebrow: z.string().trim().max(100).optional(),
  summary: z.string().trim().min(10).max(400),
  description: z.string().trim().min(20).max(3000),
  includes: z.array(z.string().trim().min(2).max(200)).max(30).default([]),
  audience: z.array(z.string().trim().min(2).max(120)).max(20).default([]),
  related: z.array(z.string().trim().max(160)).max(12).default([]),
  category: z.string().trim().max(80).optional(),
  order: z.number().int().min(0).max(10000).default(0),
  featured: z.boolean().default(false),
  featuredImage: z.string().max(2_700_000).optional(),
  notFor: z.array(z.string().trim().min(2).max(200)).max(30).default([]),
  requiredDocuments: z.array(z.string().trim().min(2).max(200)).max(40).default([]),
  processSteps: z.array(z.string().trim().min(2).max(300)).max(20).default([]),
  costFactors: z.array(z.string().trim().min(2).max(200)).max(20).default([]),
  timingFactors: z.array(z.string().trim().min(2).max(200)).max(20).default([]),
  authorities: z.array(z.string().trim().min(2).max(160)).max(20).default([]),
  delayCauses: z.array(z.string().trim().min(2).max(200)).max(20).default([]),
  reviewedAt: z.coerce.date().nullable().optional(),
  ar: z.object({
    title: z.string().trim().max(160).optional(),
    eyebrow: z.string().trim().max(100).optional(),
    summary: z.string().trim().max(400).optional(),
    description: z.string().trim().max(3000).optional(),
    includes: z.array(z.string().max(200)).max(30).default([]),
    audience: z.array(z.string().max(120)).max(20).default([]),
    notFor: z.array(z.string().max(200)).max(30).default([]),
    requiredDocuments: z.array(z.string().max(200)).max(40).default([]),
    processSteps: z.array(z.string().max(300)).max(20).default([]),
    costFactors: z.array(z.string().max(200)).max(20).default([]),
    timingFactors: z.array(z.string().max(200)).max(20).default([]),
    delayCauses: z.array(z.string().max(200)).max(20).default([]),
    faqs: z.array(z.object({ question: z.string().max(250), answer: z.string().max(1200) })).max(20).default([]),
  }).optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(3).max(250),
        answer: z.string().trim().min(3).max(1200),
      }),
    )
    .max(20)
    .default([]),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
});

export async function dashboard(req: Request, res: Response) {
  const days = Math.min(365, Math.max(1, Number(req.query.days) || 30));
  const since = new Date(Date.now() - days * 86400000);
  const [
    views,
    uniqueSessions,
    clicks,
    enquiries,
    posts,
    recentEvents,
    topPages,
    daily,
    sources,
    devices,
  ] = await Promise.all([
    AnalyticsEvent.countDocuments({
      type: "page_view",
      createdAt: { $gte: since },
    }),
    AnalyticsEvent.distinct("sessionId", {
      type: "page_view",
      createdAt: { $gte: since },
      sessionId: { $ne: null },
    }),
    AnalyticsEvent.countDocuments({
      type: {
        $in: ["cta_click", "phone_click", "whatsapp_click", "email_click"],
      },
      createdAt: { $gte: since },
    }),
    Lead.countDocuments({ createdAt: { $gte: since } }),
    BlogPost.countDocuments(),
    AnalyticsEvent.find().sort({ createdAt: -1 }).limit(10).lean(),
    AnalyticsEvent.aggregate([
      { $match: { type: "page_view", createdAt: { $gte: since } } },
      { $group: { _id: "$path", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 8 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: since }, type: "page_view" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          views: { $sum: 1 },
          visitors: { $addToSet: "$sessionId" },
        },
      },
      { $project: { views: 1, visitors: { $size: "$visitors" } } },
      { $sort: { _id: 1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: since }, type: "page_view" } },
      {
        $project: {
          source: {
            $cond: [
              {
                $or: [
                  { $eq: ["$referrer", ""] },
                  { $eq: [{ $type: "$referrer" }, "missing"] },
                ],
              },
              "Direct",
              "$referrer",
            ],
          },
        },
      },
      { $group: { _id: "$source", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 8 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: since }, type: "page_view" } },
      {
        $project: {
          device: {
            $cond: [
              {
                $regexMatch: {
                  input: { $ifNull: ["$userAgent", ""] },
                  regex: /Mobile|Android|iPhone/i,
                },
              },
              "Mobile",
              "Desktop",
            ],
          },
        },
      },
      { $group: { _id: "$device", views: { $sum: 1 } } },
    ]),
  ]);
  return res.json({
    period: `${days} days`,
    totals: {
      views,
      visitors: uniqueSessions.length,
      clicks,
      enquiries,
      posts,
      conversionRate: uniqueSessions.length
        ? Number(((enquiries / uniqueSessions.length) * 100).toFixed(1))
        : 0,
    },
    topPages,
    recentEvents,
    daily,
    sources,
    devices,
  });
}

export async function listPosts(_req: Request, res: Response) {
  return res.json(await BlogPost.find().sort({ updatedAt: -1 }).lean());
}
export async function createPost(req: Request, res: Response) {
  const p = postSchema.safeParse(req.body);
  if (!p.success)
    return res.status(400).json({
      error: "Check the blog fields",
      fields: p.error.flatten().fieldErrors,
    });
  const post = await BlogPost.create({
    ...p.data,
    publishedAt:
      p.data.status === "published"
        ? p.data.scheduledAt || new Date()
        : undefined,
  });
  return res.status(201).json(post);
}
export async function updatePost(req: Request, res: Response) {
  const p = postSchema.partial().safeParse(req.body);
  if (!p.success)
    return res.status(400).json({
      error: "Check the blog fields",
      fields: p.error.flatten().fieldErrors,
    });
  const update = {
    ...p.data,
    ...(p.data.status === "published"
      ? { publishedAt: p.data.scheduledAt || new Date() }
      : {}),
  };
  const post = await BlogPost.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  return post
    ? res.json(post)
    : res.status(404).json({ error: "Post not found" });
}
export async function deletePost(req: Request, res: Response) {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  return post
    ? res.json({ success: true })
    : res.status(404).json({ error: "Post not found" });
}
export async function listLeads(_req: Request, res: Response) {
  return res.json(await Lead.find().sort({ createdAt: -1 }).limit(500).lean());
}
export async function updateLead(req: Request, res: Response) {
  const p = leadStatus.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: "Invalid lead update" });
  const changes = Object.entries(p.data)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value ?? "cleared"}`)
    .join(", ");
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    {
      $set: p.data,
      $push: {
        activity: {
          action: "Updated",
          detail: changes,
          by: res.locals.user?.email,
          at: new Date(),
        },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  return lead
    ? res.json(lead)
    : res.status(404).json({ error: "Lead not found" });
}
export async function viewLead(req: Request, res: Response) {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { $set: { viewedAt: new Date() } },
    { new: true },
  );
  return lead
    ? res.json(lead)
    : res.status(404).json({ error: "Lead not found" });
}

export async function listClientLogos(_req: Request, res: Response) {
  return res.json(
    await ClientLogo.find()
      .select("+imageData")
      .sort({ order: 1, createdAt: 1 })
      .lean(),
  );
}

export async function createClientLogo(req: Request, res: Response) {
  const parsed = clientLogoSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Check the client name and logo file" });

  const logo = await ClientLogo.create(parsed.data);
  return res.status(201).json(logo);
}

export async function updateClientLogo(req: Request, res: Response) {
  const parsed = clientLogoUpdateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid client logo update" });

  const logo = await ClientLogo.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  }).select("+imageData");
  return logo
    ? res.json(logo)
    : res.status(404).json({ error: "Client logo not found" });
}

export async function deleteClientLogo(req: Request, res: Response) {
  const logo = await ClientLogo.findByIdAndDelete(req.params.id);
  return logo
    ? res.json({ success: true })
    : res.status(404).json({ error: "Client logo not found" });
}

export async function listServices(_req: Request, res: Response) {
  return res.json(await Service.find().sort({ updatedAt: -1 }).lean());
}

export async function createService(req: Request, res: Response) {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({
      error: "Check the service fields",
      fields: parsed.error.flatten().fieldErrors,
    });
  const service = await Service.create(parsed.data);
  return res.status(201).json(service);
}

export async function updateService(req: Request, res: Response) {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Check the service fields" });
  const service = await Service.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  });
  return service
    ? res.json(service)
    : res.status(404).json({ error: "Service not found" });
}

export async function deleteService(req: Request, res: Response) {
  const service = await Service.findByIdAndDelete(req.params.id);
  return service
    ? res.json({ success: true })
    : res.status(404).json({ error: "Service not found" });
}
