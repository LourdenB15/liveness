import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /api/dashboard/stats
 */
router.get("/stats", async (req, res) => {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const logsCount = await pool.query("SELECT COUNT(*) FROM verification_logs");
    const successLogsCount = await pool.query("SELECT COUNT(*) FROM verification_logs WHERE status = 'SUCCESS'");

    const totalLogs = parseInt(logsCount.rows[0].count);
    const successLogs = parseInt(successLogsCount.rows[0].count);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalChecks: totalLogs,
      passRate: totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

/**
 * GET /api/dashboard/users
 */
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, enrolled_at FROM users ORDER BY enrolled_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Users list error:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

/**
 * GET /api/dashboard/logs
 */
router.get("/logs", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, user_name as \"userName\", score, status, timestamp FROM verification_logs ORDER BY timestamp DESC LIMIT 100");
    res.json(result.rows);
  } catch (error) {
    console.error("Logs history error:", error);
    res.status(500).json({ error: "Failed to fetch logs." });
  }
});

/**
 * GET /api/dashboard/api-keys
 */
router.get("/api-keys", async (req, res) => {
  try {
    // In a real app, you wouldn't return the hash, and you'd handle key management securely
    const result = await pool.query("SELECT id, name, created_at FROM api_keys ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("API keys error:", error);
    res.status(500).json({ error: "Failed to fetch API keys." });
  }
});

export default router;
