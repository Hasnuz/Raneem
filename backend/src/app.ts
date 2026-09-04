import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
export const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const productionOrigins = [
  "https://raneembms.com",
  "https://www.raneembms.com",
  "https://raneem-frontend.vercel.app",
];

const configuredOrigins = [
  ...(process.env.CORS_ORIGIN || "http://localhost:3000").split(","),
  ...productionOrigins,
]
  .map((origin) => origin.trim().replace(/^['"]|['"]$/g, "").replace(/\/$/, ""))
  .filter(Boolean);

const isDevelopmentOrigin = (origin: string) => {
  if (process.env.NODE_ENV === "production") return false;

  try {
    const hostname = new URL(origin).hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    );
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        configuredOrigins.includes(origin) ||
        isDevelopmentOrigin(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Origin is not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(compression());
const regularJson = express.json({ limit: "100kb" });
const logoUploadJson = express.json({ limit: "3mb" });
app.use((req, res, next) =>
  req.method === "POST" &&
  ["/api/v1/admin/clients", "/api/v1/admin/media", "/api/v1/admin/government-entities"].includes(req.path)
    ? logoUploadJson(req, res, next)
    : regularJson(req, res, next),
);
app.get("/health", (_q, r) => r.json({ status: "ok" }));
app.use("/api/v1", routes);
app.use((_q, r) => r.status(404).json({ error: "Not found" }));
app.use(errorHandler);
