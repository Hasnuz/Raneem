import "dotenv/config";
import { notifyLead } from "../services/email.js";

try {
  const sent = await notifyLead({
    _id: "EMAIL-TEST",
    firstName: "Website",
    lastName: "Test",
    email:
      process.env.LEAD_NOTIFICATION_EMAIL ||
      process.env.SMTP_USER ||
      "test@example.com",
    phone: "+971 50 951 5270",
    service: "Email notification test",
    message:
      "Your Raneem website enquiry email notifications are configured correctly.",
    sourcePage: "/contact",
    createdAt: new Date(),
  });

  if (!sent) {
    console.error(
      "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and LEAD_NOTIFICATION_EMAIL in backend/.env.",
    );
    process.exitCode = 1;
  } else {
    console.info("Test enquiry email sent successfully.");
  }
} catch (error) {
  const smtpError = error as {
    code?: string;
    responseCode?: number;
    message?: string;
  };

  if (smtpError.code === "EAUTH" || smtpError.responseCode === 535) {
    console.error(
      [
        "Gmail rejected the SMTP credentials.",
        "1. Use a Google App Password, not the normal Gmail password.",
        "2. Make sure SMTP_USER is the account that created the App Password.",
        "3. If needed, create a new App Password after enabling 2-Step Verification.",
      ].join("\n"),
    );
  } else {
    console.error(`Email test failed: ${smtpError.message || "Unknown error"}`);
  }

  process.exitCode = 1;
}
