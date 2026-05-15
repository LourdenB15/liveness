import cors from "cors";
import "dotenv/config";
import express from "express";
import dashboardRoutes from "./routes/dashboard.js";
import livenessRoutes from "./routes/liveness.js";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Liveness SaaS API running on port ${PORT}`);
});
