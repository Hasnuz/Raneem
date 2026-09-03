import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/db.js";
import { User } from "../models/User.js";

const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Raneem Administrator";
if (!email || !password || password.length < 12)
  throw new Error(
    "Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters",
  );
try {
  await connectDatabase();
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    { name, email, passwordHash, role: "admin", active: true },
    { upsert: true, new: true },
  );
  console.info(`Admin account ready for ${email}`);
  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (
    message.includes("bad auth") ||
    message.includes("authentication failed")
  ) {
    console.error(
      [
        "MongoDB Atlas rejected the database username or password.",
        "1. In Atlas, open Security > Database Access.",
        "2. Create a database user or reset that user's password.",
        "3. Copy the Atlas Drivers connection string again and replace <db_password>.",
        "4. URL-encode reserved characters in the database password.",
        "5. Add /raneem before the query string, then rerun this command.",
        "Note: ADMIN_EMAIL and ADMIN_PASSWORD are separate from the Atlas database credentials.",
      ].join("\n"),
    );
  } else if (message.includes("Could not connect to any servers")) {
    console.error(
      [
        "Could not reach the MongoDB Atlas cluster.",
        "1. In Atlas, open Security > Network Access and add your current IP address.",
        "2. Confirm the cluster is active and not paused.",
        "3. Confirm your firewall or VPN allows outbound TCP traffic on port 27017.",
        "4. Then run this command again: npm run create-admin -w backend",
      ].join("\n"),
    );
  } else {
    console.error(`Admin creation failed: ${message}`);
  }
  process.exit(1);
}
