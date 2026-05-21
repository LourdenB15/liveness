import bcrypt from "bcrypt";
import express from "express";
import { z } from "zod";
import pool from "../db.js";

const router = express.Router();

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

const webhookSchema = z.object({
  url: z.string().url("Invalid webhook URL"),
});

router.post("/signup", async (req, res) => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
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

router.post("/login", async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }

  const { username, password } = validation.data;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

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

router.get("/stats", async (req, res) => {
  const { adminId } = req.query;
  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    const usersCount = await pool.query(
      "SELECT COUNT(*) FROM users WHERE admin_id = $1",
      [adminId],
    );
    const logsCount = await pool.query(
      "SELECT COUNT(*) FROM verification_logs WHERE admin_id = $1",
      [adminId],
    );
    const successLogsCount = await pool.query(
      "SELECT COUNT(*) FROM verification_logs WHERE admin_id = $1 AND status = 'SUCCESS'",
      [adminId],
    );
    const spoofLogsCount = await pool.query(
      "SELECT COUNT(*) FROM verification_logs WHERE admin_id = $1 AND status = 'SPOOF_DETECTED'",
      [adminId],
    );

    const totalLogs = parseInt(logsCount.rows[0].count);
    const successLogs = parseInt(successLogsCount.rows[0].count);
    const spoofLogs = parseInt(spoofLogsCount.rows[0].count);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalChecks: totalLogs,
      passRate: totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0,
      spoofAttempts: spoofLogs,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

router.get("/users", async (req, res) => {
  const { adminId } = req.query;
  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, enrolled_at as "enrolledAt" FROM users WHERE admin_id = $1 ORDER BY enrolled_at DESC',
      [adminId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Users list error:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.query;
  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    await pool.query("DELETE FROM users WHERE id = $1 AND admin_id = $2", [
      id,
      adminId,
    ]);
    res.status(204).send();
  } catch (error) {
    console.error("User delete error:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

router.get("/logs", async (req, res) => {
  const { adminId } = req.query;
  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    const result = await pool.query(
      'SELECT id, user_name as "userName", score, status, anti_spoofing as "antiSpoofing", timestamp FROM verification_logs WHERE admin_id = $1 ORDER BY timestamp DESC LIMIT 100',
      [adminId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Logs history error:", error);
    res.status(500).json({ error: "Failed to fetch logs." });
  }
});

router.get("/api-keys", async (req, res) => {
  const { adminId } = req.query;
  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, key_hash as "key", created_at as "createdAt" FROM api_keys WHERE admin_id = $1 ORDER BY created_at DESC',
      [adminId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("API keys error:", error);
    res.status(500).json({ error: "Failed to fetch API keys." });
  }
});

router.post("/api-keys", async (req, res) => {
  const validation = apiKeySchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }

  const { name } = validation.data;
  const { adminId } = req.body;

  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    const mockKey = `live_pk_mock_${Math.random().toString(36).substr(2, 16)}`;
    const result = await pool.query(
      'INSERT INTO api_keys (admin_id, name, key_hash) VALUES ($1, $2, $3) RETURNING id, name, key_hash as "key", created_at as "createdAt"',
      [adminId, name, mockKey],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("API key creation error:", error);
    res.status(500).json({ error: "Failed to create API key." });
  }
});

router.delete("/api-keys/:id", async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.query;

  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    await pool.query("DELETE FROM api_keys WHERE id = $1 AND admin_id = $2", [
      id,
      adminId,
    ]);
    res.status(204).send();
  } catch (error) {
    console.error("API key delete error:", error);
    res.status(500).json({ error: "Failed to delete API key." });
  }
});

router.get("/webhooks", async (req, res) => {
  const { adminId } = req.query;
  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    const result = await pool.query(
      'SELECT id, url, secret, is_active as "isActive", created_at as "createdAt" FROM webhooks WHERE admin_id = $1 ORDER BY created_at DESC',
      [adminId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Webhooks fetch error:", error);
    res.status(500).json({ error: "Failed to fetch webhooks." });
  }
});

router.post("/webhooks", async (req, res) => {
  const validation = webhookSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues[0].message });
  }

  const { url } = validation.data;
  const { adminId } = req.body;

  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    const secret = `whsec_${Math.random().toString(36).substr(2, 24)}`;
    const result = await pool.query(
      'INSERT INTO webhooks (admin_id, url, secret) VALUES ($1, $2, $3) RETURNING id, url, secret, is_active as "isActive", created_at as "createdAt"',
      [adminId, url, secret],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Webhook creation error:", error);
    res.status(500).json({ error: "Failed to create webhook." });
  }
});

router.delete("/webhooks/:id", async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.query;

  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  try {
    await pool.query("DELETE FROM webhooks WHERE id = $1 AND admin_id = $2", [
      id,
      adminId,
    ]);
    res.status(204).send();
  } catch (error) {
    console.error("Webhook delete error:", error);
    res.status(500).json({ error: "Failed to delete webhook." });
  }
});

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
