import bcrypt from "bcrypt";
import express from "express";
import { z } from "zod";
import pool from "../db.js";

const router = express.Router();

// Validation Schemas
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const apiKeySchema = z.object({
  name: z.string().min(1, "Key name is required"),
});

/**
 * POST /api/dashboard/signup
 * Body: { username, password, firstName, lastName, email }
 */
router.post("/signup", async (req, res) => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }

  const { username, password, firstName, lastName, email } = validation.data;

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO admins (username, password_hash, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, first_name as "firstName", last_name as "lastName", email, subscription_tier as "subscriptionTier", created_at',
      [username, passwordHash, firstName, lastName, email],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      if (error.detail.includes("username")) {
        return res.status(409).json({ error: "Username already exists" });
      }
      if (error.detail.includes("email")) {
        return res.status(409).json({ error: "Email already exists" });
      }
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
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }

  const { username, password } = validation.data;

  try {
    // 1. Find admin by username
    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username],
    );

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
      firstName: admin.first_name,
      lastName: admin.last_name,
      email: admin.email,
      subscriptionTier: admin.subscription_tier,
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
    const logsCount = await pool.query(
      "SELECT COUNT(*) FROM verification_logs",
    );
    const successLogsCount = await pool.query(
      "SELECT COUNT(*) FROM verification_logs WHERE status = 'SUCCESS'",
    );

    const totalLogs = parseInt(logsCount.rows[0].count);
    const successLogs = parseInt(successLogsCount.rows[0].count);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalChecks: totalLogs,
      passRate: totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0,
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
    const result = await pool.query(
      'SELECT id, name, enrolled_at as "enrolledAt" FROM users ORDER BY enrolled_at DESC',
    );
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
    const result = await pool.query(
      'SELECT id, user_name as "userName", score, status, timestamp FROM verification_logs ORDER BY timestamp DESC LIMIT 100',
    );
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
    const result = await pool.query(
      'SELECT id, name, key_hash as "key", created_at as "createdAt" FROM api_keys ORDER BY created_at DESC',
    );
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
  const validation = apiKeySchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }

  const { name } = validation.data;

  try {
    const mockKey = `live_pk_mock_${Math.random().toString(36).substr(2, 16)}`;
    const result = await pool.query(
      'INSERT INTO api_keys (name, key_hash) VALUES ($1, $2) RETURNING id, name, key_hash as "key", created_at as "createdAt"',
      [name, mockKey],
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

/**
 * GET /api/dashboard/billing/:adminId
 */
router.get("/billing/:adminId", async (req, res) => {
  const { adminId } = req.params;
  try {
    const result = await pool.query(
      'SELECT subscription_tier as "subscriptionTier" FROM admins WHERE id = $1',
      [adminId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Billing fetch error:", error);
    res.status(500).json({ error: "Failed to fetch billing info." });
  }
});

/**
 * POST /api/dashboard/billing/upgrade
 */
router.post("/billing/upgrade", async (req, res) => {
  const { adminId } = req.body;
  try {
    const result = await pool.query(
      "UPDATE admins SET subscription_tier = 'pro' WHERE id = $1 RETURNING subscription_tier as \"subscriptionTier\"",
      [adminId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Billing upgrade error:", error);
    res.status(500).json({ error: "Failed to upgrade subscription." });
  }
});

export default router;
