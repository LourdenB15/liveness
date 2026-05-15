import express from "express";
import pool from "../db.js";

const router = express.Router();

// Helper to format vector for Postgres
const formatVector = (vector) => `[${vector.join(",")}]`;

/**
 * POST /api/enroll
 * Body: { name: string, descriptor: number[] }
 */
router.post("/enroll", async (req, res) => {
  const { name, descriptor } = req.body;

  if (!name || !descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: "Name and 128-dimensional descriptor are required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name, descriptor) VALUES ($1, $2) RETURNING id, name, enrolled_at",
      [name, formatVector(descriptor)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ error: "Failed to enroll user." });
  }
});

/**
 * POST /api/verify
 * Body: { descriptor: number[] }
 */
router.post("/verify", async (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: "128-dimensional descriptor is required." });
  }

  try {
    // Find the closest user using Cosine Distance (<=>)
    // Cosine Similarity = 1 - Cosine Distance
    const queryText = `
      SELECT id, name, 1 - (descriptor <=> $1) AS similarity
      FROM users
      ORDER BY descriptor <=> $1
      LIMIT 1
    `;
    const result = await pool.query(queryText, [formatVector(descriptor)]);

    let status = "FAILURE";
    let match = null;

    if (result.rows.length > 0) {
      match = result.rows[0];
      if (match.similarity > 0.8) {
        status = "SUCCESS";
      }
    }

    // Log the attempt
    await pool.query(
      "INSERT INTO verification_logs (user_id, user_name, score, status) VALUES ($1, $2, $3, $4)",
      [match?.id || null, match?.name || "Unknown", match?.similarity || 0, status]
    );

    res.json({
      verified: status === "SUCCESS",
      match: match ? { name: match.name, similarity: match.similarity } : null,
      status
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Failed to verify identity." });
  }
});

export default router;
