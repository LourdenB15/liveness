import crypto from "crypto";

function generateIntegrityHash(descriptor, sessionToken, timestamp) {
  const data = JSON.stringify(descriptor) + sessionToken + timestamp;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}

// In-memory token registry for single-use replay protection with TTL cleanup
const consumedTokens = new Map();
const TOKEN_TTL_MS = 6 * 60 * 1000; // 6 minutes (longer than 5-minute timestamp window)

function pruneExpiredTokens() {
  const now = Date.now();
  for (const [token, expiry] of consumedTokens.entries()) {
    if (expiry <= now) {
      consumedTokens.delete(token);
    }
  }
}

// Periodic cleanup every 5 minutes
const cleanupInterval = setInterval(pruneExpiredTokens, 5 * 60 * 1000);
if (cleanupInterval.unref) {
  cleanupInterval.unref(); // Do not block Node process termination
}

function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function validateIntegrity(req, res, next) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const { descriptor, sessionToken, timestamp, integrity } = req.body;
  if (!descriptor || !sessionToken || !timestamp || !integrity) {
    return res.status(400).json({ error: "Missing security metadata" });
  }

  if (
    typeof sessionToken !== "string" ||
    sessionToken.length < 8 ||
    sessionToken.length > 128
  ) {
    return res.status(400).json({ error: "Invalid session token format" });
  }

  const now = Date.now();
  const maxPastWindow = 5 * 60 * 1000; // 5 minutes
  const maxFutureSkew = 60 * 1000; // 1 minute allowable clock skew

  if (
    typeof timestamp !== "number" ||
    isNaN(timestamp) ||
    timestamp < now - maxPastWindow ||
    timestamp > now + maxFutureSkew
  ) {
    return res
      .status(400)
      .json({ error: "Session expired or clock out of sync" });
  }

  // Replay protection: prevent reuse of previously accepted sessionToken
  if (consumedTokens.has(sessionToken)) {
    return res.status(400).json({
      error: "Session token has already been consumed (replay detected)",
    });
  }

  const expectedHash = generateIntegrityHash(
    descriptor,
    sessionToken,
    timestamp,
  );

  if (!safeCompare(integrity, expectedHash)) {
    return res.status(400).json({ error: "Payload integrity check failed" });
  }

  // Register token as consumed
  consumedTokens.set(sessionToken, now + TOKEN_TTL_MS);

  next();
}
