import nodemailer from "nodemailer";

type LeadNotification = {
  _id: unknown;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone: string;
  service: string;
  companyName?: string | null;
  message?: string | null;
  sourcePage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  gclid?: string | null;
  createdAt?: Date | null;
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function notifyLead(lead: LeadNotification) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.LEAD_NOTIFICATION_EMAIL
  ) {
    return false;
  }

  // Google displays App Passwords in four groups for readability, but SMTP
  // authentication expects the same password without whitespace.
  const smtpPassword =
    process.env.SMTP_HOST.toLowerCase() === "smtp.gmail.com"
      ? process.env.SMTP_PASS.replace(/\s+/g, "")
      : process.env.SMTP_PASS;

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: smtpPassword },
  });

  const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const fields = [
    ["Lead ID", lead._id],
    [
      "Received",
      lead.createdAt?.toLocaleString("en-AE", { timeZone: "Asia/Dubai" }),
    ],
    ["Name", name],
    ["Email", lead.email],
    ["Phone / WhatsApp", lead.phone],
    ["Company", lead.companyName],
    ["Requested service", lead.service],
    ["Source page", lead.sourcePage],
    ["UTM source", lead.utmSource],
    ["UTM medium", lead.utmMedium],
    ["UTM campaign", lead.utmCampaign],
    ["Google click ID", lead.gclid],
  ].filter(([, value]) => value);

  const text = [
    "New website enquiry",
    "",
    ...fields.map(([label, value]) => `${label}: ${String(value)}`),
    "",
    "Message:",
    lead.message || "No message supplied.",
  ].join("\n");

  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th style="padding:10px 14px;text-align:left;color:#536171;border-bottom:1px solid #e6eaf0;width:170px">${escapeHtml(label)}</th><td style="padding:10px 14px;border-bottom:1px solid #e6eaf0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  await transport.sendMail({
    from: `Raneem Website <${process.env.SMTP_USER}>`,
    to: process.env.LEAD_NOTIFICATION_EMAIL,
    replyTo: { name, address: lead.email },
    subject: `New enquiry: ${lead.service} — ${name}`,
    text,
    html: `<div style="background:#f4f7fa;padding:28px;font-family:Arial,sans-serif;color:#071526"><div style="max-width:680px;margin:auto;background:#fff;border:1px solid #e0e6ec;border-radius:14px;overflow:hidden"><div style="background:#071526;padding:24px;color:#fff"><div style="font-size:12px;letter-spacing:2px;color:#d3a65c">RANEEM WEBSITE</div><h1 style="font-size:24px;margin:10px 0 0">New service enquiry</h1></div><table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table><div style="padding:22px"><h2 style="font-size:16px;margin:0 0 10px">Customer message</h2><div style="white-space:pre-wrap;line-height:1.6;background:#f4f7fa;border-radius:8px;padding:16px">${escapeHtml(lead.message || "No message supplied.")}</div><p style="margin:18px 0 0;font-size:12px;color:#687586">Reply to this email to respond directly to ${escapeHtml(name)}.</p></div></div></div>`,
  });

  await transport.sendMail({
    from: `Raneem Businessmen Services <${process.env.SMTP_USER}>`,
    to: lead.email,
    replyTo: process.env.LEAD_NOTIFICATION_EMAIL,
    subject: "We received your enquiry — Raneem Businessmen Services",
    text: `Dear ${name},\n\nThank you for contacting Raneem Businessmen Services about ${lead.service}. Your enquiry has been received and a member of our team will contact you shortly.\n\nReference: ${String(lead._id)}\n\nRaneem Businessmen Services`,
    html: `<div style="background:#f4f7fa;padding:28px;font-family:Arial,sans-serif;color:#071526"><div style="max-width:620px;margin:auto;background:#fff;border:1px solid #e0e6ec;border-radius:14px;overflow:hidden"><div style="background:#071526;padding:24px;color:#fff"><div style="font-size:12px;letter-spacing:2px;color:#d3a65c">RANEEM BUSINESSMEN SERVICES</div><h1 style="font-size:24px;margin:10px 0 0">We received your enquiry</h1></div><div style="padding:26px;line-height:1.7"><p>Dear ${escapeHtml(name)},</p><p>Thank you for contacting Raneem about <strong>${escapeHtml(lead.service)}</strong>. A member of our team will contact you shortly.</p><p style="background:#f4f7fa;border-radius:8px;padding:14px;font-size:13px">Reference: ${escapeHtml(lead._id)}</p><p>Raneem Businessmen Services</p></div></div></div>`,
  });

  return true;
}

export async function sendAdminLoginCode(email: string, code: string) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  )
    return false;
  const password =
    process.env.SMTP_HOST.toLowerCase() === "smtp.gmail.com"
      ? process.env.SMTP_PASS.replace(/\s+/g, "")
      : process.env.SMTP_PASS;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: password },
  });
  await transport.sendMail({
    from: `Raneem Admin <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Raneem admin verification code",
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;padding:24px"><h1 style="font-size:20px">Admin verification</h1><p>Use this code to complete your sign-in:</p><p style="font-size:30px;font-weight:bold;letter-spacing:8px">${escapeHtml(code)}</p><p>This code expires in 10 minutes.</p></div>`,
  });
  return true;
}

export async function sendPasswordResetCode(email: string, code: string) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  )
    return false;
  const password =
    process.env.SMTP_HOST.toLowerCase() === "smtp.gmail.com"
      ? process.env.SMTP_PASS.replace(/\s+/g, "")
      : process.env.SMTP_PASS;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: password },
  });
  await transport.sendMail({
    from: `Raneem Admin <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your Raneem admin password",
    text: `Your password reset code is ${code}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;padding:24px"><h1>Password reset</h1><p>Your reset code is:</p><p style="font-size:30px;font-weight:bold;letter-spacing:8px">${escapeHtml(code)}</p><p>This code expires in 10 minutes.</p></div>`,
  });
  return true;
}
