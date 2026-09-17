import crypto from "crypto";
import * as livenessRepository from "../repositories/liveness.repository.js";

const activeSessions = new Map();
const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes

function pruneExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt <= now) {
      activeSessions.delete(token);
    }
  }
}

const sessionPruneInterval = setInterval(pruneExpiredSessions, 2 * 60 * 1000);
if (sessionPruneInterval.unref) {
  sessionPruneInterval.unref();
}

export function createSession(adminId, apiKeyId = null, customChallenges = null) {
  const sessionToken = `live_sess_${crypto.randomBytes(24).toString("hex")}`;
  const pool = ["BLINK", "TURN_LEFT", "TURN_RIGHT"];
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const challenges =
    customChallenges &&
    Array.isArray(customChallenges) &&
    customChallenges.length > 0
      ? customChallenges
      : ["WAITING", ...shuffled, "WAITING"];

  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  const session = {
    sessionToken,
    adminId,
    apiKeyId,
    challenges,
    createdAt: now,
    expiresAt,
    used: false,
  };

  activeSessions.set(sessionToken, session);

  return {
    sessionToken,
    challenges,
    expiresAt,
  };
}

export function getSession(sessionToken) {
  return activeSessions.get(sessionToken) || null;
}

export function consumeSession(sessionToken) {
  const session = activeSessions.get(sessionToken);
  if (session) {
    session.used = true;
    return true;
  }
  return false;
}

export async function enrollUser(adminId, name, descriptor, apiKeyId = null) {
  const enrolledUser = await livenessRepository.addUser(
    adminId,
    name,
    descriptor,
    apiKeyId,
  );

  await livenessRepository.addVerificationLog(
    adminId,
    enrolledUser.id,
    enrolledUser.name,
    1.0,
    "ENROLLED",
    apiKeyId,
  );

  return enrolledUser;
}

export const COSINE_SIMILARITY_THRESHOLD = 0.95;
export const EUCLIDEAN_DISTANCE_THRESHOLD = 0.3;

export async function verifyUser(
  descriptor,
  adminId,
  metric = "both",
  apiKeyId = null,
) {
  const closestMatch = await livenessRepository.findClosestMatch(
    descriptor,
    adminId,
    metric,
  );

  let status = "FAILURE";
  let match = null;

  if (closestMatch.length > 0) {
    match = closestMatch[0];
    const isVerified =
      Number(match.similarity) >= COSINE_SIMILARITY_THRESHOLD &&
      Number(match.distance) <= EUCLIDEAN_DISTANCE_THRESHOLD;

    if (isVerified) {
      status = "SUCCESS";
    }
  }

  await livenessRepository.addVerificationLog(
    adminId,
    match?.id || null,
    match?.name || "Unknown",
    match?.similarity || 0,
    status,
    apiKeyId,
  );

  const responsePayload = {
    verified: status === "SUCCESS",
    match: match
      ? {
          id: match.id,
          name: match.name,
          similarity: Number(match.similarity),
          distance: Number(match.distance),
        }
      : null,
    status,
    metric,
  };
  return responsePayload;
}

export async function verifyUserById(
  descriptor,
  targetId,
  adminId,
  metric = "both",
  apiKeyId = null,
) {
  const user = await livenessRepository.findMatchById(
    descriptor,
    targetId,
    adminId,
  );

  let status = "FAILURE";
  let match = null;

  if (user.length > 0) {
    match = user[0];
    const isVerified =
      Number(match.similarity) >= COSINE_SIMILARITY_THRESHOLD &&
      Number(match.distance) <= EUCLIDEAN_DISTANCE_THRESHOLD;

    if (isVerified) {
      status = "SUCCESS";
    }
  }

  await livenessRepository.addVerificationLog(
    adminId,
    match?.id || null,
    match?.name || "Unknown",
    match?.similarity || 0,
    status,
    apiKeyId,
  );

  const responsePayload = {
    verified: status === "SUCCESS",
    match: match
      ? {
          id: match.id,
          name: match.name,
          similarity: Number(match.similarity),
          distance: Number(match.distance),
        }
      : null,
    status,
    metric,
  };
  return responsePayload;
}
