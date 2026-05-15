import cors from "cors";
import "dotenv/config";
import express from "express";
import dashboardRoutes from "./routes/dashboard.js";
import livenessRoutes from "./routes/liveness.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/liveness", livenessRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Liveness SaaS API running on port ${PORT}`);
});
