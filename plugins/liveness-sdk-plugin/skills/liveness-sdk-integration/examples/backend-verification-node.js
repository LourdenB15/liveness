import express from "express";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(
    `Liveness verification server running on http://localhost:${PORT}`,
  );
});
