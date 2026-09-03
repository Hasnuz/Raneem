import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createLead } from "../controllers/leads.js";
import {
  login,
  logout,
  me,
  verifyTwoFactor,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.js";
import { recordEvent } from "../controllers/analytics.js";
import {
  createPost,
  createClientLogo,
  createService,
  dashboard,
  deleteClientLogo,
  deleteService,
  deletePost,
  listLeads,
  listClientLogos,
  listServices,
  listPosts,
  updateLead,
  viewLead,
  updatePost,
  updateClientLogo,
  updateService,
} from "../controllers/admin.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  Service,
  BlogPost,
  FAQ,
  ClientLogo,
  SiteSetting,
} from "../models/Content.js";
import { Redirect } from "../models/AdminContent.js";
import { chat } from "../controllers/chat.js";
import {
  changePassword,
  createMedia,
  createRedirect,
  createTestimonial,
  createUser,
  deleteMedia,
  deleteRedirect,
  deleteTestimonial,
  listMedia,
  listSettings,
  listTestimonials,
  listUsers,
  publicTestimonials,
  revokeSessions,
  saveSettings,
  updateTestimonial,
  updateUser,
  publicGovernmentEntities,
  listGovernmentEntities,
  createGovernmentEntity,
  updateGovernmentEntity,
  deleteGovernmentEntity,
} from "../controllers/adminExtras.js";

const router = Router();
const leadLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
const analyticsLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
const chatLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.post("/leads", leadLimit, asyncHandler(createLead));
router.post("/analytics/events", analyticsLimit, asyncHandler(recordEvent));
router.post("/chat", chatLimit, asyncHandler(chat));
router.post("/auth/login", authLimit, asyncHandler(login));
router.post("/auth/verify-2fa", authLimit, asyncHandler(verifyTwoFactor));
router.post(
  "/auth/request-password-reset",
  authLimit,
  asyncHandler(requestPasswordReset),
);
router.post("/auth/reset-password", authLimit, asyncHandler(resetPassword));
router.post("/auth/logout", logout);
router.get("/auth/me", requireAuth, me);
router.get(
  "/services",
  asyncHandler(async (_q, r) =>
    r.json(
      await Service.find({ status: "published" })
        .sort({ order: 1, title: 1 })
        .lean(),
    ),
  ),
);
router.get(
  "/services/:slug",
  asyncHandler(async (q, r) => {
    const x = await Service.findOne({
      slug: q.params.slug,
      status: "published",
    }).lean();
    return x ? r.json(x) : r.status(404).json({ error: "Not found" });
  }),
);
router.get(
  "/blog",
  asyncHandler(async (_q, r) =>
    r.json(
      await BlogPost.find({
        status: "published",
        publishedAt: { $lte: new Date() },
      })
        .select("-content")
        .sort({ publishedAt: -1 })
        .lean(),
    ),
  ),
);
router.get(
  "/blog/:slug",
  asyncHandler(async (q, r) => {
    const x = await BlogPost.findOne({
      slug: q.params.slug,
      status: "published",
      publishedAt: { $lte: new Date() },
    }).lean();
    return x ? r.json(x) : r.status(404).json({ error: "Not found" });
  }),
);
router.get(
  "/faqs",
  asyncHandler(async (_q, r) =>
    r.json(await FAQ.find({ published: true }).sort({ order: 1 }).lean()),
  ),
);
router.get(
  "/clients",
  asyncHandler(async (_q, r) =>
    r.json(
      await ClientLogo.find({ active: true })
        .select("+imageData")
        .sort({ order: 1, createdAt: 1 })
        .lean(),
    ),
  ),
);
router.get("/testimonials", asyncHandler(publicTestimonials));
router.get("/government-entities", asyncHandler(publicGovernmentEntities));
router.get(
  "/settings/public",
  asyncHandler(async (_q, r) =>
    r.json(await SiteSetting.find({ group: "seo" }).lean()),
  ),
);
router.get(
  "/redirects/resolve",
  asyncHandler(async (q, r) => {
    const item = await Redirect.findOne({
      from: String(q.query.path || ""),
      active: true,
    }).lean();
    return r.json(item || null);
  }),
);

router.use("/admin", requireAuth);
router.get("/admin/dashboard", asyncHandler(dashboard));
router.get("/admin/leads", asyncHandler(listLeads));
router.patch("/admin/leads/:id", asyncHandler(updateLead));
router.post("/admin/leads/:id/view", asyncHandler(viewLead));
router.get("/admin/posts", asyncHandler(listPosts));
router.post("/admin/posts", asyncHandler(createPost));
router.patch("/admin/posts/:id", asyncHandler(updatePost));
router.delete("/admin/posts/:id", requireAdmin, asyncHandler(deletePost));
router.get("/admin/clients", asyncHandler(listClientLogos));
router.post("/admin/clients", requireAdmin, asyncHandler(createClientLogo));
router.patch(
  "/admin/clients/:id",
  requireAdmin,
  asyncHandler(updateClientLogo),
);
router.delete(
  "/admin/clients/:id",
  requireAdmin,
  asyncHandler(deleteClientLogo),
);
router.get("/admin/services", asyncHandler(listServices));
router.post("/admin/services", requireAdmin, asyncHandler(createService));
router.patch("/admin/services/:id", requireAdmin, asyncHandler(updateService));
router.delete("/admin/services/:id", requireAdmin, asyncHandler(deleteService));
router.get("/admin/media", asyncHandler(listMedia));
router.post("/admin/media", requireAdmin, asyncHandler(createMedia));
router.delete("/admin/media/:id", requireAdmin, asyncHandler(deleteMedia));
router.get("/admin/testimonials", asyncHandler(listTestimonials));
router.post("/admin/testimonials", asyncHandler(createTestimonial));
router.patch("/admin/testimonials/:id", asyncHandler(updateTestimonial));
router.delete(
  "/admin/testimonials/:id",
  requireAdmin,
  asyncHandler(deleteTestimonial),
);
router.get("/admin/settings", requireAdmin, asyncHandler(listSettings));
router.put("/admin/settings", requireAdmin, asyncHandler(saveSettings));
router.post("/admin/redirects", requireAdmin, asyncHandler(createRedirect));
router.delete(
  "/admin/redirects/:id",
  requireAdmin,
  asyncHandler(deleteRedirect),
);
router.get("/admin/users", requireAdmin, asyncHandler(listUsers));
router.post("/admin/users", requireAdmin, asyncHandler(createUser));
router.patch("/admin/users/:id", requireAdmin, asyncHandler(updateUser));
router.post("/admin/change-password", asyncHandler(changePassword));
router.post("/admin/revoke-sessions", asyncHandler(revokeSessions));
router.get("/admin/government-entities", asyncHandler(listGovernmentEntities));
router.post("/admin/government-entities", requireAdmin, asyncHandler(createGovernmentEntity));
router.patch("/admin/government-entities/:id", requireAdmin, asyncHandler(updateGovernmentEntity));
router.delete("/admin/government-entities/:id", requireAdmin, asyncHandler(deleteGovernmentEntity));

export default router;
