import bcrypt from "bcrypt";
import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * POST /api/dashboard/signup
 * Body: { username, password }
 */
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
      [username, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      return res.status(409).json({ error: "Username already exists" });
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create administrator account" });
  }
});

/**
 * POST /api/dashboard/login
 * Body: { username, password }
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // 1. Find admin by username
    const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Success (Using a mock token for now)
    res.json({
      id: admin.id,
      username: admin.username,
      token: "mock_session_token_" + admin.id,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

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
    const result = await pool.query("SELECT id, name, enrolled_at as \"enrolledAt\" FROM users ORDER BY enrolled_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Users list error:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

/**
 * DELETE /api/dashboard/users/:id
 */
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("User delete error:", error);
    res.status(500).json({ error: "Failed to delete user." });
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
    const result = await pool.query("SELECT id, name, key_hash as \"key\", created_at as \"createdAt\" FROM api_keys ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("API keys error:", error);
    res.status(500).json({ error: "Failed to fetch API keys." });
  }
});

/**
 * POST /api/dashboard/api-keys
 */
router.post("/api-keys", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const mockKey = `live_pk_mock_${Math.random().toString(36).substr(2, 16)}`;
    const result = await pool.query(
      "INSERT INTO api_keys (name, key_hash) VALUES ($1, $2) RETURNING id, name, key_hash as \"key\", created_at as \"createdAt\"",
      [name, mockKey]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("API key creation error:", error);
    res.status(500).json({ error: "Failed to create API key." });
  }
});

/**
 * DELETE /api/dashboard/api-keys/:id
 */
router.delete("/api-keys/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM api_keys WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("API key delete error:", error);
    res.status(500).json({ error: "Failed to delete API key." });
  }
});

export default router;
