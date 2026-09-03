import type { Request, Response } from "express";
import { z } from "zod";
import { Lead } from "../models/Lead.js";
import { notifyLead } from "../services/email.js";
const schema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().max(80).optional(),
  email: z.string().email().max(160),
  phone: z.string().trim().min(7).max(30),
  service: z.string().trim().min(2).max(120),
  companyName: z.string().trim().max(120).optional(),
  message: z.string().trim().max(1000).optional(),
  sourcePage: z.string().trim().max(300).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  gclid: z.string().max(200).optional(),
  consent: z.union([z.literal(true), z.literal("true")]),
  website: z.string().max(0).optional(),
});
export async function createLead(req: Request, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({
      error: "Please check the submitted fields",
      fields: parsed.error.flatten().fieldErrors,
    });
  const { website, ...data } = parsed.data;
  if (website) return res.status(202).json({ success: true });
  const lead = await Lead.create(data);
  res.status(201).json({ success: true, leadId: lead._id });
  notifyLead(lead)
    .then(async (sent) => {
      if (sent)
        await Lead.findByIdAndUpdate(lead._id, {
          notificationSent: true,
          customerConfirmationSent: true,
          $push: {
            activity: {
              action: "Created",
              detail: "Website enquiry received",
              at: new Date(),
            },
          },
        }).exec();
    })
    .catch(() => undefined);
}
