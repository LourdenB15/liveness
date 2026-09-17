import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import pool from "./db.js";
import { securityHeaders } from "./middleware/securityHeaders.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Trust first proxy when running behind reverse proxy (Render, Nginx, Cloudflare)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(securityHeaders);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim().replace(/\/+$/, ""))
      .filter(Boolean)
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or server-to-server calls)
      if (!origin) {
        return callback(null, true);
      }
      // Allow localhost origins only during development
      if (
        process.env.NODE_ENV !== "production" &&
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api", routes);

// Health check with coalesced caching to prevent connection pool exhaustion
let lastHealthCheck = 0;
let cachedDbStatus = false;
let pendingHealthQuery = null;
const HEALTH_CACHE_TTL_MS = 10000;

async function checkDatabaseHealth() {
  const now = Date.now();
  if (now - lastHealthCheck < HEALTH_CACHE_TTL_MS) {
    return cachedDbStatus;
  }
  if (pendingHealthQuery) {
    return pendingHealthQuery;
  }
  pendingHealthQuery = pool
    .query("SELECT 1")
    .then(() => {
      cachedDbStatus = true;
      lastHealthCheck = Date.now();
      return true;
    })
    .catch(() => {
      cachedDbStatus = false;
      lastHealthCheck = Date.now();
      return false;
    })
    .finally(() => {
      pendingHealthQuery = null;
    });

  return pendingHealthQuery;
}

app.get("/health", async (req, res) => {
  const isConnected = await checkDatabaseHealth();
  if (isConnected) {
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Not allowed by CORS" });
  }
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Liveness Cloud API running on port ${PORT}`);
});
