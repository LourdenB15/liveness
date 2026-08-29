import express from "express";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 4000;
const WEBHOOK_SECRET =
  process.env.LIVENESS_WEBHOOK_SECRET || "webhook-secret-key";

// Capture raw body buffer for HMAC signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

// In-memory identity database (Replace with PostgreSQL + pgvector for production)
const enrolledIdentities = new Map();

/**
 * Calculates Cosine Similarity between two numerical vectors.
 * Because vectors from the SDK model are normalized, dot product gives cosine similarity.
 */
function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}

/**
 * 1. ENROLL USER
 */
app.post("/api/liveness/enroll", (req, res) => {
  const { name, descriptor, sessionToken, integrity } = req.body;

  if (
    !name ||
    !descriptor ||
    !Array.isArray(descriptor) ||
    descriptor.length !== 128
  ) {
    return res
      .status(400)
      .json({ error: "Invalid payload. 128-d descriptor and name required." });
  }

  const id = crypto.randomUUID();
  enrolledIdentities.set(id, { id, name, descriptor, createdAt: new Date() });

  console.log(`[Enrollment] Enrolled user: ${name} (ID: ${id})`);
  return res.status(201).json({ id, name, success: true });
});

/**
 * 2. VERIFY USER (1:N or 1:1)
 */
app.post("/api/liveness/verify", (req, res) => {
  const { descriptor, targetId, threshold = 0.95 } = req.body;

  if (!descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: "128-d descriptor vector required." });
  }

  // 1:1 Verification against specific target
  if (targetId) {
    const target = enrolledIdentities.get(targetId);
    if (!target) {
      return res
        .status(404)
        .json({ verified: false, error: "Target identity not found." });
    }
    const similarity = calculateCosineSimilarity(target.descriptor, descriptor);
    const distance = calculateEuclideanDistance(target.descriptor, descriptor);
    const verified = similarity >= threshold && distance <= 0.3;
    return res.json({
      verified,
      similarity: Number(similarity.toFixed(4)),
      distance: Number(distance.toFixed(4)),
      match: verified ? { id: target.id, name: target.name } : null,
    });
  }

  // 1:N Verification against all enrolled identities
  let bestMatch = null;
  let maxSimilarity = -1;
  let matchDistance = Infinity;

  for (const [id, user] of enrolledIdentities.entries()) {
    const sim = calculateCosineSimilarity(user.descriptor, descriptor);
    const dist = calculateEuclideanDistance(user.descriptor, descriptor);
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      matchDistance = dist;
      bestMatch = user;
    }
  }

  const verified =
    maxSimilarity >= threshold && matchDistance <= 0.3 && bestMatch !== null;

  return res.json({
    verified,
    similarity: maxSimilarity > -1 ? Number(maxSimilarity.toFixed(4)) : 0,
    distance: matchDistance < Infinity ? Number(matchDistance.toFixed(4)) : 0,
    match: verified ? { id: bestMatch.id, name: bestMatch.name } : null,
  });
});

/**
 * 3. WEBHOOK ENDPOINT (WITH HMAC SIGNATURE VALIDATION)
 */
app.post("/webhooks/liveness", (req, res) => {
  const signature = req.headers["x-liveness-signature"];

  if (!signature) {
    return res
      .status(401)
      .json({ error: "Missing x-liveness-signature header" });
  }

  // Generate expected HMAC-SHA256 signature from raw body buffer
  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    console.error("[Webhook] Signature verification failed.");
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { event, data } = req.body;
  console.log(`[Webhook] Verified event received: ${event}`, data);

  return res.status(200).json({ received: true });
});

app.listen(PORT, () => {
  console.log(
    `Liveness verification server running on http://localhost:${PORT}`,
  );
});
