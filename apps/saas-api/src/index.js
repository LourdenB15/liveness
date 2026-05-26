import cors from "cors";
import "dotenv/config";
import express from "express";
import pool from "./db.js";
import dashboardRoutes from "./routes/dashboard.js";
import livenessRoutes from "./routes/liveness.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
  }),
);
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/liveness", livenessRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Liveness Cloud API running on port ${PORT}`);
});
